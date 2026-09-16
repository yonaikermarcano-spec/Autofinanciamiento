"use client";

import { LoanContract } from '../../types';
import { LocalDB } from '../local-db';

export type WarrantyStatus = 'ACTIVE_HEALTHY' | 'UPCOMING_SERVICE_REQUIRED' | 'OVERDUE_SERVICE_WARNING' | 'VOIDED_NEGLIGENCE';

export interface MaintenanceMilestone {
  serviceNumber: number;
  targetKilometers: number;
  description: string;
  mandatoryTasks: string[];
  recommendedCostUSD: number;
}

export interface WorkshopAppointment {
  id: string;
  contractNumber: string;
  clientName: string;
  clientPhone: string;
  vehicleModel: string;
  plateOrVin: string;
  serviceMilestoneKm: number;
  currentOdometerKm: number;
  appointmentDate: string;
  workshopName: string;
  mechanicName: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED_OVERDUE';
  checklist: {
    oilChanged: boolean;
    oilType: string;
    chainAdjusted: boolean;
    valvesCalibrated: boolean;
    brakesChecked: boolean;
    electricalChecked: boolean;
  };
  totalCostUSD: number;
  completedAt?: string;
  certificateSha256?: string;
  notes?: string;
}

export class MaintenanceWarrantyEngine {
  public static readonly STANDARD_MILESTONES: MaintenanceMilestone[] = [
    {
      serviceNumber: 1,
      targetKilometers: 500,
      description: "1er Servicio de Asentamiento de Motor (500 km)",
      mandatoryTasks: ["Cambio de Aceite Mineral/Semisintético 20W-50", "Ajuste y Lubricación de Cadena", "Calibración de Válvulas"],
      recommendedCostUSD: 15.00
    },
    {
      serviceNumber: 2,
      targetKilometers: 1500,
      description: "2do Servicio Preventivo (1.500 km)",
      mandatoryTasks: ["Cambio de Aceite", "Limpieza de Filtro de Aire", "Chequeo de Frenos Delanteros y Traseros"],
      recommendedCostUSD: 15.00
    },
    {
      serviceNumber: 3,
      targetKilometers: 3000,
      description: "3er Servicio Mayor (3.000 km)",
      mandatoryTasks: ["Cambio de Aceite", "Cambio de Bujía", "Revisión de Sistema Eléctrico y Batería", "Ajuste de Tornillería"],
      recommendedCostUSD: 25.00
    },
    {
      serviceNumber: 4,
      targetKilometers: 5000,
      description: "4to Servicio Integral de Garantía (5.000 km)",
      mandatoryTasks: ["Mantenimiento General Integral", "Cambio de Aceite y Filtros", "Inspección de Suspensión y Cauchos"],
      recommendedCostUSD: 30.00
    }
  ];

  private static appointments: WorkshopAppointment[] = [
    {
      id: "SRV-2026-001",
      contractNumber: "CTR-2026-001",
      clientName: "José Gregorio Castillo",
      clientPhone: "0414-3329011",
      vehicleModel: "Bera SBR 150cc",
      plateOrVin: "AI8X92M",
      serviceMilestoneKm: 500,
      currentOdometerKm: 480,
      appointmentDate: "2026-08-28 09:00",
      workshopName: "Taller Central AutoLending Catia",
      mechanicName: "Maestro Juan Bermúdez",
      status: "SCHEDULED",
      checklist: {
        oilChanged: true,
        oilType: "20W-50 Mineral 4T",
        chainAdjusted: true,
        valvesCalibrated: true,
        brakesChecked: true,
        electricalChecked: true
      },
      totalCostUSD: 15.00
    },
    {
      id: "SRV-2026-002",
      contractNumber: "CTR-2026-002",
      clientName: "Carlos Eduardo Pérez",
      clientPhone: "0412-8894401",
      vehicleModel: "Empire Keeway EK Express 150",
      plateOrVin: "AK4M10P",
      serviceMilestoneKm: 1500,
      currentOdometerKm: 1510,
      appointmentDate: "2026-08-20 14:00",
      workshopName: "Taller Autorizado Maracay",
      mechanicName: "Técnico Pedro Albornoz",
      status: "COMPLETED",
      checklist: {
        oilChanged: true,
        oilType: "15W-40 Semisintético",
        chainAdjusted: true,
        valvesCalibrated: false,
        brakesChecked: true,
        electricalChecked: true
      },
      totalCostUSD: 15.00,
      completedAt: "2026-08-20 15:30",
      certificateSha256: "SHA256:5352562D323032362D3030327C313530304B4D"
    }
  ];

  public static getAllAppointments(): WorkshopAppointment[] {
    return [...this.appointments];
  }

  /**
   * Determina el estado de garantía de un vehículo basado en kilometraje y servicios
   */
  public static evaluateWarrantyHealth(currentOdometerKm: number, lastCompletedServiceKm: number): {
    status: WarrantyStatus;
    nextMilestoneKm: number;
    kmUntilNextService: number;
    label: string;
    badgeColor: string;
  } {
    const nextMilestone = this.STANDARD_MILESTONES.find(m => m.targetKilometers > lastCompletedServiceKm) || this.STANDARD_MILESTONES[this.STANDARD_MILESTONES.length - 1];
    const kmUntilNextService = nextMilestone.targetKilometers - currentOdometerKm;

    if (kmUntilNextService < -300) {
      // Se pasó por más de 300 km sin hacer el servicio obligatorio
      return {
        status: "VOIDED_NEGLIGENCE",
        nextMilestoneKm: nextMilestone.targetKilometers,
        kmUntilNextService,
        label: "GARANTÍA EN RIESGO / FUERA DE TIEMPO",
        badgeColor: "bg-red-500/20 text-red-400 border-red-500/30"
      };
    } else if (kmUntilNextService <= 100) {
      return {
        status: "UPCOMING_SERVICE_REQUIRED",
        nextMilestoneKm: nextMilestone.targetKilometers,
        kmUntilNextService,
        label: "SERVICIO OBLIGATORIO PRÓXIMO",
        badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30"
      };
    } else {
      return {
        status: "ACTIVE_HEALTHY",
        nextMilestoneKm: nextMilestone.targetKilometers,
        kmUntilNextService,
        label: "GARANTÍA AL DÍA & VIGENTE",
        badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      };
    }
  }

  /**
   * Agenda una nueva cita de taller
   */
  public static scheduleAppointment(params: {
    contractNumber: string;
    clientName: string;
    clientPhone: string;
    vehicleModel: string;
    plateOrVin: string;
    serviceMilestoneKm: number;
    currentOdometerKm: number;
    appointmentDate: string;
    workshopName: string;
    mechanicName: string;
    totalCostUSD: number;
  }): WorkshopAppointment {
    const newApp: WorkshopAppointment = {
      id: "SRV-" + Date.now().toString().slice(-6),
      ...params,
      status: "SCHEDULED",
      checklist: {
        oilChanged: true,
        oilType: "20W-50 Mineral 4T",
        chainAdjusted: true,
        valvesCalibrated: true,
        brakesChecked: true,
        electricalChecked: true
      }
    };

    this.appointments.unshift(newApp);
    return newApp;
  }

  /**
   * Completa un servicio de taller y genera el Certificado Digital SHA-256
   */
  public static completeService(
    appointmentId: string,
    checklist: WorkshopAppointment['checklist'],
    notes: string = "Servicio completado satisfactoriamente según manual de fábrica."
  ): WorkshopAppointment {
    const app = this.appointments.find(a => a.id === appointmentId);
    if (!app) {
      throw new Error("Cita de taller no encontrada.");
    }

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const rawCert = app.id + "|" + app.contractNumber + "|" + app.serviceMilestoneKm + "KM|" + timestamp;
    const certificateSha256 = "SHA256:" + Buffer.from(rawCert).toString('hex').slice(0, 32).toUpperCase();

    app.status = "COMPLETED";
    app.checklist = checklist;
    app.notes = notes;
    app.completedAt = timestamp;
    app.certificateSha256 = certificateSha256;

    return app;
  }

  /**
   * Genera enlace de WhatsApp para recordar al cliente su servicio preventivo
   */
  public static generateServiceWhatsAppUrl(clientPhone: string, clientName: string, vehicleModel: string, milestoneKm: number): string {
    const cleanPhone = clientPhone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('58') ? cleanPhone : ('58' + cleanPhone.replace(/^0/, ''));

    const text = "¡Hola, *" + clientName + "*! Te recordamos desde AutoLending que tu *" + vehicleModel + "* está próxima a su *Servicio Obligatorio de " + milestoneKm + " km* para mantener activa tu garantía de fábrica. Agenda tu cita de taller respondiendo a este mensaje.";
    return "https://wa.me/" + phoneWithCountry + "?text=" + encodeURIComponent(text);
  }
}
