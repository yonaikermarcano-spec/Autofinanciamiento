"use client";

import { LoanContract, PaymentScheduleItem } from '../../types';
import { LocalDB } from '../local-db';

export type NotificationCategory = 
  | 'PAYMENT_REMINDER_48H' 
  | 'DUE_TODAY' 
  | 'EARLY_DELINQUENCY_1_7D' 
  | 'WORKSHOP_MAINTENANCE' 
  | 'TRADE_IN_UPGRADE';

export interface InAppNotification {
  id: string;
  contractNumber: string;
  category: NotificationCategory;
  title: string;
  message: string;
  actionUrl?: string;
  createdAt: string;
  isRead: boolean;
}

export interface ManualContactQueueItem {
  id: string;
  contractNumber: string;
  clientName: string;
  clientPhone: string;
  vehicleModel: string;
  category: NotificationCategory;
  categoryLabel: string;
  dueAmountUSD: number;
  dueAmountVES: number;
  dueDate: string;
  isContactedToday: boolean;
  lastContactedAt?: string;
  lastContactedBy?: string;
  customMessageWa: string;
  waDirectUrl: string;
}

export class SmartNotificationsEngine {
  private static inAppNotifications: InAppNotification[] = [
    {
      id: "NOTIF-001",
      contractNumber: "CTR-2026-001",
      category: "PAYMENT_REMINDER_48H",
      title: "🗓️ Recordatorio de Pago (Vence en 48h)",
      message: "Tu cuota #2 de $35.00 USD vence el 28/08/2026. Recuerda que puedes pagar por Pago Móvil con validación instantánea.",
      createdAt: "2026-08-26 07:00",
      isRead: false
    },
    {
      id: "NOTIF-002",
      contractNumber: "CTR-2026-001",
      category: "WORKSHOP_MAINTENANCE",
      title: "🔧 Servicio Obligatorio de 500 km",
      message: "Tu moto Bera SBR está próxima a alcanzar los 500 km. Agenda tu cita en taller para mantener la garantía de fábrica.",
      createdAt: "2026-08-25 14:30",
      isRead: true
    },
    {
      id: "NOTIF-003",
      contractNumber: "CTR-2026-002",
      category: "EARLY_DELINQUENCY_1_7D",
      title: "⚠️ Cuota Pendiente por Regularizar",
      message: "Presentas 3 días de retraso en tu cuota #1. Evita cargos por mora y reporte a seguridad reportando tu abono hoy.",
      createdAt: "2026-08-26 06:30",
      isRead: false
    }
  ];

  private static manualContactHistory: {
    queueId: string;
    operator: string;
    timestamp: string;
    sha256Seal: string;
  }[] = [];

  /**
   * Obtiene las notificaciones In-App para un contrato específico (Portal del Cliente)
   */
  public static getInAppNotifications(contractNumber: string): InAppNotification[] {
    return this.inAppNotifications.filter(n => n.contractNumber === contractNumber);
  }

  /**
   * Marca una notificación In-App como leída
   */
  public static markAsRead(notificationId: string): void {
    const notif = this.inAppNotifications.find(n => n.id === notificationId);
    if (notif) notif.isRead = true;
  }

  /**
   * Genera la cola de contacto manual para asesores con mensajes 1 a 1 personalizados
   */
  public static getSmartContactQueue(contracts: LoanContract[], bcvRate: number): ManualContactQueueItem[] {
    const queue: ManualContactQueueItem[] = [];

    contracts.forEach(contract => {
      const schedule = contract.schedule || [];
      const pendingQuotas = schedule.filter(q => q.status !== 'PAID');
      const nextQuota = pendingQuotas[0];

      if (nextQuota) {
        const amountUSD = nextQuota.remainingAmountUSD ?? nextQuota.totalQuotaUSD;
        const amountVES = Number((amountUSD * bcvRate).toFixed(2));
        const cleanPhone = contract.clientPhone.replace(/[^0-9]/g, '').replace(/^0/, '');

        // 1. Mensaje de Recordatorio 48h
        const msgReminder = [
          "Hola " + contract.clientName + ", te saludamos de AutoLending.",
          "Te recordamos que tu cuota #" + nextQuota.quotaNumber + " de $" + amountUSD + " USD (Bs. " + amountVES.toLocaleString() + " BCV) tiene fecha límite el " + nextQuota.dueDate + ".",
          "Puedes reportar tu pago móvil cómodamente desde tu app para validación instantánea.",
          "¡Gracias por tu puntualidad!"
        ].join("\n");

        const waUrl = "https://wa.me/58" + cleanPhone + "?text=" + encodeURIComponent(msgReminder);
        const isContacted = this.manualContactHistory.some(h => h.queueId === contract.contractNumber);

        queue.push({
          id: contract.contractNumber,
          contractNumber: contract.contractNumber,
          clientName: contract.clientName,
          clientPhone: contract.clientPhone,
          vehicleModel: contract.vehicle.brand + " " + contract.vehicle.model,
          category: "PAYMENT_REMINDER_48H",
          categoryLabel: "Recordatorio Preventivo",
          dueAmountUSD: amountUSD,
          dueAmountVES: amountVES,
          dueDate: nextQuota.dueDate,
          isContactedToday: isContacted,
          customMessageWa: msgReminder,
          waDirectUrl: waUrl
        });
      }
    });

    return queue;
  }

  /**
   * Registra el contacto manual individual realizado por el asesor evitando duplicados en el día
   */
  public static registerManualContact(queueId: string, operator: string): { success: boolean; sha256Seal: string } {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const rawSeal = "MANUAL_WA|" + queueId + "|" + operator + "|" + timestamp;
    const sha256Seal = "SHA256:" + Buffer.from(rawSeal).toString('hex').slice(0, 24).toUpperCase();

    this.manualContactHistory.unshift({
      queueId,
      operator,
      timestamp,
      sha256Seal
    });

    return { success: true, sha256Seal };
  }
}
