"use client";

import { LoanContract } from '../../types';
import { BcvEngine } from '../bcv-engine';

export type JudicialPhase = 
  | 'EXTRAJUDICIAL_INTIMATION'     // Fase 1: Carta notariada con plazo perentorio 72h
  | 'LEGAL_DOSSIER_PREPARATION'     // Fase 2: Expediente en manos de consultor jurídico
  | 'COURT_INTIMATION_FILED'        // Fase 3: Demanda de intimación consignada en tribunal (CPC Art. 640)
  | 'VEHICLE_SEQUESTRATION_ORDER'   // Fase 4: Auto de embargo / secuestro preventivo de la unidad
  | 'SETTLED_IN_COURT';            // Transacción judicial / Finiquito de juicio

export interface JudicialCase {
  id: string;
  contractNumber: string;
  clientId: string;
  clientName: string;
  clientDocId: string;
  guarantorName: string;
  guarantorDocId: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleVin: string;
  capitalOwedUSD: number;
  lateFeesOwedUSD: number;
  courtFeesPercent: number; // Ej: 20%
  courtFeesUSD: number;
  totalClaimUSD: number;
  capitalOwedVES: number;
  totalClaimVES: number;
  currentPhase: JudicialPhase;
  courtName?: string;
  caseFileNumber?: string;
  intimationsSentCount: number;
  lastIntimationDate: string;
  assignedLawyer: string;
  sha256Seal: string;
}

export class JudicialCollectionEngine {
  private static cases: JudicialCase[] = [
    {
      id: "JUD-2026-001",
      contractNumber: "CTR-2026-003",
      clientId: "cli-003",
      clientName: "María Elena Gómez",
      clientDocId: "V-22849102",
      guarantorName: "Elena Gómez",
      guarantorDocId: "V-13992810",
      vehicleBrand: "Bera",
      vehicleModel: "Kavak 150cc",
      vehiclePlate: "AE3K81P",
      vehicleVin: "8B8BERA2026KVK7712",
      capitalOwedUSD: 850.00,
      lateFeesOwedUSD: 45.00,
      courtFeesPercent: 20,
      courtFeesUSD: 179.00,
      totalClaimUSD: 1074.00,
      capitalOwedVES: 39822.50,
      totalClaimVES: 50316.90,
      currentPhase: "COURT_INTIMATION_FILED",
      courtName: "Tribunal Segundo de Municipio Ordinario y Ejecutor de Medidas de Valencia",
      caseFileNumber: "EXP-MERC-2026-4491",
      intimationsSentCount: 2,
      lastIntimationDate: "2026-08-15",
      assignedLawyer: "Abg. Rafael Uzcátegui (Inpreabogado 94.810)",
      sha256Seal: "SHA256:4A5544494349414C5F4354523030335F56414C454E434941"
    },
    {
      id: "JUD-2026-002",
      contractNumber: "CTR-2026-004",
      clientId: "cli-004",
      clientName: "Wilmer Alexander Rondón",
      clientDocId: "V-19882901",
      guarantorName: "Alexander Rondón",
      guarantorDocId: "V-11029381",
      vehicleBrand: "TVS",
      vehicleModel: "HLX 150cc",
      vehiclePlate: "EN TRÁMITE",
      vehicleVin: "8TVS2026HLX5519",
      capitalOwedUSD: 940.00,
      lateFeesOwedUSD: 60.00,
      courtFeesPercent: 25,
      courtFeesUSD: 250.00,
      totalClaimUSD: 1250.00,
      capitalOwedVES: 44039.00,
      totalClaimVES: 58562.50,
      currentPhase: "EXTRAJUDICIAL_INTIMATION",
      courtName: "Tribunal de Municipio Los Teques (En preparación)",
      caseFileNumber: "PRE-JUD-2026-102",
      intimationsSentCount: 1,
      lastIntimationDate: "2026-08-20",
      assignedLawyer: "Abg. Daniela Rivas (Inpreabogado 112.440)",
      sha256Seal: "SHA256:4A5544494349414C5F4354523030345F544551554553"
    }
  ];

  public static getAllCases(): JudicialCase[] {
    return [...this.cases];
  }

  /**
   * Calcula el expediente de cobranza judicial para un contrato moroso
   */
  public static calculateJudicialClaim(
    contract: LoanContract,
    bcvRate: number,
    courtFeesPercent: number = 20
  ): JudicialCase {
    const capitalUSD = contract.totalOutstandingUSD || 800;
    const lateFeesUSD = contract.lateFeesPendingUSD || 0;
    const subtotalUSD = capitalUSD + lateFeesUSD;
    const courtFeesUSD = Number((subtotalUSD * (courtFeesPercent / 100)).toFixed(2));
    const totalClaimUSD = Number((subtotalUSD + courtFeesUSD).toFixed(2));

    const capitalOwedVES = Number((capitalUSD * bcvRate).toFixed(2));
    const totalClaimVES = Number((totalClaimUSD * bcvRate).toFixed(2));

    const timestamp = new Date().toISOString().slice(0, 10);
    const rawSeal = contract.contractNumber + "|" + totalClaimUSD + "|" + timestamp;
    const sha256Seal = "SHA256:" + Buffer.from(rawSeal).toString('hex').slice(0, 32).toUpperCase();

    return {
      id: "JUD-2026-" + (this.cases.length + 1).toString().padStart(3, '0'),
      contractNumber: contract.contractNumber,
      clientId: contract.clientId || "cli-gen",
      clientName: contract.clientName,
      clientDocId: contract.clientDocId,
      guarantorName: contract.guarantor?.name || "Sin Fiador",
      guarantorDocId: contract.guarantor?.docId || "N/A",
      vehicleBrand: contract.vehicle?.brand || "Bera",
      vehicleModel: contract.vehicle?.model || "SBR 150",
      vehiclePlate: contract.vehicle?.plate || "EN TRAMITE",
      vehicleVin: contract.vehicle?.vinChassis || "VIN-NO-REGISTRADO",
      capitalOwedUSD: capitalUSD,
      lateFeesOwedUSD: lateFeesUSD,
      courtFeesPercent,
      courtFeesUSD,
      totalClaimUSD,
      capitalOwedVES,
      totalClaimVES,
      currentPhase: "EXTRAJUDICIAL_INTIMATION",
      intimationsSentCount: 1,
      lastIntimationDate: timestamp,
      assignedLawyer: "Consultoría Jurídica Externa (Dr. Rafael Uzcátegui)",
      sha256Seal
    };
  }

  /**
   * Genera el texto formal de la Carta de Intimación Extrajudicial & Requerimiento Formal
   */
  public static generateNotarizedIntimationLetter(jCase: JudicialCase, bcvRate: number): string {
    return [
      "================================================================================",
      "             NOTIFICACIÓN EXTRAJUDICIAL DE COBRO E INTIMACIÓN PERENTORIA        ",
      "================================================================================",
      "",
      "CIUDADANO(A): " + jCase.clientName + " (Cédula de Identidad N° " + jCase.clientDocId + ") - DEUDOR PRINCIPAL",
      "CIUDADANO(A): " + jCase.guarantorName + " (Cédula de Identidad N° " + jCase.guarantorDocId + ") - FIADOR SOLIDARIO Y PRINCIPAL PAGADOR",
      "",
      "Por medio de la presente comunicación formal, la sociedad mercantil en calidad de acreedora procede a INTIMARLES formalmente al pago inmediato de las obligaciones líquidas y exigibles derivadas del Contrato de Financiamiento Vehicular N° " + jCase.contractNumber + ", garantizado con la unidad " + jCase.vehicleBrand + " " + jCase.vehicleModel + ", Placa: " + jCase.vehiclePlate + ", Serial VIN: " + jCase.vehicleVin + ".",
      "",
      "LIQUIDACIÓN DEL CRÉDITO Y PRETENSIONES ECONÓMICAS:",
      "1. Capital Vencido y Remanente: $" + jCase.capitalOwedUSD.toFixed(2) + " USD (Bs. " + jCase.capitalOwedVES.toLocaleString() + ")",
      "2. Intereses Moratorios y Recargos: $" + jCase.lateFeesOwedUSD.toFixed(2) + " USD",
      "3. Costas y Honorarios de Cobranza Legal (" + jCase.courtFeesPercent + "%): $" + jCase.courtFeesUSD.toFixed(2) + " USD",
      "--------------------------------------------------------------------------------",
      "MONTO TOTAL EXIGIBLE: $" + jCase.totalClaimUSD.toFixed(2) + " USD (Equivalente en Tasa BCV a: Bs. " + jCase.totalClaimVES.toLocaleString() + ")",
      "--------------------------------------------------------------------------------",
      "",
      "PLAZO PERENTORIO DE COMPARECENCIA:",
      "Se le concede un plazo improrrogable de SETENTA Y DOS (72) HORAS continuas contadas a partir de la recepción de la presente para comparecer ante las oficinas de Consultoría Jurídica y liquidar el saldo deudor o consignar la entrega voluntaria del vehículo.",
      "",
      "ADVERTENCIA DE PROCEDIMIENTO JUDICIAL Y EMBARGO:",
      "El incumplimiento del presente requerimiento dará lugar a la interposición inmediata de DEMANDA POR EL PROCEDIMIENTO DE INTIMACIÓN (Artículos 640 y siguientes del Código de Procedimiento Civil Venezolano), solicitando Medida Cautelar de Secuestro y Retención Física del Vehículo con auxilio de la Fuerza Pública.",
      "",
      "Emitido en Caracas, República Bolivariana de Venezuela.",
      "Sello Criptográfico de Notificación: " + jCase.sha256Seal
    ].join("\n");
  }

  /**
   * Genera el Libelo Formal de Demanda de Intimación Mercantil (CPC Art. 640)
   */
  public static generateCourtComplaintLibel(jCase: JudicialCase): string {
    return [
      "CIUDADANO(A)",
      "JUEZ DE MUNICIPIO ORDINARIO Y EJECUTOR DE MEDIDAS DE LA CIRCUNSCRIPCIÓN JUDICIAL.",
      "SU DESPACHO.-",
      "",
      "Yo, " + jCase.assignedLawyer + ", actuando en mi carácter de Apoderado Judicial de la Sociedad Mercantil acreedora, ante usted con el debido respeto ocurro para exponer y demandar:",
      "",
      "CAPÍTULO I: DE LOS DEMANDADOS",
      "Demando formalmente y por vía de PROCEDIMIENTO DE INTIMACIÓN a los ciudadanos: 1) " + jCase.clientName + ", titular de la Cédula de Identidad N° " + jCase.clientDocId + ", en su condición de deudor principal; y 2) " + jCase.guarantorName + ", titular de la Cédula de Identidad N° " + jCase.guarantorDocId + ", en su condición de fiador solidario y principal pagador.",
      "",
      "CAPÍTULO II: DE LOS HECHOS Y DEL TÍTULO FUNDAMENTAL",
      "Consta en Contrato Privado de Financiamiento y Pagaré Mercantil N° " + jCase.contractNumber + " que la demandante concedió financiamiento para la adquisición del vehículo marca " + jCase.vehicleBrand + ", modelo " + jCase.vehicleModel + ", serial VIN " + jCase.vehicleVin + ". Habiendo incurrido en mora contumaz e incumplimiento reiterado de las cuotas pactadas, la obligación se encuentra de plazo vencido, líquida y exigible.",
      "",
      "CAPÍTULO III: DEL PETITORIO Y ESTIMACIÓN DE LA DEMANDA",
      "Demando el pago de las siguientes cantidades: a) Capital: $" + jCase.capitalOwedUSD.toFixed(2) + " USD; b) Moras: $" + jCase.lateFeesOwedUSD.toFixed(2) + " USD; c) Costas procesales del 20%: $" + jCase.courtFeesUSD.toFixed(2) + " USD. Total estimado de la demanda: $" + jCase.totalClaimUSD.toFixed(2) + " USD (Bs. " + jCase.totalClaimVES.toLocaleString() + " calculados a la tasa oficial del Banco Central de Venezuela).",
      "",
      "CAPÍTULO IV: MEDIDA CAUTELAR DE SECUESTRO (CPC Art. 585 y 599)",
      "Solicito muy respetuosamente al Tribunal decrete MEDIDA CAUTELAR DE SECUESTRO sobre el vehículo automotor antes identificado, oficiándose a los cuerpos policiales y de tránsito competentes para su inmediata retención y depósito judicial.",
      "",
      "Justicia en la fecha de su presentación.",
      "Firma: " + jCase.assignedLawyer + " | Sello: " + jCase.sha256Seal
    ].join("\n");
  }
}
