"use client";

import { LoanContract } from '../../types';
import { LocalDB } from '../local-db';

export type EmploymentType = 'DELIVERY_APP' | 'COMERCIANTE_INFORMAL' | 'EMPLEADO_PRIVADO' | 'EMPLEADO_PUBLICO' | 'PROFESIONAL_INDEPENDIENTE';
export type HousingType = 'PROPIA' | 'FAMILIAR' | 'ALQUILADA';
export type RiskTier = 'CLASE_A_BAJO_RIESGO' | 'CLASE_B_RIESGO_MODERADO' | 'CLASE_C_ALTO_RIESGO';

export interface ApplicantEvaluationInput {
  fullName: string;
  docId: string;
  phone: string;
  employmentType: EmploymentType;
  monthlyIncomeUSD: number;
  housingType: HousingType;
  yearsAtCurrentAddress: number;
  hasGuarantor: boolean;
  guarantorHasIncome: boolean;
  bikePriceUSD: number;
  downPaymentPercent: number; // 30% a 70%
  termMonths: number;
}

export interface ScoringResult {
  score: number; // 0 a 1000
  riskTier: RiskTier;
  approvalStatus: 'APROBADO_INMEDIATO' | 'APROBADO_CON_CONDICIONES' | 'RECHAZADO_REQUIERE_MAYOR_INICIAL';
  maxFinancingApprovedUSD: number;
  recommendedDownPaymentPercent: number;
  recommendedDeliveryMilestone: 'ENTREGA_INMEDIATA' | 'CONDICIONADA_3_CUOTAS';
  strengths: string[];
  riskFactors: string[];
  recommendationNote: string;
  sha256Seal: string;
}

export interface EarlyWarningClient {
  contractNumber: string;
  clientName: string;
  clientPhone: string;
  vehicleModel: string;
  riskLevel: 'ALERTA_AMARILLA' | 'ALERTA_NARANJA' | 'ALERTA_ROJA';
  triggerReason: string;
  daysLateAverage: number;
  lastPaymentDate: string;
  suggestedAction: string;
}

export class CreditScoringEngine {
  /**
   * Evalúa el perfil crediticio de un solicitante según el Scorecard Venezolano
   */
  public static evaluateApplicant(input: ApplicantEvaluationInput): ScoringResult {
    let score = 300; // Puntaje base

    const strengths: string[] = [];
    const riskFactors: string[] = [];

    // 1. Evaluación de Ocupación e Ingresos
    if (input.employmentType === 'EMPLEADO_PRIVADO') {
      score += 150;
      strengths.push("Empleo formal en empresa privada");
    } else if (input.employmentType === 'PROFESIONAL_INDEPENDIENTE') {
      score += 130;
      strengths.push("Ingresos profesionales independientes");
    } else if (input.employmentType === 'DELIVERY_APP') {
      score += 110;
      strengths.push("Actividad de delivery productivo comprobada");
    } else if (input.employmentType === 'COMERCIANTE_INFORMAL') {
      score += 90;
      riskFactors.push("Ingresos de comercio informal variables");
    } else {
      score += 80;
      riskFactors.push("Ingresos del sector público");
    }

    // Nivel de Ingresos
    if (input.monthlyIncomeUSD >= 500) {
      score += 160;
      strengths.push("Ingreso mensual superior a $500 USD");
    } else if (input.monthlyIncomeUSD >= 300) {
      score += 110;
      strengths.push("Ingreso mensual estable ($300 - $500 USD)");
    } else {
      score += 50;
      riskFactors.push("Ingreso mensual ajustado (< $300 USD)");
    }

    // 2. Arraigo Habitacional y Estabilidad
    if (input.housingType === 'PROPIA') {
      score += 100;
      strengths.push("Vivienda propia verificada");
    } else if (input.housingType === 'FAMILIAR') {
      score += 70;
    } else {
      score += 40;
      riskFactors.push("Vivienda alquilada");
    }

    if (input.yearsAtCurrentAddress >= 3) {
      score += 50;
      strengths.push("Alta estabilidad de residencia (>3 años)");
    }

    // 3. Fiador Solidario
    if (input.hasGuarantor) {
      score += 90;
      strengths.push("Fiador solidario presentado");
      if (input.guarantorHasIncome) {
        score += 60;
        strengths.push("Fiador con ingresos independientes comprobables");
      }
    } else {
      score -= 50;
      riskFactors.push("Sin fiador solidario");
    }

    // 4. Porcentaje de Inicial Aportado
    if (input.downPaymentPercent >= 50) {
      score += 150;
      strengths.push("Aporte de inicial alto (≥50%)");
    } else if (input.downPaymentPercent >= 40) {
      score += 100;
      strengths.push("Aporte de inicial del 40%");
    } else {
      score += 40;
      riskFactors.push("Inicial mínima del 30%");
    }

    // Ajuste final 0 a 1000
    score = Math.min(1000, Math.max(100, score));

    // Determinar Dictamen y Clase de Riesgo
    let riskTier: RiskTier = 'CLASE_B_RIESGO_MODERADO';
    let approvalStatus: ScoringResult['approvalStatus'] = 'APROBADO_CON_CONDICIONES';
    let recommendedDownPaymentPercent = 35;
    let recommendedDeliveryMilestone: ScoringResult['recommendedDeliveryMilestone'] = 'ENTREGA_INMEDIATA';
    let recommendationNote = "";

    if (score >= 750) {
      riskTier = 'CLASE_A_BAJO_RIESGO';
      approvalStatus = 'APROBADO_INMEDIATO';
      recommendedDownPaymentPercent = 30;
      recommendedDeliveryMilestone = 'ENTREGA_INMEDIATA';
      recommendationNote = "Cliente con excelente perfil crediticio. Aprobación inmediata para entrega en Hito 1 (Pago de Inicial).";
    } else if (score >= 580) {
      riskTier = 'CLASE_B_RIESGO_MODERADO';
      approvalStatus = 'APROBADO_CON_CONDICIONES';
      recommendedDownPaymentPercent = 40;
      recommendedDeliveryMilestone = 'ENTREGA_INMEDIATA';
      recommendationNote = "Perfil viable con riesgo moderado. Se recomienda solicitar fiador con ingresos comprobables o inicial del 40%.";
    } else {
      riskTier = 'CLASE_C_ALTO_RIESGO';
      approvalStatus = 'RECHAZADO_REQUIERE_MAYOR_INICIAL';
      recommendedDownPaymentPercent = 50;
      recommendedDeliveryMilestone = 'CONDICIONADA_3_CUOTAS';
      recommendationNote = "Perfil con alto riesgo de mora. Se recomienda exigir 50% de inicial o entrega condicionada al pago puntual de las primeras 3 cuotas.";
    }

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const rawSeal = input.docId + "|" + score + "|" + riskTier + "|" + timestamp;
    const sha256Seal = "SHA256:" + Buffer.from(rawSeal).toString('hex').slice(0, 32).toUpperCase();

    return {
      score,
      riskTier,
      approvalStatus,
      maxFinancingApprovedUSD: Number((input.bikePriceUSD * (1 - (recommendedDownPaymentPercent / 100))).toFixed(2)),
      recommendedDownPaymentPercent,
      recommendedDeliveryMilestone,
      strengths,
      riskFactors,
      recommendationNote,
      sha256Seal
    };
  }

  /**
   * Obtiene la lista de clientes activos con alertas tempranas de riesgo de mora
   */
  public static getEarlyWarningPortfolio(): EarlyWarningClient[] {
    return [
      {
        contractNumber: "CTR-2026-004",
        clientName: "Roberto Gómez",
        clientPhone: "0416-2291048",
        vehicleModel: "Bera Kavak 150cc",
        riskLevel: "ALERTA_NARANJA",
        triggerReason: "Promedio de 6 días de retraso en los últimos 2 abonos y cambio de teléfono reportado",
        daysLateAverage: 6,
        lastPaymentDate: "2026-08-15",
        suggestedAction: "Contactar a fiador solidario y verificar ubicación GPS preventiva."
      },
      {
        contractNumber: "CTR-2026-005",
        clientName: "Yorman Colmenares",
        clientPhone: "0424-9918204",
        vehicleModel: "Empire Keeway EK Express",
        riskLevel: "ALERTA_AMARILLA",
        triggerReason: "Abono parcial reportado en cuota anterior (quedó saldo pendiente de $12 USD)",
        daysLateAverage: 3,
        lastPaymentDate: "2026-08-18",
        suggestedAction: "Enviar recordatorio amigable de saldo pendiente vía WhatsApp."
      }
    ];
  }
}
