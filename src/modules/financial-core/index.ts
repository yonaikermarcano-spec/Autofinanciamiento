import { 
  PaymentScheduleItem, 
  PaymentFrequency, 
  AmortizationMethod,
  InitialCostBreakdown,
  LoanContract,
  DeliveryStatus,
  DocumentsStatus,
  PhysicalInvoiceStatus,
  VehicleRegistrationStatus,
  ContractStatus
} from '../../types';
import { BcvEngine } from '../bcv-engine';

export class FinancialCore {
  /**
   * Calcula el IGTF (3%) aplicable EXCLUSIVAMENTE a pagos realizados en efectivo divisa (USD)
   */
  public static calculateIgtf(amountUSD: number, paymentMethod: 'PAGO_MOVIL' | 'BINANCE_USDT' | 'CASH_USD' | 'TRANSFER_VES'): number {
    if (paymentMethod === 'CASH_USD') {
      return Number((amountUSD * 0.03).toFixed(2));
    }
    return 0.00;
  }

  /**
   * Calcula el desglose completo de costos iniciales
   */
  public static calculateInitialCosts(params: {
    vehiclePriceUSD: number;
    downPaymentPercent: number;
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
    annualInterestRatePercent: number;
    totalQuotas: number;
    frequency: PaymentFrequency;
    method?: AmortizationMethod;
    startDate?: string;
    includeIvaPercent?: number;
  }): PaymentScheduleItem[] {
    const method = params.method || 'FLAT';
    const ivaPercent = params.includeIvaPercent ?? 16;
    const schedule: PaymentScheduleItem[] = [];
    
    const daysInterval = params.frequency === 'MONTHLY' ? 30 : params.frequency === 'BIWEEKLY' ? 15 : params.frequency === 'WEEKLY' ? 7 : 1;
    const baseDate = params.startDate ? new Date(params.startDate) : new Date();

    if (method === 'FLAT') {
      const totalInterest = (params.financedAmountUSD * (params.annualInterestRatePercent / 100) * (params.totalQuotas / 12));
      const capitalPerQuota = Number((params.financedAmountUSD / params.totalQuotas).toFixed(2));
      const interestPerQuota = Number((totalInterest / params.totalQuotas).toFixed(2));
      const ivaPerQuota = Number(((interestPerQuota * (ivaPercent / 100))).toFixed(2));
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
          igtfUSD: 0,
          totalQuotaUSD,
          paidAmountUSD: 0,
          remainingAmountUSD: totalQuotaUSD,
          status: 'PENDING',
          whatsappSent: false
        });
      }
    } else {
      const periodicRate = (params.annualInterestRatePercent / 100) / (12 / (daysInterval / 30));
      const annuity = Number((
        (params.financedAmountUSD * periodicRate) / 
        (1 - Math.pow(1 + periodicRate, -params.totalQuotas))
      ).toFixed(2));

      let currentBalance = params.financedAmountUSD;
      for (let i = 1; i <= params.totalQuotas; i++) {
        const interest = Number((currentBalance * periodicRate).toFixed(2));
        const capital = Number((annuity - interest).toFixed(2));
        const iva = Number((interest * (ivaPercent / 100)).toFixed(2));
        const total = Number((capital + interest + iva).toFixed(2));
        currentBalance = Math.max(0, currentBalance - capital);

        const dueDate = new Date(baseDate);
        dueDate.setDate(dueDate.getDate() + (i * daysInterval));

        schedule.push({
          quotaNumber: i,
          dueDate: dueDate.toISOString().split('T')[0],
          capitalUSD: capital,
          interestUSD: interest,
          ivaUSD: iva,
          igtfUSD: 0,
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
   * Procesa un abono (Total o Parcial) a una cuota específica del plan con cálculo de IGTF e IVA
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
    igtfAppliedUSD: number;
  } {
    const updatedSchedule = [...params.schedule];
    const itemIndex = updatedSchedule.findIndex(q => q.quotaNumber === params.quotaNumber);
    if (itemIndex === -1) {
      throw new Error(`Cuota #${params.quotaNumber} no encontrada en el cronograma.`);
    }

    const item = { ...updatedSchedule[itemIndex] };
    const bcvRate = params.bcvRate || BcvEngine.getCurrentRate().usdRate;
    const paidAmountVES = BcvEngine.convertUsdToVes(params.amountPaidUSD, bcvRate);
    const igtfAppliedUSD = this.calculateIgtf(params.amountPaidUSD, params.paymentMethod);

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
    item.igtfUSD = (item.igtfUSD || 0) + igtfAppliedUSD;
    item.status = isQuotaCompleted ? 'PAID' : 'PARTIALLY_PAID';
    item.paidDate = new Date().toISOString();
    item.receiptNumber = receiptCode;
    item.receiptType = receiptType;
    item.bcvRateAtPayment = bcvRate;
    item.paidAmountVES = paidAmountVES;
    item.paymentMethod = params.paymentMethod;
    item.paymentReference = params.paymentReference;

    updatedSchedule[itemIndex] = item;

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
      paymentReference: params.paymentReference,
      igtfUSD: igtfAppliedUSD
    });

    return {
      updatedSchedule,
      processedItem: item,
      receiptType,
      receiptCode,
      whatsappMessage,
      isQuotaCompleted,
      igtfAppliedUSD
    };
  }

  /**
   * Calcula el Porcentaje del Progreso Final en General del Cliente (0% a 100%)
   */
  public static calculateOverallProgressPercent(contract: Partial<LoanContract>): number {
    const paidCount = contract.schedule?.filter(q => q.status === 'PAID').length || 0;
    const totalCount = contract.schedule?.length || 1;
    const paymentScore = (paidCount / totalCount) * 50;

    let deliveryScore = 0;
    if (contract.deliveryStatus === 'ENTREGADO') deliveryScore = 20;
    else if (contract.deliveryStatus === 'LISTO_PARA_ENTREGA') deliveryScore = 18;
    else if (contract.deliveryStatus === 'POR_VISITAR') deliveryScore = 15;
    else if (contract.deliveryStatus === 'ACUMULANDO_CUOTAS') deliveryScore = 10;
    else if (contract.deliveryStatus === 'PENDIENTE_INICIAL') deliveryScore = 2;

    let docScore = 0;
    if (contract.documentsStatus === 'EXPEDIENTE_COMPLETO') docScore = 15;
    else if (contract.documentsStatus === 'EN_REVISION') docScore = 8;
    else if (contract.documentsStatus === 'PENDIENTE_RECEPCION') docScore = 2;

    let regScore = 0;
    if (contract.vehicleRegistrationStatus === 'TITULO_ENTREGADO') regScore = 15;
    else if (contract.vehicleRegistrationStatus === 'PLACAS_ASIGNADAS') regScore = 10;
    else if (contract.vehicleRegistrationStatus === 'TRAMITE_INTT_EN_CURSO') regScore = 5;
    else if (contract.vehicleRegistrationStatus === 'NO_INICIADO') regScore = 0;

    return Number(Math.min(100, Math.max(0, paymentScore + deliveryScore + docScore + regScore)).toFixed(1));
  }

  /**
   * Recalcula y consolida todos los campos contables y estados operativos de un contrato
   */
  public static recalculateContractSummary(contract: LoanContract, currentCatalogPriceUSD?: number): LoanContract {
    const schedule = contract.schedule || [];
    const paidQuotas = schedule.filter(q => q.status === 'PAID');
    const pendingQuotas = schedule.filter(q => q.status === 'PENDING' || q.status === 'PARTIALLY_PAID' || q.status === 'OVERDUE');
    const overdueQuotas = schedule.filter(q => q.status === 'OVERDUE');

    const quotasPaidCount = paidQuotas.length;
    const quotasPendingCount = pendingQuotas.length;
    const totalQuotasCount = schedule.length || 1;
    const quotasPaidPercent = Number(((quotasPaidCount / totalQuotasCount) * 100).toFixed(1));

    const quotasPaidAmountUSD = Number(schedule.reduce((acc, q) => acc + (q.paidAmountUSD || 0), 0).toFixed(2));
    const quotasPendingAmountUSD = Number(schedule.reduce((acc, q) => acc + (q.remainingAmountUSD || 0), 0).toFixed(2));

    const overdueMonthsCount = overdueQuotas.length;
    const lateFeesPendingUSD = overdueMonthsCount * 5.00;
    const lateFeesPaidUSD = contract.lateFeesPaidUSD || 0;

    const ivaPendingUSD = Number(pendingQuotas.reduce((acc, q) => acc + (q.ivaUSD || 0), 0).toFixed(2));
    const ivaPaidUSD = Number(paidQuotas.reduce((acc, q) => acc + (q.ivaUSD || 0), 0).toFixed(2));
    const igtfPaidUSD = Number(schedule.reduce((acc, q) => acc + (q.igtfUSD || 0), 0).toFixed(2));
    const igtfPendingUSD = contract.igtfPendingUSD || 0;

    // Reglas Operativas Especiales:
    let deliveryStatus = contract.deliveryStatus;
    let status: ContractStatus = contract.status;
    let isExpiredPermanently = contract.isExpiredPermanently || false;

    // 1. REGLA EXPIRADO: Sin moto y > 3 meses impagos -> Suspendido permanente sin retiro
    if (deliveryStatus !== 'ENTREGADO' && deliveryStatus !== 'POR_RECUPERAR' && overdueMonthsCount >= 3) {
      status = 'EXPIRADO';
      isExpiredPermanently = true;
    }
    // 2. REGLA POR RECUPERAR: Con moto entregada y >= 2 meses impagos
    else if ((deliveryStatus === 'ENTREGADO' || deliveryStatus === 'POR_RECUPERAR') && overdueMonthsCount >= 2) {
      deliveryStatus = 'POR_RECUPERAR';
      status = 'POR_RECUPERAR';
    }
    // 3. REGLA POR VISITAR: Sin moto, pagó las cuotas requeridas (ej. 3) y no está expirado
    else if (deliveryStatus !== 'ENTREGADO' && !isExpiredPermanently && quotasPaidCount >= (contract.deliveryMilestone?.requiredQuotasToDeliver || 3)) {
      deliveryStatus = 'POR_VISITAR';
      status = 'POR_VISITAR';
    }
    // 4. REGLA MOROSO
    else if (overdueMonthsCount > 0 && status !== 'EXPIRADO' && status !== 'POR_RECUPERAR') {
      status = 'IN_DEFAULT';
    }

    // 5. REGLA POR REEMBOLSAR: 30% retenido por funcionamiento, 70% devuelto
    let refundDetails = contract.refundDetails;
    if (contract.refundStatus === 'POR_REEMBOLSAR' || contract.refundStatus === 'APROBADO') {
      const totalPaid = contract.totalPaidUSD || quotasPaidAmountUSD;
      refundDetails = {
        totalPaidUSD: totalPaid,
        companyRetention30PercentUSD: Number((totalPaid * 0.30).toFixed(2)),
        clientRefund70PercentUSD: Number((totalPaid * 0.70).toFixed(2)),
        approvedByManagement: true,
        reason: contract.refundDetails?.reason || "Justificación médica y laboral aprobada por gerencia general."
      };
    }

    // Regla de Precio Concesionario Congelado tras Entrega
    const isDelivered = deliveryStatus === 'ENTREGADO' || deliveryStatus === 'POR_RECUPERAR';
    let concessionairePriceUSD = contract.concessionairePriceUSD;
    if (isDelivered) {
      concessionairePriceUSD = contract.vehicle?.dealerPriceOriginalUSD || contract.concessionairePriceUSD || 950;
    } else if (currentCatalogPriceUSD) {
      concessionairePriceUSD = currentCatalogPriceUSD;
    }

    const overallProgressPercent = this.calculateOverallProgressPercent({
      ...contract,
      deliveryStatus,
      documentsStatus: contract.documentsStatus,
      vehicleRegistrationStatus: contract.vehicleRegistrationStatus,
      schedule
    });

    return {
      ...contract,
      concessionairePriceUSD,
      isDealerPriceFrozen: isDelivered,
      companyPriceUSD: contract.vehicle?.retailPriceUSD || contract.companyPriceUSD || 1400,
      lateFeesPendingUSD,
      lateFeesPaidUSD,
      overdueMonthsCount,
      ivaPendingUSD,
      ivaPaidUSD,
      igtfPendingUSD,
      igtfPaidUSD,
      quotasPendingCount,
      quotasPendingAmountUSD,
      quotasPaidCount,
      quotasPaidAmountUSD,
      quotasPaidPercent,
      deliveryStatus,
      refundStatus: contract.refundStatus,
      refundDetails,
      isExpiredPermanently,
      status,
      overallProgressPercent
    };
  }

  public static composeWhatsAppReceiptMessage(params: {
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
    igtfUSD?: number;
  }): string {
    const isFull = params.receiptType === 'FULL_QUOTA_OFFICIAL';
    const headerTitle = isFull 
      ? `✅ *RECIBO OFICIAL DE PAGO DE CUOTA*` 
      : `📄 *COMPROBANTE DE ABONO PARCIAL*`;

    return `${headerTitle}
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏛️ *AutoLending OS Finanzas*
🆔 *Comprobante:* \`${params.receiptCode}\`
👤 *Cliente:* ${params.clientName}
📋 *Contrato:* #${params.contractNumber}
🔢 *Cuota Abonada:* #${params.quotaNumber} de ${params.totalQuotas}

💵 *Monto Abonado:* $${params.amountPaidUSD.toFixed(2)} USD
🇻🇪 *Equivalente VES:* ${BcvEngine.formatVes(params.amountPaidVES)}
📊 *Tasa BCV Oficial:* Bs. ${params.bcvRate.toFixed(2)} / USD
${params.igtfUSD ? `🏷️ *IGTF 3% Divisas:* $${params.igtfUSD.toFixed(2)} USD\n` : ''}💳 *Método:* ${params.paymentMethod}
🔖 *Referencia:* \`${params.paymentReference}\`
━━━━━━━━━━━━━━━━━━━━━━━━━━
${params.remainingAmountUSD > 0 
  ? `⚠️ *Saldo Restante en esta cuota:* $${params.remainingAmountUSD.toFixed(2)} USD` 
  : `🎉 *Cuota #${params.quotaNumber} SALDADA TOTALMENTE*`}

Consulte su estado de cuenta en línea en el Portal del Cliente.`;
  }
}