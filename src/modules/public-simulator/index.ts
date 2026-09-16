"use client";

import { BcvEngine } from '../bcv-engine';

export interface SimulatorVehicleOption {
  id: string;
  type: 'MOTO' | 'CARRO';
  brand: string;
  model: string;
  year: number;
  engineCc: string;
  retailPriceUSD: number;
  minDownPaymentPercent: number; // Ej: 30%
  imageUrl?: string;
  popularBadge?: string;
}

export interface SimulationResult {
  vehicle: SimulatorVehicleOption;
  downPaymentPercent: number;
  downPaymentUSD: number;
  downPaymentVES: number;
  adminFeeUSD: number;
  gpsFeeUSD: number;
  inttFeeUSD: number;
  rcvFeeUSD: number;
  totalInitialRequiredUSD: number;
  totalInitialRequiredVES: number;
  financedAmountUSD: number;
  termMonths: number;
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  totalQuotasCount: number;
  quotaAmountUSD: number;
  quotaAmountVES: number;
  bcvRate: number;
}

export interface LeadApplicationData {
  clientName: string;
  clientDocId: string;
  clientPhone: string;
  clientCity: string;
  employmentType: 'DELIVERY_RIDERS' | 'COMERCIO_INDEPENDIENTE' | 'EMPLEADO_EMPRESA' | 'TRANSPORTE';
  monthlyIncomeUSD: number;
  guarantorName: string;
  guarantorPhone: string;
  guarantorDocId: string;
  simulation: SimulationResult;
}

export interface PreApprovalScoreResult {
  status: 'PRE_APROBADO_INMEDIATO' | 'PRE_APROBADO_CON_AVAL' | 'REQUIERE_EVALUACION_ESPECIAL';
  score: number; // 0 - 100
  debtToIncomeRatioPercent: number;
  recommendation: string;
  whatsappMessage: string;
  whatsappUrl: string;
  leadId: string;
}

export class PublicSimulatorEngine {
  public static readonly AVAILABLE_VEHICLES: SimulatorVehicleOption[] = [
    {
      id: "sim-bera-sbr",
      type: "MOTO",
      brand: "Bera",
      model: "SBR 150cc",
      year: 2026,
      engineCc: "150cc",
      retailPriceUSD: 1200,
      minDownPaymentPercent: 30,
      popularBadge: "MÁS VENDIDA EN VENEZUELA"
    },
    {
      id: "sim-ek-express",
      type: "MOTO",
      brand: "Empire Keeway",
      model: "EK Express 150",
      year: 2026,
      engineCc: "150cc",
      retailPriceUSD: 1100,
      minDownPaymentPercent: 30,
      popularBadge: "IDEAL PARA TRABAJO / DELIVERY"
    },
    {
      id: "sim-toro-tr150",
      type: "MOTO",
      brand: "Motos Toro",
      model: "TR-150 Tank",
      year: 2026,
      engineCc: "150cc",
      retailPriceUSD: 1350,
      minDownPaymentPercent: 30,
      popularBadge: "ALTA RESISTENCIA"
    },
    {
      id: "sim-bera-kavak",
      type: "MOTO",
      brand: "Bera",
      model: "Kavak 150cc",
      year: 2026,
      engineCc: "150cc",
      retailPriceUSD: 1450,
      minDownPaymentPercent: 30
    },
    {
      id: "sim-toyota-yaris",
      type: "CARRO",
      brand: "Toyota",
      model: "Yaris Hatchback",
      year: 2024,
      engineCc: "1.5L",
      retailPriceUSD: 16500,
      minDownPaymentPercent: 40,
      popularBadge: "VEHÍCULO FAMILIAR"
    }
  ];

  /**
   * Calcula el plan financiero según inicial, plazo y frecuencia
   */
  public static calculateSimulation(params: {
    vehicle: SimulatorVehicleOption;
    downPaymentPercent: number;
    termMonths: number;
    frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
    bcvRate: number;
  }): SimulationResult {
    const { vehicle, downPaymentPercent, termMonths, frequency, bcvRate } = params;

    const downPaymentUSD = Number((vehicle.retailPriceUSD * (downPaymentPercent / 100)).toFixed(2));
    const adminFeeUSD = 50.00;
    const gpsFeeUSD = 120.00;
    const inttFeeUSD = 80.00;
    const rcvFeeUSD = 35.00;

    const totalInitialRequiredUSD = Number((downPaymentUSD + adminFeeUSD + gpsFeeUSD + inttFeeUSD + rcvFeeUSD).toFixed(2));
    const financedAmountUSD = Number((vehicle.retailPriceUSD - downPaymentUSD).toFixed(2));

    // Tasa de interés anual aproximada: 15%
    const totalInterestUSD = financedAmountUSD * 0.15 * (termMonths / 12);
    const totalToPayUSD = financedAmountUSD + totalInterestUSD;

    let totalQuotasCount = termMonths;
    if (frequency === 'BIWEEKLY') totalQuotasCount = termMonths * 2;
    if (frequency === 'WEEKLY') totalQuotasCount = termMonths * 4;

    const quotaAmountUSD = Number((totalToPayUSD / totalQuotasCount).toFixed(2));

    return {
      vehicle,
      downPaymentPercent,
      downPaymentUSD,
      downPaymentVES: Number((downPaymentUSD * bcvRate).toFixed(2)),
      adminFeeUSD,
      gpsFeeUSD,
      inttFeeUSD,
      rcvFeeUSD,
      totalInitialRequiredUSD,
      totalInitialRequiredVES: Number((totalInitialRequiredUSD * bcvRate).toFixed(2)),
      financedAmountUSD,
      termMonths,
      frequency,
      totalQuotasCount,
      quotaAmountUSD,
      quotaAmountVES: Number((quotaAmountUSD * bcvRate).toFixed(2)),
      bcvRate
    };
  }

  /**
   * Evalúa la pre-aprobación crediticia del cliente y genera el link a WhatsApp
   */
  public static evaluatePreApproval(
    application: LeadApplicationData,
    companyWhatsAppPhone: string = "584143329011"
  ): PreApprovalScoreResult {
    const monthlyQuotaUSD = application.simulation.frequency === 'WEEKLY'
      ? application.simulation.quotaAmountUSD * 4
      : application.simulation.frequency === 'BIWEEKLY'
      ? application.simulation.quotaAmountUSD * 2
      : application.simulation.quotaAmountUSD;

    const income = application.monthlyIncomeUSD || 300;
    const debtRatio = Number(((monthlyQuotaUSD / income) * 100).toFixed(1));

    let status: 'PRE_APROBADO_INMEDIATO' | 'PRE_APROBADO_CON_AVAL' | 'REQUIERE_EVALUACION_ESPECIAL' = 'PRE_APROBADO_INMEDIATO';
    let score = 90;
    let recommendation = "Tu perfil califica excelentemente para entrega con tu inicial y cuota seleccionada.";

    if (debtRatio > 40) {
      status = 'PRE_APROBADO_CON_AVAL';
      score = 75;
      recommendation = "Pre-aprobado. Se requiere comprobante de ingresos del fiador solidario.";
    } else if (debtRatio > 65) {
      status = 'REQUIERE_EVALUACION_ESPECIAL';
      score = 55;
      recommendation = "Recomendamos aumentar la inicial para reducir el monto de la cuota periódica.";
    }

    const leadId = "LEAD-" + Date.now().toString().slice(-6);

    const freqLabel = application.simulation.frequency === 'WEEKLY' ? "Semanales" : application.simulation.frequency === 'BIWEEKLY' ? "Quincenales" : "Mensuales";

    const text = [
      "🏍️ ¡HOLA! DESEO FORMALIZAR MI FINANCIAMIENTO PRE-APROBADO",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "📋 Código de Pre-Aprobación: #" + leadId,
      "👤 Solicitante: " + application.clientName + " (CI: " + application.clientDocId + ")",
      "📍 Ciudad: " + application.clientCity,
      "💼 Actividad: " + application.employmentType.replace(/_/g, ' '),
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "🛵 Vehículo Seleccionado: " + application.simulation.vehicle.brand + " " + application.simulation.vehicle.model,
      "💵 Precio de Venta: $" + application.simulation.vehicle.retailPriceUSD + " USD",
      "💰 Inicial a Pagar: $" + application.simulation.totalInitialRequiredUSD + " USD (Bs. " + application.simulation.totalInitialRequiredVES.toLocaleString() + ")",
      "📅 Plan de Cuotas: " + application.simulation.totalQuotasCount + " cuotas " + freqLabel + " de $" + application.simulation.quotaAmountUSD + " USD (Bs. " + application.simulation.quotaAmountVES.toLocaleString() + ")",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "🤝 Fiador Solidario: " + application.guarantorName + " (" + application.guarantorPhone + ")",
      "🚦 Estado de Evaluación: " + status.replace(/_/g, ' '),
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Adjunto mis recaudos para proceder con la firma del contrato y reserva de unidad."
    ].join("\n");

    const cleanCompanyPhone = companyWhatsAppPhone.replace(/[^0-9]/g, '');
    const whatsappUrl = "https://wa.me/" + cleanCompanyPhone + "?text=" + encodeURIComponent(text);

    return {
      status,
      score,
      debtToIncomeRatioPercent: debtRatio,
      recommendation,
      whatsappMessage: text,
      whatsappUrl,
      leadId
    };
  }
}
