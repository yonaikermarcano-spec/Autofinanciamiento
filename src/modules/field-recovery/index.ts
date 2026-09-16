import { LoanContract } from '../../types';

export interface FieldInvestigationCase {
  caseId: string;
  contractNumber: string;
  clientName: string;
  clientDocId: string;
  clientPhone: string;
  lastKnownAddress: string;
  guarantorName?: string;
  guarantorPhone?: string;
  guarantorAddress?: string;
  
  vehicleBrand: string;
  vehicleModel: string;
  vehicleColor: string;
  vehiclePlate: string;
  vinChassis: string;
  engineSerial: string;
  
  daysOverdue: number;
  totalOverdueUSD: number;
  overdueQuotasCount: number;
  
  stage: 
    | "DOMICILIARY_VERIFICATION"   // Visita de verificación de domicilio/negocio
    | "MEDIATION_AGREEMENT"        // Mediación presencial y firma de compromiso de pago
    | "VOLUNTARY_SURRENDER"        // Entrega voluntaria de la unidad para renegociación
    | "PHYSICAL_REPOSSESSION";     // Retención física en campo por negativa de pago
  
  assignedInvestigator: string;
  visitHistory: Array<{
    date: string;
    result: string;
    photoEvidenceUrl?: string;
  }>;
  
  // Acta de Retención Física
  repossessionReport?: {
    date: string;
    mileageKm: number;
    visualCondition: string;
    accessoriesInventory: string[];
    custodyYardLocation: string;
    officerInCharge: string;
  };
}

export class FieldRecoveryModule {
  /**
   * Evalúa el caso y genera la orden para el equipo de investigación de calle
   */
  public static createInvestigationCase(params: {
    contract: LoanContract;
    daysOverdue: number;
    unpaidQuotasCount: number;
    investigatorName: string;
  }): FieldInvestigationCase {
    const totalOverdueUSD = Number((
      params.contract.schedule
        .filter(q => q.status === "OVERDUE" || q.status === "PARTIALLY_PAID")
        .reduce((sum, q) => sum + q.remainingAmountUSD, 0)
    ).toFixed(2));

    let stage: FieldInvestigationCase["stage"] = "DOMICILIARY_VERIFICATION";
    if (params.daysOverdue > 30 || params.unpaidQuotasCount >= 2) {
      stage = "PHYSICAL_REPOSSESSION";
    } else if (params.daysOverdue > 15) {
      stage = "MEDIATION_AGREEMENT";
    }

    return {
      caseId: `INV-${Date.now().toString().slice(-6)}`,
      contractNumber: params.contract.contractNumber,
      clientName: params.contract.clientName,
      clientDocId: params.contract.clientDocId,
      clientPhone: params.contract.clientPhone,
      lastKnownAddress: params.contract.clientAddress,
      guarantorName: params.contract.guarantor?.name || "No registrado",
      guarantorPhone: params.contract.guarantor?.phone,
      guarantorAddress: params.contract.guarantor?.address,
      
      vehicleBrand: params.contract.vehicle.brand,
      vehicleModel: params.contract.vehicle.model,
      vehicleColor: params.contract.vehicle.color,
      vehiclePlate: params.contract.vehicle.plate || "EN TRÁMITE",
      vinChassis: params.contract.vehicle.vinChassis,
      engineSerial: params.contract.vehicle.engineSerial,
      
      daysOverdue: params.daysOverdue,
      totalOverdueUSD,
      overdueQuotasCount: params.unpaidQuotasCount,
      stage,
      assignedInvestigator: params.investigatorName,
      visitHistory: [
        {
          date: new Date().toISOString().split("T")[0],
          result: `Caso asignado a investigador ${params.investigatorName} por acumulación de ${params.daysOverdue} días de mora.`
        }
      ]
    };
  }

  /**
   * Genera el Acta Digital de Retención Física e Inspección de la Moto en Campo
   */
  public static generatePhysicalRepossessionAct(params: {
    investigationCase: FieldInvestigationCase;
    mileageKm: number;
    bodyworkCondition: string;
    missingParts: string[];
    custodyYard: string;
    receiverOfficer: string;
  }): string {
    return (
      `================================================================================\n` +
      `ACTA DE INSPECCIÓN, RECEPCIÓN Y RETENCIÓN FÍSICA DE VEHÍCULO EN CAMPO\n` +
      `EXPEDIENTE N°: ${params.investigationCase.caseId} • CONTRATO N°: ${params.investigationCase.contractNumber}\n` +
      `================================================================================\n\n` +
      `Lugar y Fecha: Caracas, ${new Date().toLocaleDateString("es-VE")} a las ${new Date().toLocaleTimeString("es-VE")}\n\n` +
      `1. DATOS DEL CLIENTE / DEUDOR:\n` +
      `   - Nombre Completo: ${params.investigationCase.clientName}\n` +
      `   - C.I. / RIF: ${params.investigationCase.clientDocId}\n` +
      `   - Teléfono: ${params.investigationCase.clientPhone}\n` +
      `   - Domicilio de Visita: ${params.investigationCase.lastKnownAddress}\n\n` +
      `2. IDENTIFICACIÓN DEL VEHÍCULO RECUPERADO:\n` +
      `   - Marca: ${params.investigationCase.vehicleBrand} | Modelo: ${params.investigationCase.vehicleModel}\n` +
      `   - Color: ${params.investigationCase.vehicleColor} | Placa: ${params.investigationCase.vehiclePlate}\n` +
      `   - Serial Carrocería (VIN): ${params.investigationCase.vinChassis}\n` +
      `   - Serial Motor: ${params.investigationCase.engineSerial}\n\n` +
      `3. ESTADO FÍSICO Y CONDICIÓN MECÁNICA:\n` +
      `   - Kilometraje Registrado en Tablero: ${params.mileageKm} km\n` +
      `   - Condición Estética de Carrocería: ${params.bodyworkCondition}\n` +
      `   - Faltantes o Novedades Detectadas: ${params.missingParts.join(", ") || "Ninguna novedad aparente"}\n\n` +
      `4. MOTIVO DE LA RETENCIÓN:\n` +
      `   - Incumplimiento contractual de pago por ${params.investigationCase.daysOverdue} días de mora acumulada.\n` +
      `   - Deuda Vencida Exigible: $${params.investigationCase.totalOverdueUSD} USD.\n\n` +
      `5. CUSTODIA Y TRASLADO:\n` +
      `   - El vehículo queda en depósito y resguardo en: ${params.custodyYard}.\n` +
      `   - Oficial de Campo Responsable: ${params.receiverOfficer}\n\n` +
      `____________________________________          ____________________________________\n` +
      `OFICIAL / INVESTIGADOR DE CAMPO               RESPONSABLE DEL PATIO DE CUSTODIA\n`
    );
  }
}