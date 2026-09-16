import { LoanContract } from '../../types';

export type AtcTicketCategory = 
  | "ACCIDENT_OR_THEFT"           // Siniestro, Robo o Pérdida
  | "DEALER_WARRANTY_CLAIM"       // Garantía Mecánica con Concesionario
  | "RESTRUCTURING_REQUEST"       // Solicitud de Extensión de Plazo / Refinanciación
  | "VEHICLE_TRADE_IN_UPGRADE"    // Cambio de Vehículo por modelo superior (Upgrade)
  | "INTT_DOCUMENTATION_INQUIRY"; // Consulta de estatus de Placas/Título

export interface AtcTicket {
  ticketId: string;
  contractNumber: string;
  clientName: string;
  clientDocId: string;
  clientPhone: string;
  category: AtcTicketCategory;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  subject: string;
  description: string;
  createdAt: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
  resolutionNotes?: string;
  gpsTrackingTriggered?: boolean;
}

export class AtcTicketsModule {
  /**
   * Crea un nuevo ticket de soporte o reclamo
   */
  public static createTicket(params: {
    contractNumber: string;
    clientName: string;
    clientDocId: string;
    clientPhone: string;
    category: AtcTicketCategory;
    subject: string;
    description: string;
  }): AtcTicket {
    const isUrgent = params.category === "ACCIDENT_OR_THEFT";
    return {
      ticketId: `TCK-${Date.now().toString().slice(-6)}`,
      contractNumber: params.contractNumber,
      clientName: params.clientName,
      clientDocId: params.clientDocId,
      clientPhone: params.clientPhone,
      category: params.category,
      priority: isUrgent ? "URGENT" : "MEDIUM",
      subject: params.subject,
      description: params.description,
      createdAt: new Date().toISOString(),
      status: "OPEN",
      gpsTrackingTriggered: isUrgent
    };
  }

  /**
   * Calculadora de Trade-in / Cambio de Vehículo por Upgrade
   */
  public static calculateTradeInUpgrade(params: {
    currentContract: LoanContract;
    currentVehicleAppraisedValueUSD: number; // Avalúo comercial actual de la moto usada
    targetNewVehiclePriceUSD: number;        // Precio de la nueva moto/carro
    downPaymentRequiredPercent?: number;     // % requerido para el nuevo vehículo (ej. 30%)
  }): {
    totalCapitalPaidCurrentUSD: number;
    outstandingDebtCurrentUSD: number;
    netEquityRecognizedUSD: number;
    downPaymentCoveredUSD: number;
    surplusDownPaymentUSD: number;
    additionalCashNeededUSD: number;
    newFinancedAmountUSD: number;
    isApprovedForUpgrade: boolean;
    summaryText: string;
  } {
    const downPercent = params.downPaymentRequiredPercent || 30;
    const requiredDownUSD = Number(((params.targetNewVehiclePriceUSD * downPercent) / 100).toFixed(2));
    
    const outstandingDebt = params.currentContract.totalOutstandingUSD;
    // Valor neto a favor del cliente = Avalúo de su vehículo MENOS la deuda que aún le debe a la empresa
    const netEquityRecognizedUSD = Number((params.currentVehicleAppraisedValueUSD - outstandingDebt).toFixed(2));

    const isPositiveEquity = netEquityRecognizedUSD > 0;
    const additionalCashNeededUSD = isPositiveEquity 
      ? Math.max(0, Number((requiredDownUSD - netEquityRecognizedUSD).toFixed(2)))
      : Number((requiredDownUSD + Math.abs(netEquityRecognizedUSD)).toFixed(2));

    const downPaymentCoveredUSD = Math.min(requiredDownUSD, Math.max(0, netEquityRecognizedUSD));
    const surplusDownPaymentUSD = Math.max(0, Number((netEquityRecognizedUSD - requiredDownUSD).toFixed(2)));
    const newFinancedAmountUSD = Number((params.targetNewVehiclePriceUSD - (downPaymentCoveredUSD + surplusDownPaymentUSD + additionalCashNeededUSD)).toFixed(2));

    const isApprovedForUpgrade = isPositiveEquity && params.currentContract.status === "ACTIVE";

    const summaryText = (
      `Trade-In Aprobado: Avalúo de unidad actual: $${params.currentVehicleAppraisedValueUSD} USD.\n` +
      `Deuda remanente cancelada: $${outstandingDebt} USD.\n` +
      `Capital neto a favor reconocido: $${netEquityRecognizedUSD} USD.\n` +
      `Inicial para nueva unidad (${downPercent}%): $${requiredDownUSD} USD.\n` +
      (additionalCashNeededUSD > 0 
        ? `Efectivo adicional requerido para completar inicial: $${additionalCashNeededUSD} USD.`
        : `¡Inicial 100% cubierta con el valor de la unidad actual! Excedente a capital: $${surplusDownPaymentUSD} USD.`)
    );

    return {
      totalCapitalPaidCurrentUSD: params.currentContract.totalPaidUSD,
      outstandingDebtCurrentUSD: outstandingDebt,
      netEquityRecognizedUSD,
      downPaymentCoveredUSD,
      surplusDownPaymentUSD,
      additionalCashNeededUSD,
      newFinancedAmountUSD,
      isApprovedForUpgrade,
      summaryText
    };
  }
}