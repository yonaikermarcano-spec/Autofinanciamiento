"use client";

import { LoanContract } from '../../types';
import { BcvEngine } from '../bcv-engine';
import { TenantOnboardingEngine } from '../tenant-onboarding';

export type NotificationTemplateType = 
  | 'PREVENTIVE_3_DAYS'
  | 'LATE_FEE_ALERT'
  | 'PAYMENT_CONFIRMATION'
  | 'READY_FOR_DELIVERY'
  | 'RECOVERY_WARNING'
  | 'EXPIRED_NOTICE'
  | 'LOAN_SETTLEMENT';

export interface NotificationLog {
  id: string;
  contractNumber: string;
  clientName: string;
  clientPhone: string;
  templateType: NotificationTemplateType;
  messageText: string;
  status: 'SENT' | 'PENDING' | 'QUEUED';
  sentAt: string;
  sha256Seal: string;
}

export interface NotificationTemplate {
  id: NotificationTemplateType;
  title: string;
  category: 'PREVENTIVO' | 'COBRANZA' | 'OPERATIVO' | 'LEGAL';
  description: string;
  body: string;
}

export class WhatsappNotificationEngine {
  private static logs: NotificationLog[] = [
    {
      id: "wpp-001",
      contractNumber: "CTR-2026-001",
      clientName: "José Gregorio Castillo",
      clientPhone: "0414-332-9011",
      templateType: "PAYMENT_CONFIRMATION",
      messageText: "Estimado(a) José Gregorio Castillo, hemos confirmado su abono de $50.00 USD para el Contrato #CTR-2026-001. Recibo: REC-2026-001. Saldo actual: $790.00 USD.",
      status: "SENT",
      sentAt: "2026-08-24 08:30:00",
      sha256Seal: "SHA256:88A920BF1109C2"
    },
    {
      id: "wpp-002",
      contractNumber: "CTR-2026-002",
      clientName: "Carlos Eduardo Pérez",
      clientPhone: "0412-889-4401",
      templateType: "LATE_FEE_ALERT",
      messageText: "ALERTA DE MORA: Carlos Eduardo Pérez, su Contrato #CTR-2026-002 presenta 2 cuotas vencidas y $35.00 USD en recargos por mora. Por favor regularice su pago a la brevedad.",
      status: "SENT",
      sentAt: "2026-08-24 09:15:00",
      sha256Seal: "SHA256:77F129AE44BC91"
    }
  ];

  public static readonly TEMPLATES: Record<NotificationTemplateType, NotificationTemplate> = {
    PREVENTIVE_3_DAYS: {
      id: 'PREVENTIVE_3_DAYS',
      title: 'Recordatorio Preventivo (3 Días Antes)',
      category: 'PREVENTIVO',
      description: 'Notificación preventiva para recordar al cliente su próxima cuota y evitar recargos por mora.',
      body: '¡Hola, {CLIENT_NAME}! Te saludamos de {COMPANY_NAME}. Le recordamos que su cuota #{QUOTA_NUM} de su financiamiento {VEHICLE} por un monto de {AMOUNT_USD} USD (aprox. {AMOUNT_VES} a tasa del día) vence el próximo {DUE_DATE}.\n\nPuede realizar su abono por Pago Móvil al RIF {COMPANY_RIF} (Banesco) o Binance Pay. ¡Gracias por su puntualidad!'
    },
    LATE_FEE_ALERT: {
      id: 'LATE_FEE_ALERT',
      title: 'Alerta de Mora & Cuota Vencida',
      category: 'COBRANZA',
      description: 'Aviso formal de incumplimiento con cálculo de mora acumulada y plazo de regularización.',
      body: '⚠️ AVISO DE MORA: Estimado(a) {CLIENT_NAME}, le informamos que su cuota #{QUOTA_NUM} del Contrato #{CONTRACT_NUM} se encuentra VENCIDA. Su saldo adeudado es de {AMOUNT_USD} USD más {LATE_FEE_USD} USD por concepto de recargo de mora.\n\nPor favor comuníquese de inmediato para reportar su pago y evitar el paso de su expediente al departamento de cobranza en calle.'
    },
    PAYMENT_CONFIRMATION: {
      id: 'PAYMENT_CONFIRMATION',
      title: 'Confirmación de Abono & Recibo Oficial',
      category: 'OPERATIVO',
      description: 'Envío instantáneo de comprobante con desglose contable y saldo remanente.',
      body: '✅ ¡PAGO REGISTRADO EXITOSAMENTE! Estimado(a) {CLIENT_NAME}, hemos recibido su abono de {AMOUNT_USD} USD ({AMOUNT_VES}) correspondiente al Contrato #{CONTRACT_NUM}.\n\n📄 Recibo Oficial N°: {RECEIPT_CODE}\n📊 Saldo Remanente: {REMAINING_DEBT_USD} USD\n🏍️ Progreso General: {PROGRESS_PERCENT}%\n\n¡Gracias por mantener su financiamiento al día con {COMPANY_NAME}!'
    },
    READY_FOR_DELIVERY: {
      id: 'READY_FOR_DELIVERY',
      title: 'Aviso de Unidad Lista para Entrega / Visita',
      category: 'OPERATIVO',
      description: 'Notificación de que el cliente alcanzó la meta de cuotas para el retiro de su moto o visita domiciliaria.',
      body: '🎉 ¡EXCELENTES NOTICIAS, {CLIENT_NAME}! Ha alcanzado el porcentaje de cuotas requeridas en su Contrato #{CONTRACT_NUM} para la entrega de su {VEHICLE}.\n\nNuestro equipo se pondrá en contacto para coordinar la inspección domiciliaria y la cita para la entrega oficial en el concesionario. ¡Felicidades!'
    },
    RECOVERY_WARNING: {
      id: 'RECOVERY_WARNING',
      title: 'Notificación de Retención Física en Calle',
      category: 'COBRANZA',
      description: 'Advertencia formal por mora superior a 2 meses con vehículo en posesión.',
      body: '🚨 NOTIFICACIÓN LEGAL EXTRAJUDICIAL: Ciudadano(a) {CLIENT_NAME}, en virtud de acumular más de 2 meses de morosidad en su Contrato #{CONTRACT_NUM} con Reserva de Dominio sobre el vehículo {VEHICLE} (Placa {PLATE}), se ha emitido la ORDEN DE RETENCIÓN FÍSICA EN CAMPO N° {CONTRACT_NUM}-RET.\n\nComuníquese a la brevedad con la Gerencia General para consignar los fondos antes de la ejecución de la medida de retención.'
    },
    EXPIRED_NOTICE: {
      id: 'EXPIRED_NOTICE',
      title: 'Aviso de Contrato Expirado & Retención de Fondos',
      category: 'LEGAL',
      description: 'Notificación formal por mora superior a 3 meses sin vehículo entregado.',
      body: '⚖️ NOTIFICACIÓN DE RESCISIÓN: Estimado(a) {CLIENT_NAME}, habiendo transcurrido más de 3 meses sin registrar abonos en su Contrato #{CONTRACT_NUM} y de conformidad con la cláusula resolutoria de las Condiciones Generales de Financiamiento, su contrato ha pasado al estatus de EXPIRADO con retención de fondos por incumplimiento contractual.'
    },
    LOAN_SETTLEMENT: {
      id: 'LOAN_SETTLEMENT',
      title: 'Finiquito & Levantamiento de Reserva de Dominio (100% Pagado)',
      category: 'LEGAL',
      description: 'Felicitaciones por cancelación total y citación para firma de liberación notarial.',
      body: '🏆 ¡FELICITACIONES, {CLIENT_NAME}! Ha completado el 100% del pago de su vehículo {VEHICLE} amparado bajo el Contrato #{CONTRACT_NUM}.\n\nLe extendemos su SOLVENCIA TOTAL y le invitamos a retirar su CARTA DE FINIQUITO para proceder con el trámite de Liberación de Reserva de Dominio ante el INTT y Notaría Pública.'
    }
  };

  /**
   * Genera el texto del mensaje reemplazando las etiquetas dinámicas
   */
  public static generateMessage(
    templateType: NotificationTemplateType,
    contract: LoanContract,
    extraData: {
      quotaNum?: number;
      amountUSD?: number;
      lateFeeUSD?: number;
      dueDate?: string;
      receiptCode?: string;
    } = {},
    bcvRate?: number
  ): string {
    const template = this.TEMPLATES[templateType] || this.TEMPLATES.PREVENTIVE_3_DAYS;
    const rate = bcvRate || BcvEngine.getActiveRateValue();
    const tenant = TenantOnboardingEngine.getProfile();

    const targetQuota = contract.schedule?.find(q => q.status === "PENDING" || q.status === "PARTIALLY_PAID" || q.status === "OVERDUE") || contract.schedule?.[0];
    const amountUSD = extraData.amountUSD !== undefined ? extraData.amountUSD : (targetQuota?.totalQuotaUSD || 50);
    const amountVES = BcvEngine.formatVes(BcvEngine.convertUsdToVes(amountUSD, rate));
    const lateFeeUSD = extraData.lateFeeUSD !== undefined ? extraData.lateFeeUSD : (contract.lateFeesPendingUSD || 0);
    const quotaNum = extraData.quotaNum !== undefined ? extraData.quotaNum : (targetQuota?.quotaNumber || 1);
    const dueDate = extraData.dueDate || targetQuota?.dueDate || "Próximamente";
    const receiptCode = extraData.receiptCode || ("REC-" + contract.contractNumber + "-Q" + quotaNum);
    const vehicleStr = contract.vehicle ? (contract.vehicle.brand + " " + contract.vehicle.model) : "Vehículo";
    const plateStr = contract.vehicle?.plate || "EN TRAMITE";

    let text = template.body
      .replace(/{CLIENT_NAME}/g, contract.clientName)
      .replace(/{COMPANY_NAME}/g, tenant.commercialName)
      .replace(/{COMPANY_RIF}/g, tenant.rif)
      .replace(/{CONTRACT_NUM}/g, contract.contractNumber)
      .replace(/{VEHICLE}/g, vehicleStr)
      .replace(/{PLATE}/g, plateStr)
      .replace(/{QUOTA_NUM}/g, quotaNum.toString())
      .replace(/{AMOUNT_USD}/g, "$" + amountUSD.toFixed(2))
      .replace(/{AMOUNT_VES}/g, amountVES)
      .replace(/{LATE_FEE_USD}/g, "$" + lateFeeUSD.toFixed(2))
      .replace(/{DUE_DATE}/g, dueDate)
      .replace(/{RECEIPT_CODE}/g, receiptCode)
      .replace(/{REMAINING_DEBT_USD}/g, "$" + contract.totalOutstandingUSD.toFixed(2))
      .replace(/{PROGRESS_PERCENT}/g, contract.overallProgressPercent.toString());

    return text;
  }

  /**
   * Genera el enlace directo para WhatsApp (wa.me) con número en formato internacional
   */
  public static getWhatsAppLink(phone: string, messageText: string): string {
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '58' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('58')) {
      cleanPhone = '58' + cleanPhone;
    }
    return "https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent(messageText);
  }

  /**
   * Registra un envío en la bitácora
   */
  public static logNotification(log: Omit<NotificationLog, 'id' | 'sentAt' | 'sha256Seal'>): NotificationLog {
    const id = "wpp-" + Date.now().toString().slice(-6);
    const sentAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const rawSeal = id + "-" + log.contractNumber + "-" + log.templateType + "-" + sentAt;
    const sha256Seal = "SHA256:" + Buffer.from(rawSeal).toString('hex').slice(0, 16).toUpperCase();

    const newLog: NotificationLog = {
      ...log,
      id,
      sentAt,
      sha256Seal
    };

    this.logs.unshift(newLog);
    return newLog;
  }

  public static getLogs(): NotificationLog[] {
    return [...this.logs];
  }
}
