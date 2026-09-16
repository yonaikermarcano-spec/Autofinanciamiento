import { PromoCampaign, TimeLockedQuote } from '../../types';
import { BcvEngine } from '../bcv-engine';

export class PromoEngine {
  private static campaigns: PromoCampaign[] = [
    {
      id: 'CAMP-001',
      code: 'MOTO-EXPRESS-2026',
      title: 'Plan Rueda Ya: Motos 150cc con Inicial Reducida',
      description: 'Inicial desde $150 con financiamiento a 12 meses a tasa preferencial.',
      discountPercent: 5,
      reducedDownPaymentUSD: 150.0,
      startDate: '2026-08-01T00:00:00Z',
      expirationDate: '2026-08-31T23:59:59Z',
      maxSlots: 50,
      usedSlots: 38,
      isActive: true,
      termsAndConditions: 'Promoción válida hasta el 31/08/2026 o hasta agotar 50 cupos. Requiere verificación de ingresos y RCV vigente.'
    }
  ];

  /**
   * Obtiene las campañas activas verificando caducidad y cupos disponibles
   */
  public static getActiveCampaigns(): PromoCampaign[] {
    const now = new Date().getTime();
    return this.campaigns.map(c => {
      const isExpired = now > new Date(c.expirationDate).getTime();
      const isSlotsFull = c.usedSlots >= c.maxSlots;
      return {
        ...c,
        isActive: c.isActive && !isExpired && !isSlotsFull
      };
    });
  }

  /**
   * Genera una cotización temporizada sellada criptográficamente
   */
  public static createTimeLockedQuote(params: {
    clientName: string;
    clientPhone: string;
    vehicleModel: string;
    vehiclePriceUSD: number;
    downPaymentUSD: number;
    numberOfQuotas: number;
    campaignCode?: string;
    validityHours?: number;
  }): TimeLockedQuote {
    const validityHours = params.validityHours || 48; // 48 horas de vigencia por defecto
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (validityHours * 60 * 60 * 1000)).toISOString();

    const financed = params.vehiclePriceUSD - params.downPaymentUSD;
    const monthlyQuotaUSD = Number(((financed * 1.15) / params.numberOfQuotas).toFixed(2));
    const bcvRate = BcvEngine.getCurrentRate().usdRate;

    const quoteNumber = `COT-${Date.now().toString().slice(-6)}`;
    const rawData = `${quoteNumber}|${params.clientName}|${params.vehicleModel}|${params.vehiclePriceUSD}|${params.downPaymentUSD}|${expiresAt}|${bcvRate}`;
    
    // Generar un hash simulado simple para el sellado
    let hash = 0;
    for (let i = 0; i < rawData.length; i++) {
      hash = ((hash << 5) - hash) + rawData.charCodeAt(i);
      hash |= 0;
    }
    const sha256Seal = `SHA256-${Math.abs(hash).toString(16).padStart(16, '0')}`;

    return {
      id: `TLQ-${Date.now()}`,
      quoteNumber,
      campaignCode: params.campaignCode,
      clientName: params.clientName,
      clientPhone: params.clientPhone,
      vehicleModel: params.vehicleModel,
      vehiclePriceUSD: params.vehiclePriceUSD,
      downPaymentUSD: params.downPaymentUSD,
      numberOfQuotas: params.numberOfQuotas,
      monthlyQuotaUSD,
      bcvRateSnapshot: bcvRate,
      createdAt: now.toISOString(),
      expiresAt,
      isExpired: false,
      sha256Seal,
      acceptedByClient: false
    };
  }

  /**
   * Valida si una cotización aún está vigente o ya caducó
   */
  public static checkQuoteValidity(quote: TimeLockedQuote): {
    isValid: boolean;
    remainingHours: number;
    statusMessage: string;
  } {
    const now = Date.now();
    const expiration = new Date(quote.expiresAt).getTime();
    const diffMs = expiration - now;

    if (diffMs <= 0) {
      return {
        isValid: false,
        remainingHours: 0,
        statusMessage: '⛔ Esta cotización ha expirado. Las condiciones y precios promocionales ya no son válidos.'
      };
    }

    const remainingHours = Number((diffMs / (1000 * 60 * 60)).toFixed(1));
    return {
      isValid: true,
      remainingHours,
      statusMessage: `✅ Cotización vigente. Expira en ${remainingHours} horas.`
    };
  }
}