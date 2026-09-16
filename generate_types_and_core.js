const fs = require("fs");
const path = require("path");

function ensureDir(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function writeFile(relPath, content) {
  const fullPath = path.join(__dirname, relPath);
  ensureDir(fullPath);
  fs.writeFileSync(fullPath, content.trim() + "\n", "utf8");
  console.log("✓ Generated: " + relPath);
}

// 1. src/types/index.ts
writeFile("src/types/index.ts", `
export type Currency = 'USD' | 'VES' | 'USDT';

export interface BcvRateSnapshot {
  usdRate: number; // Tasa USD oficial BCV en Bolívares
  eurRate: number; // Tasa EUR oficial BCV en Bolívares
  date: string;    // YYYY-MM-DD
  fetchedAt: string;
  source: 'BCV_OFFICIAL' | 'MANUAL_OVERRIDE';
}

export type DeliveryMilestoneType = 
  | 'IMMEDIATE'            // Entrega inmediata tras inicial + gastos adm
  | 'ACCUMULATED_QUOTAS'   // Entrega tras pagar inicial + N cuotas puntuales
  | 'ROTATIVE_POOL';       // Entrega por fondo común / adjudicación rotativa

export type VehicleType = 'MOTO' | 'CARRO' | 'CAMIONETA' | 'UTILITARIO';

export interface VehicleSpec {
  id: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  color: string;
  vinChassis: string;
  engineSerial: string;
  plate?: string;
  dealerPriceUSD: number;       // Precio de compra a la ensambladora/concesionario
  retailPriceUSD: number;       // Precio de venta financiado al cliente
  isPriceLocked: boolean;       // Si el precio está congelado o sujeto a variación
  status: 'IN_STOCK' | 'ASSIGNED' | 'DELIVERED' | 'REPOSSESSED' | 'RELEASED';
  gpsImei?: string;
  gpsStatus?: 'ACTIVE' | 'DISCONNECTED' | 'IMMOBILIZED';
}

export interface InitialCostBreakdown {
  vehicleDownPaymentUSD: number;   // Inicial del vehículo (abona al precio)
  adminFeeUSD: number;             // Gastos administrativos / estudio
  gpsSetupFeeUSD: number;          // Dispositivo e instalación GPS
  inttProcessingFeeUSD: number;    // Aranceles INTT, placas y experticia
  rcvInsuranceFeeUSD: number;      // Póliza RCV
  totalInitialRequiredUSD: number; // Suma total a pagar para iniciar
}

export type PaymentFrequency = 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
export type AmortizationMethod = 'FLAT' | 'FRENCH' | 'GERMAN';

export interface PaymentScheduleItem {
  quotaNumber: number;
  dueDate: string;
  capitalUSD: number;
  interestUSD: number;
  ivaUSD: number;
  totalQuotaUSD: number;
  paidAmountUSD: number;
  remainingAmountUSD: number;
  status: 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';
  paidDate?: string;
  receiptNumber?: string;
  receiptType?: 'FULL_QUOTA_OFFICIAL' | 'PARTIAL_PAYMENT_VOUCHER';
  bcvRateAtPayment?: number;
  paidAmountVES?: number;
  paymentMethod?: 'PAGO_MOVIL' | 'BINANCE_USDT' | 'CASH_USD' | 'TRANSFER_VES';
  paymentReference?: string;
  whatsappSent: boolean;
}

export interface LoanContract {
  id: string;
  tenantId: string;
  contractNumber: string;
  clientId: string;
  clientName: string;
  clientDocId: string; // Cédula o RIF
  clientPhone: string;
  clientAddress: string;
  vehicle: VehicleSpec;
  initialCosts: InitialCostBreakdown;
  financedAmountUSD: number;
  interestRateAnnual: number;
  frequency: PaymentFrequency;
  totalQuotas: number;
  deliveryMilestone: {
    type: DeliveryMilestoneType;
    requiredQuotasToDeliver?: number; // ej. 3 cuotas puntuales
    isDelivered: boolean;
    deliveredDate?: string;
  };
  schedule: PaymentScheduleItem[];
  totalPaidUSD: number;
  totalOutstandingUSD: number;
  status: 'QUOTATION' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'RESTRUCTURED' | 'SETTLED' | 'IN_DEFAULT';
  creationDate: string;
  guarantor?: {
    name: string;
    docId: string;
    phone: string;
    address: string;
  };
}

export interface TreasuryVaultMetrics {
  totalCashUSD: number;
  totalCashVES: number;
  totalBankVES: number;
  totalBinanceUSDT: number;
  
  // Guardián contra la descapitalización
  committedDownPaymentsUSD: number; // Bóveda de iniciales reservadas para compra de vehículos (intocable)
  freeOperatingCapitalUSD: number;  // Capital libre para nómina, gastos e inversiones
  
  // Punto de Equilibrio y Salud
  monthlyFixedCostsUSD: number;
  minimumMonthlyCollectionRequiredUSD: number;
  currentMonthCollectedUSD: number;
  breakEvenProgressPercent: number;
  runwayMonths: number;
  liquidityAlert: 'HEALTHY' | 'MODERATE_RISK' | 'CRITICAL_INSOLVENCY_RISK';
}

export interface RotativePoolStatus {
  totalPoolCashUSD: number;
  totalQueuedAdjudications: number;
  costPerUnitUSD: number;
  purchasableUnitsNow: number;
  estimatedDaysToNextPurchase: number;
  isBottleneckDetected: boolean;
}

export interface InttProcedure {
  id: string;
  contractId: string;
  clientName: string;
  vehiclePlate?: string;
  vinChassis: string;
  stage: 
    | 'FEES_PENDING' 
    | 'TECHNICAL_INSPECTION' 
    | 'LOADED_INTO_INTT_PORTAL' 
    | 'AWAITING_TITLE_PLATES' 
    | 'DOCUMENTS_RECEIVED' 
    | 'DELIVERED_TO_CLIENT';
  lastUpdated: string;
  disclaimerSigned: boolean; // Descargo por demoras del portal público
  observations: string;
}

export interface PromoCampaign {
  id: string;
  code: string;
  title: string;
  description: string;
  discountPercent?: number;
  reducedDownPaymentUSD?: number;
  startDate: string;
  expirationDate: string; // ISO datetime con hora exacta
  maxSlots: number;
  usedSlots: number;
  isActive: boolean;
  termsAndConditions: string;
}

export interface TimeLockedQuote {
  id: string;
  quoteNumber: string;
  campaignCode?: string;
  clientName: string;
  clientPhone: string;
  vehicleModel: string;
  vehiclePriceUSD: number;
  downPaymentUSD: number;
  numberOfQuotas: number;
  monthlyQuotaUSD: number;
  bcvRateSnapshot: number;
  createdAt: string;
  expiresAt: string; // Timestamp de expiración
  isExpired: boolean;
  sha256Seal: string;
  acceptedByClient: boolean;
  acceptedAt?: string;
}
`);

// 2. src/modules/bcv-engine/index.ts
writeFile("src/modules/bcv-engine/index.ts", `
import { BcvRateSnapshot } from '@/types';

export class BcvEngine {
  private static currentRate: BcvRateSnapshot = {
    usdRate: 46.85,  // Tasa de ejemplo referencial oficial BCV
    eurRate: 50.12,
    date: new Date().toISOString().split('T')[0],
    fetchedAt: new Date().toISOString(),
    source: 'BCV_OFFICIAL'
  };

  private static historicalRates: Map<string, BcvRateSnapshot> = new Map();

  /**
   * Obtiene la tasa BCV oficial actual del sistema
   */
  public static getCurrentRate(): BcvRateSnapshot {
    return { ...this.currentRate };
  }

  /**
   * Actualiza la tasa BCV manualmente o por webhook/scraping oficial
   */
  public static setRate(usdRate: number, eurRate: number, source: 'BCV_OFFICIAL' | 'MANUAL_OVERRIDE' = 'BCV_OFFICIAL'): BcvRateSnapshot {
    const today = new Date().toISOString().split('T')[0];
    const snapshot: BcvRateSnapshot = {
      usdRate: Number(usdRate.toFixed(4)),
      eurRate: Number(eurRate.toFixed(4)),
      date: today,
      fetchedAt: new Date().toISOString(),
      source
    };
    this.currentRate = snapshot;
    this.historicalRates.set(today, snapshot);
    return snapshot;
  }

  /**
   * Convierte un monto en Dólares (USD) a Bolívares (VES) a la tasa BCV indicada o la actual
   */
  public static convertUsdToVes(amountUSD: number, customRate?: number): number {
    const rate = customRate || this.currentRate.usdRate;
    return Number((amountUSD * rate).toFixed(2));
  }

  /**
   * Convierte un monto recibido en Bolívares (VES) a Dólares (USD) a la tasa BCV indicada o la actual
   */
  public static convertVesToUsd(amountVES: number, customRate?: number): number {
    const rate = customRate || this.currentRate.usdRate;
    if (rate <= 0) return 0;
    return Number((amountVES / rate).toFixed(2));
  }

  /**
   * Formatea un monto en Bolívares con separadores
   */
  public static formatVes(amount: number): string {
    return 'Bs. ' + amount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /**
   * Formatea un monto en Dólares
   */
  public static formatUsd(amount: number): string {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
`);

// 3. src/modules/financial-core/index.ts
writeFile("src/modules/financial-core/index.ts", `
import { 
  PaymentScheduleItem, 
  PaymentFrequency, 
  AmortizationMethod,
  VehicleSpec, 
  InitialCostBreakdown,
  LoanContract,
  DeliveryMilestoneType 
} from '@/types';
import { BcvEngine } from '../bcv-engine';

export class FinancialCore {
  /**
   * Calcula el desglose completo de costos iniciales
   */
  public static calculateInitialCosts(params: {
    vehiclePriceUSD: number;
    downPaymentPercent: number; // ej. 30 para 30%
    adminFeeUSD?: number;
    gpsSetupFeeUSD?: number;
    inttProcessingFeeUSD?: number;
    rcvInsuranceFeeUSD?: number;
  }): InitialCostBreakdown {
    const vehicleDownPaymentUSD = Number(((params.vehiclePriceUSD * params.downPaymentPercent) / 100).toFixed(2));
    const adminFeeUSD = params.adminFeeUSD ?? 50.0;
    const gpsSetupFeeUSD = params.gpsSetupFeeUSD ?? 120.0;
    const inttProcessingFeeUSD = params.inttProcessingFeeUSD ?? 80.0;
    const rcvInsuranceFeeUSD = params.rcvInsuranceFeeUSD ?? 35.0;

    const totalInitialRequiredUSD = Number((
      vehicleDownPaymentUSD + 
      adminFeeUSD + 
      gpsSetupFeeUSD + 
      inttProcessingFeeUSD + 
      rcvInsuranceFeeUSD
    ).toFixed(2));

    return {
      vehicleDownPaymentUSD,
      adminFeeUSD,
      gpsSetupFeeUSD,
      inttProcessingFeeUSD,
      rcvInsuranceFeeUSD,
      totalInitialRequiredUSD
    };
  }

  /**
   * Genera el Plan de Abonos (Cronograma de Amortización) en USD
   */
  public static generatePaymentSchedule(params: {
    financedAmountUSD: number;
    annualInterestRatePercent: number; // ej. 18 para 18% anual
    totalQuotas: number;
    frequency: PaymentFrequency;
    method?: AmortizationMethod;
    startDate?: string;
    includeIvaPercent?: number; // ej. 16 para 16% IVA sobre interés o cuota
  }): PaymentScheduleItem[] {
    const method = params.method || 'FLAT';
    const ivaPercent = params.includeIvaPercent || 0;
    const schedule: PaymentScheduleItem[] = [];
    
    // Intervalo de días por frecuencia
    const daysInterval = params.frequency === 'MONTHLY' ? 30 : params.frequency === 'BIWEEKLY' ? 15 : params.frequency === 'WEEKLY' ? 7 : 1;
    const baseDate = params.startDate ? new Date(params.startDate) : new Date();

    if (method === 'FLAT') {
      // Método Flat / Directo: El interés total se prorratea equitativamente
      const totalInterest = (params.financedAmountUSD * (params.annualInterestRatePercent / 100) * (params.totalQuotas / 12));
      const capitalPerQuota = Number((params.financedAmountUSD / params.totalQuotas).toFixed(2));
      const interestPerQuota = Number((totalInterest / params.totalQuotas).toFixed(2));
      const ivaPerQuota = Number(((interestPerQuota * ivaPercent) / 100).toFixed(2));
      const totalQuotaUSD = Number((capitalPerQuota + interestPerQuota + ivaPerQuota).toFixed(2));

      for (let i = 1; i <= params.totalQuotas; i++) {
        const dueDate = new Date(baseDate);
        dueDate.setDate(dueDate.getDate() + (i * daysInterval));

        schedule.push({
          quotaNumber: i,
          dueDate: dueDate.toISOString().split('T')[0],
          capitalUSD: capitalPerQuota,
          interestUSD: interestPerQuota,
          ivaUSD: ivaPerQuota,
          totalQuotaUSD,
          paidAmountUSD: 0,
          remainingAmountUSD: totalQuotaUSD,
          status: 'PENDING',
          whatsappSent: false
        });
      }
    } else if (method === 'FRENCH') {
      // Sistema Francés de Cuota Fija sobre saldo deudor
      const periodicRate = (params.annualInterestRatePercent / 100) / (12 / (daysInterval / 30));
      const annuity = Number((
        (params.financedAmountUSD * periodicRate) / 
        (1 - Math.pow(1 + periodicRate, -params.totalQuotas))
      ).toFixed(2));

      let currentBalance = params.financedAmountUSD;
      for (let i = 1; i <= params.totalQuotas; i++) {
        const dueDate = new Date(baseDate);
        dueDate.setDate(dueDate.getDate() + (i * daysInterval));

        const interest = Number((currentBalance * periodicRate).toFixed(2));
        const capital = Number((annuity - interest).toFixed(2));
        const iva = Number(((interest * ivaPercent) / 100).toFixed(2));
        const total = Number((capital + interest + iva).toFixed(2));
        currentBalance = Number((currentBalance - capital).toFixed(2));

        schedule.push({
          quotaNumber: i,
          dueDate: dueDate.toISOString().split('T')[0],
          capitalUSD: capital,
          interestUSD: interest,
          ivaUSD: iva,
          totalQuotaUSD: total,
          paidAmountUSD: 0,
          remainingAmountUSD: total,
          status: 'PENDING',
          whatsappSent: false
        });
      }
    }

    return schedule;
  }

  /**
   * Procesa un abono (Total o Parcial) a una cuota específica del plan
   */
  public static processPayment(params: {
    schedule: PaymentScheduleItem[];
    quotaNumber: number;
    amountPaidUSD: number;
    paymentMethod: 'PAGO_MOVIL' | 'BINANCE_USDT' | 'CASH_USD' | 'TRANSFER_VES';
    paymentReference: string;
    bcvRate?: number;
    clientName: string;
    contractNumber: string;
  }): {
    updatedSchedule: PaymentScheduleItem[];
    processedItem: PaymentScheduleItem;
    receiptType: 'FULL_QUOTA_OFFICIAL' | 'PARTIAL_PAYMENT_VOUCHER';
    receiptCode: string;
    whatsappMessage: string;
    isQuotaCompleted: boolean;
  } {
    const updatedSchedule = [...params.schedule];
    const itemIndex = updatedSchedule.findIndex(q => q.quotaNumber === params.quotaNumber);
    if (itemIndex === -1) {
      throw new Error(`Cuota #${params.quotaNumber} no encontrada en el cronograma.`);
    }

    const item = { ...updatedSchedule[itemIndex] };
    const bcvRate = params.bcvRate || BcvEngine.getCurrentRate().usdRate;
    const paidAmountVES = BcvEngine.convertUsdToVes(params.amountPaidUSD, bcvRate);

    const newTotalPaid = Number((item.paidAmountUSD + params.amountPaidUSD).toFixed(2));
    const remaining = Number((item.totalQuotaUSD - newTotalPaid).toFixed(2));

    const isQuotaCompleted = remaining <= 0.01;
    const receiptType: 'FULL_QUOTA_OFFICIAL' | 'PARTIAL_PAYMENT_VOUCHER' = isQuotaCompleted 
      ? 'FULL_QUOTA_OFFICIAL' 
      : 'PARTIAL_PAYMENT_VOUCHER';

    const timestamp = Date.now().toString().slice(-6);
    const receiptCode = isQuotaCompleted 
      ? `REC-${params.contractNumber}-Q${item.quotaNumber}-${timestamp}`
      : `ABN-${params.contractNumber}-Q${item.quotaNumber}-${timestamp}`;

    item.paidAmountUSD = newTotalPaid;
    item.remainingAmountUSD = Math.max(0, remaining);
    item.status = isQuotaCompleted ? 'PAID' : 'PARTIALLY_PAID';
    item.paidDate = new Date().toISOString();
    item.receiptNumber = receiptCode;
    item.receiptType = receiptType;
    item.bcvRateAtPayment = bcvRate;
    item.paidAmountVES = paidAmountVES;
    item.paymentMethod = params.paymentMethod;
    item.paymentReference = params.paymentReference;

    updatedSchedule[itemIndex] = item;

    // Generar mensaje estructurado de WhatsApp
    const whatsappMessage = this.composeWhatsAppReceiptMessage({
      clientName: params.clientName,
      contractNumber: params.contractNumber,
      quotaNumber: item.quotaNumber,
      totalQuotas: updatedSchedule.length,
      amountPaidUSD: params.amountPaidUSD,
      amountPaidVES: paidAmountVES,
      bcvRate,
      remainingAmountUSD: item.remainingAmountUSD,
      receiptCode,
      receiptType,
      paymentMethod: params.paymentMethod,
      paymentReference: params.paymentReference
    });

    return {
      updatedSchedule,
      processedItem: item,
      receiptType,
      receiptCode,
      whatsappMessage,
      isQuotaCompleted
    };
  }

  /**
   * Genera el texto del mensaje de confirmación por WhatsApp con QR y enlace al recibo
   */
  private static composeWhatsAppReceiptMessage(params: {
    clientName: string;
    contractNumber: string;
    quotaNumber: number;
    totalQuotas: number;
    amountPaidUSD: number;
    amountPaidVES: number;
    bcvRate: number;
    remainingAmountUSD: number;
    receiptCode: string;
    receiptType: 'FULL_QUOTA_OFFICIAL' | 'PARTIAL_PAYMENT_VOUCHER';
    paymentMethod: string;
    paymentReference: string;
  }): string {
    const isFull = params.receiptType === 'FULL_QUOTA_OFFICIAL';
    const methodNames: Record<string, string> = {
      PAGO_MOVIL: '📱 Pago Móvil (Bs.)',
      BINANCE_USDT: '🟡 Binance Pay (USDT)',
      CASH_USD: '💵 Efectivo Dólares ($)',
      TRANSFER_VES: '🏦 Transferencia Bancaria'
    };

    if (isFull) {
      return (
        `🚗 *COMPROBANTE OFICIAL DE PAGO - CUOTA #${params.quotaNumber} / ${params.totalQuotas}* 🚗\n\n` +
        `Estimado(a) *${params.clientName}*,\n` +
        `Hemos validado exitosamente su pago correspondiente al contrato *${params.contractNumber}*.\n\n` +
        `📄 *Nro. de Recibo:* ${params.receiptCode}\n` +
        `💵 *Monto Pagado:* $${params.amountPaidUSD.toFixed(2)} USD\n` +
        `🇻🇪 *Equivalente BCV:* Bs. ${params.amountPaidVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })} (Tasa: Bs. ${params.bcvRate.toFixed(2)})\n` +
        `💳 *Método:* ${methodNames[params.paymentMethod] || params.paymentMethod}\n` +
        `🔖 *Referencia:* ${params.paymentReference}\n` +
        `✅ *Estado de la Cuota:* TOTALMENTE SALDADA\n\n` +
        `🔗 *Descargue su Recibo Digital Oficial aquí:*\\nhttps://autolending.app/recibos/${params.receiptCode}\\n\\n` +
        `_Gracias por mantener su financiamiento al día._`
      );
    } else {
      return (
        `⚠️ *COMPROBANTE PROVISIONAL DE ABONO A CUENTA* ⚠️\n\n` +
        `Estimado(a) *${params.clientName}*,\n` +
        `Hemos registrado su *abono parcial* a la Cuota #${params.quotaNumber} del contrato *${params.contractNumber}*.\n\n` +
        `📄 *Comprobante de Abono:* ${params.receiptCode}\n` +
        `💵 *Monto Abonado:* $${params.amountPaidUSD.toFixed(2)} USD\n` +
        `🇻🇪 *Equivalente BCV:* Bs. ${params.amountPaidVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })} (Tasa: Bs. ${params.bcvRate.toFixed(2)})\n` +
        `⏳ *Saldo Restante para Completar Cuota:* $${params.remainingAmountUSD.toFixed(2)} USD\n` +
        `💳 *Método:* ${methodNames[params.paymentMethod] || params.paymentMethod}\n` +
        `🔖 *Referencia:* ${params.paymentReference}\n\n` +
        `_Nota: El Recibo Oficial Definitivo se emitirá automáticamente una vez completado el saldo restante._\n` +
        `🔗 *Ver su Plan de Abonos:* https://autolending.app/mi-cuenta/${params.contractNumber}`
      );
    }
  }

  /**
   * Evalúa si un contrato ha alcanzado el Hito de Entrega del Vehículo
   */
  public static checkDeliveryEligibility(contract: LoanContract): {
    isEligible: boolean;
    reason: string;
    paidQuotasCount: number;
    requiredQuotas: number;
  } {
    const paidQuotas = contract.schedule.filter(q => q.status === 'PAID').length;

    if (contract.deliveryMilestone.type === 'IMMEDIATE') {
      return {
        isEligible: true,
        reason: 'Modalidad de Entrega Inmediata tras pago de Inicial y Gastos Administrativos.',
        paidQuotasCount: paidQuotas,
        requiredQuotas: 0
      };
    }

    if (contract.deliveryMilestone.type === 'ACCUMULATED_QUOTAS') {
      const required = contract.deliveryMilestone.requiredQuotasToDeliver || 3;
      const isEligible = paidQuotas >= required;
      return {
        isEligible,
        reason: isEligible 
          ? `Hito cumplido: Ha pagado ${paidQuotas} de ${required} cuotas consecutivas requeridas.`
          : `Hito pendiente: Lleva ${paidQuotas} de ${required} cuotas necesarias para adjudicación física.`,
        paidQuotasCount: paidQuotas,
        requiredQuotas: required
      };
    }

    return {
      isEligible: false,
      reason: 'Modalidad de Fondo Rotativo sujeta a disponibilidad de la bolsa común.',
      paidQuotasCount: paidQuotas,
      requiredQuotas: 1
    };
  }
}
`);

console.log("Core financial modules generated successfully.");
