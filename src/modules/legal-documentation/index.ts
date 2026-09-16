"use client";

import { LoanContract } from '../../types';
import { LocalDB } from '../local-db';

export type AlliedServiceType = 'RCV_MOTO' | 'RCV_AUTO' | 'CERTIFICADO_MEDICO_VIAL';
export type AlliedServiceStatus = 
  | 'SOLICITADO_CLIENTE' 
  | 'PAGO_COMPROBADO' 
  | 'PEDIDO_ENVIADO_ALIADO_WA' 
  | 'LISTO_PARA_RETIRO' 
  | 'ENTREGADO_A_CLIENTE';

export interface AlliedServiceItem {
  id: string;
  serviceType: AlliedServiceType;
  title: string;
  clientPriceUSD: number;
  totalPartnerProfitUSD: number; // 20%
  financierCommissionUSD: number; // 10%
  platformCommissionUSD: number;  // 10%
}

export interface AlliedServiceOrder {
  id: string;
  contractNumber: string;
  clientName: string;
  clientDocId: string;
  clientPhone: string;
  serviceType: AlliedServiceType;
  serviceName: string;
  priceUSD: number;
  financierProfitUSD: number; // 10% acumulable a favor de la financiadora
  platformProfitUSD: number;  // 10% para la plataforma
  pickupDateScheduled: string;
  status: AlliedServiceStatus;
  requestedAt: string;
  partnerPaymentRef?: string;
  partnerWhatsAppSentAt?: string;
  completedAt?: string;
  receiptSha256?: string;
}

export interface DriverLicenseStatus {
  hasLicense: boolean;
  licenseGrade: '2DA_MOTO' | '3RA_LIVIANO' | '4TA_PESADO' | '5TA_EXTRA_PESADO' | 'NO_TIENE';
  status: 'VIGENTE' | 'POR_VENCER' | 'VENCIDA' | 'TRAMITANDO_POR_SU_CUENTA';
  expirationDate?: string;
  documentPhotoUrl?: string;
  notes: string;
}

export interface ClientDocumentPhases {
  contractNumber: string;
  clientName: string;
  clientDocId: string;
  currentPhase: 1 | 2 | 3;
  
  // FASE 1: Entrega Inicial (Aún amortizando el crédito)
  phase1: {
    isCompleted: boolean;
    driverLicense: DriverLicenseStatus;
    rcvInitialDelivered: boolean; // Entregado desde concesionario o aliado
    medicalCertificateValid: boolean;
    originCertificateCopyStored: boolean; // Copia del certificado de origen a nombre de la empresa
    reservationOfTitleContractSigned: boolean; // Contrato con Reserva de Dominio
    inttRegistrationProofIssued: boolean; // Planilla / Constancia de registro INTT en proceso
    phase1DeliveredDate?: string;
  };

  // FASE 2: Certificado de Circulación Emitido por INTT
  phase2: {
    isCompleted: boolean;
    circulationCertificateCopyDelivered: boolean; // Copia entregada al cliente para circular
    circulationCertificateOriginalInVault: boolean; // Original custodiado en bóveda financiadora
    circulationRegistrationNumber?: string;
    phase2DeliveredDate?: string;
  };

  // FASE 3: Finiquito y Liberación Total (100% Pagado)
  phase3: {
    isCompleted: boolean;
    circulationCertificateOriginalDelivered: boolean; // Original entregado al cliente
    settlementReleaseDocumentSigned: boolean; // Finiquito y Levantamiento de Reserva de Dominio
    finalInvoiceDelivered: boolean;
    phase3DeliveredDate?: string;
  };
}

export class LegalDocumentationEngine {
  public static readonly ALLIED_CATALOG: AlliedServiceItem[] = [
    {
      id: "SRV-RCV-MOTO",
      serviceType: "RCV_MOTO",
      title: "Póliza RCV Moto (1 Año)",
      clientPriceUSD: 35.00,
      totalPartnerProfitUSD: 7.00,
      financierCommissionUSD: 3.50, // 10%
      platformCommissionUSD: 3.50   // 10%
    },
    {
      id: "SRV-MED-CERT",
      serviceType: "CERTIFICADO_MEDICO_VIAL",
      title: "Certificado Médico Vial (Vigencia 5 Años)",
      clientPriceUSD: 20.00,
      totalPartnerProfitUSD: 4.00,
      financierCommissionUSD: 2.00, // 10%
      platformCommissionUSD: 2.00   // 10%
    },
    {
      id: "SRV-RCV-AUTO",
      serviceType: "RCV_AUTO",
      title: "Póliza RCV Vehículo Particular (1 Año)",
      clientPriceUSD: 50.00,
      totalPartnerProfitUSD: 10.00,
      financierCommissionUSD: 5.00, // 10%
      platformCommissionUSD: 5.00   // 10%
    }
  ];

  private static alliedOrders: AlliedServiceOrder[] = [
    {
      id: "ORD-RCV-001",
      contractNumber: "CTR-2026-001",
      clientName: "José Gregorio Castillo",
      clientDocId: "V-18492019",
      clientPhone: "0414-3329011",
      serviceType: "CERTIFICADO_MEDICO_VIAL",
      serviceName: "Certificado Médico Vial (5 Años)",
      priceUSD: 20.00,
      financierProfitUSD: 2.00,
      platformProfitUSD: 2.00,
      pickupDateScheduled: "2026-08-28 10:00",
      status: "LISTO_PARA_RETIRO",
      requestedAt: "2026-08-24 11:30:00",
      partnerPaymentRef: "TRF-MERCANTIL-849201",
      partnerWhatsAppSentAt: "2026-08-24 11:45:00"
    },
    {
      id: "ORD-RCV-002",
      contractNumber: "CTR-2026-002",
      clientName: "Carlos Eduardo Pérez",
      clientDocId: "V-20192844",
      clientPhone: "0412-8894401",
      serviceType: "RCV_MOTO",
      serviceName: "Renovación Anual RCV Moto",
      priceUSD: 35.00,
      financierProfitUSD: 3.50,
      platformProfitUSD: 3.50,
      pickupDateScheduled: "2026-08-29 14:00",
      status: "PAGO_COMPROBADO",
      requestedAt: "2026-08-25 09:15:00"
    }
  ];

  private static clientPhases: ClientDocumentPhases[] = [
    {
      contractNumber: "CTR-2026-001",
      clientName: "José Gregorio Castillo",
      clientDocId: "V-18492019",
      currentPhase: 1,
      phase1: {
        isCompleted: true,
        driverLicense: {
          hasLicense: true,
          licenseGrade: "2DA_MOTO",
          status: "VIGENTE",
          expirationDate: "2028-05-12",
          notes: "Licencia de 2da consignada por el cliente."
        },
        rcvInitialDelivered: true,
        medicalCertificateValid: true,
        originCertificateCopyStored: true,
        reservationOfTitleContractSigned: true,
        inttRegistrationProofIssued: true,
        phase1DeliveredDate: "2026-08-10"
      },
      phase2: {
        isCompleted: false,
        circulationCertificateCopyDelivered: false,
        circulationCertificateOriginalInVault: false,
        circulationRegistrationNumber: "INTT-CRV-8849201"
      },
      phase3: {
        isCompleted: false,
        circulationCertificateOriginalDelivered: false,
        settlementReleaseDocumentSigned: false,
        finalInvoiceDelivered: false
      }
    },
    {
      contractNumber: "CTR-2026-002",
      clientName: "Carlos Eduardo Pérez",
      clientDocId: "V-20192844",
      currentPhase: 2,
      phase1: {
        isCompleted: true,
        driverLicense: {
          hasLicense: true,
          licenseGrade: "2DA_MOTO",
          status: "VIGENTE",
          expirationDate: "2027-11-20",
          notes: "Licencia vigente al día."
        },
        rcvInitialDelivered: true,
        medicalCertificateValid: true,
        originCertificateCopyStored: true,
        reservationOfTitleContractSigned: true,
        inttRegistrationProofIssued: true,
        phase1DeliveredDate: "2026-07-15"
      },
      phase2: {
        isCompleted: true,
        circulationCertificateCopyDelivered: true,
        circulationCertificateOriginalInVault: true,
        circulationRegistrationNumber: "INTT-CRV-9941028",
        phase2DeliveredDate: "2026-08-01"
      },
      phase3: {
        isCompleted: false,
        circulationCertificateOriginalDelivered: false,
        settlementReleaseDocumentSigned: false,
        finalInvoiceDelivered: false
      }
    }
  ];

  public static getAllAlliedOrders(): AlliedServiceOrder[] {
    return [...this.alliedOrders];
  }

  public static getAllClientPhases(): ClientDocumentPhases[] {
    return [...this.clientPhases];
  }

  public static getClientPhasesByContract(contractNumber: string): ClientDocumentPhases | undefined {
    return this.clientPhases.find(p => p.contractNumber === contractNumber);
  }

  /**
   * Crea una nueva solicitud de servicio aliado (RCV / Certificado Médico) desde el Portal del Cliente
   */
  public static requestAlliedService(params: {
    contractNumber: string;
    clientName: string;
    clientDocId: string;
    clientPhone: string;
    serviceType: AlliedServiceType;
    pickupDateScheduled: string;
  }): AlliedServiceOrder {
    const item = this.ALLIED_CATALOG.find(c => c.serviceType === params.serviceType) || this.ALLIED_CATALOG[0];

    const newOrder: AlliedServiceOrder = {
      id: "ORD-" + Date.now().toString().slice(-6),
      contractNumber: params.contractNumber,
      clientName: params.clientName,
      clientDocId: params.clientDocId,
      clientPhone: params.clientPhone,
      serviceType: item.serviceType,
      serviceName: item.title,
      priceUSD: item.clientPriceUSD,
      financierProfitUSD: item.financierCommissionUSD,
      platformProfitUSD: item.platformCommissionUSD,
      pickupDateScheduled: params.pickupDateScheduled,
      status: "SOLICITADO_CLIENTE",
      requestedAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    this.alliedOrders.unshift(newOrder);
    return newOrder;
  }

  /**
   * Marca el pago como comprobado por la financiadora
   */
  public static verifyPaymentByFinancier(orderId: string): AlliedServiceOrder {
    const order = this.alliedOrders.find(o => o.id === orderId);
    if (!order) throw new Error("Orden no encontrada.");
    order.status = "PAGO_COMPROBADO";
    return order;
  }

  /**
   * Genera el enlace de WhatsApp para pedir el RCV/Certificado Médico al Aliado B2B
   */
  public static generatePartnerWhatsAppUrl(order: AlliedServiceOrder, partnerPhone: string = "584149920194"): string {
    const cleanPartnerPhone = partnerPhone.replace(/[^0-9]/g, '');
    const text = [
      "🟢 *NUEVO PEDIDO DE SERVICIO ALIADO*",
      "• *Orden:* #" + order.id,
      "• *Servicio:* " + order.serviceName,
      "• *Cliente:* " + order.clientName + " (C.I. " + order.clientDocId + ")",
      "• *Teléfono Cliente:* " + order.clientPhone,
      "• *Precio Total:* $" + order.priceUSD + " USD",
      "• *Retiro en Oficina:* " + order.pickupDateScheduled,
      "• *Pago:* Ya realizado y comprobado por la Financiadora.",
      "",
      "Por favor emitir y notificar cuando esté disponible para retiro."
    ].join("\n");

    return "https://wa.me/" + cleanPartnerPhone + "?text=" + encodeURIComponent(text);
  }

  /**
   * Marca el pedido enviado al aliado
   */
  public static markSentToPartner(orderId: string, paymentRef: string): AlliedServiceOrder {
    const order = this.alliedOrders.find(o => o.id === orderId);
    if (!order) throw new Error("Orden no encontrada.");
    order.status = "PEDIDO_ENVIADO_ALIADO_WA";
    order.partnerPaymentRef = paymentRef;
    order.partnerWhatsAppSentAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
    return order;
  }

  /**
   * Marca el documento como listo para retiro o entregado al cliente
   */
  public static markReadyOrDelivered(orderId: string, status: 'LISTO_PARA_RETIRO' | 'ENTREGADO_A_CLIENTE'): AlliedServiceOrder {
    const order = this.alliedOrders.find(o => o.id === orderId);
    if (!order) throw new Error("Orden no encontrada.");
    order.status = status;
    if (status === 'ENTREGADO_A_CLIENTE') {
      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
      order.completedAt = timestamp;
      const rawReceipt = order.id + "|" + order.contractNumber + "|" + order.priceUSD + "|" + timestamp;
      order.receiptSha256 = "SHA256:" + Buffer.from(rawReceipt).toString('hex').slice(0, 32).toUpperCase();
    }
    return order;
  }

  /**
   * Calcula el total de comisiones acumuladas del 10% a favor de la financiadora
   */
  public static getAccumulatedFinancierProfitUSD(): {
    totalSalesCount: number;
    totalAccumulatedProfitUSD: number;
    totalPlatformProfitUSD: number;
  } {
    const eligibleOrders = this.alliedOrders.filter(o => o.status !== 'SOLICITADO_CLIENTE');
    const totalAccumulatedProfitUSD = eligibleOrders.reduce((sum, o) => sum + o.financierProfitUSD, 0);
    const totalPlatformProfitUSD = eligibleOrders.reduce((sum, o) => sum + o.platformProfitUSD, 0);

    return {
      totalSalesCount: eligibleOrders.length,
      totalAccumulatedProfitUSD: Number(totalAccumulatedProfitUSD.toFixed(2)),
      totalPlatformProfitUSD: Number(totalPlatformProfitUSD.toFixed(2))
    };
  }

  /**
   * Actualiza el checklist de una fase documental del cliente
   */
  public static updatePhaseChecklist(contractNumber: string, updatedPhases: Partial<ClientDocumentPhases>): ClientDocumentPhases {
    let doc = this.clientPhases.find(p => p.contractNumber === contractNumber);
    if (!doc) {
      doc = {
        contractNumber,
        clientName: updatedPhases.clientName || "Cliente",
        clientDocId: updatedPhases.clientDocId || "V-00000000",
        currentPhase: 1,
        phase1: {
          isCompleted: false,
          driverLicense: {
            hasLicense: true,
            licenseGrade: "2DA_MOTO",
            status: "VIGENTE",
            notes: "Licencia de conducir."
          },
          rcvInitialDelivered: true,
          medicalCertificateValid: true,
          originCertificateCopyStored: true,
          reservationOfTitleContractSigned: true,
          inttRegistrationProofIssued: true
        },
        phase2: {
          isCompleted: false,
          circulationCertificateCopyDelivered: false,
          circulationCertificateOriginalInVault: false
        },
        phase3: {
          isCompleted: false,
          circulationCertificateOriginalDelivered: false,
          settlementReleaseDocumentSigned: false,
          finalInvoiceDelivered: false
        }
      };
      this.clientPhases.push(doc);
    } else {
      Object.assign(doc, updatedPhases);
    }

    // Evaluar fase actual automáticamente
    if (doc.phase3.isCompleted) {
      doc.currentPhase = 3;
    } else if (doc.phase2.isCompleted) {
      doc.currentPhase = 2;
    } else {
      doc.currentPhase = 1;
    }

    return doc;
  }
}
