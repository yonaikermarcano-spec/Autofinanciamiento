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
  dealerPriceUSD: number;       // Precio de compra al concesionario / ensambladora
  dealerPriceOriginalUSD?: number; // Precio original con el que se compró el vehículo
  isDealerPriceFrozen: boolean; // Si el vehículo ya fue entregado se congela el precio
  retailPriceUSD: number;       // PRECIO EMPRESA (Precio de venta financiado al cliente)
  isPriceLocked: boolean;
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
  igtfUSD?: number;                // IGTF 3% aplicable solo en pagos en efectivo USD
  lateFeeUSD?: number;             // Mora aplicable por retraso
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

export type DeliveryStatus = 
  | 'PENDIENTE_INICIAL'
  | 'ACUMULANDO_CUOTAS'
  | 'POR_VISITAR'           // Sin moto que alcanzó monto y tiempo -> Visita presencial a domicilio y fiadores
  | 'LISTO_PARA_ENTREGA'
  | 'ENTREGADO'             // Moto/Carro entregado efectivamente
  | 'POR_RECUPERAR'         // Con moto entregada y más de 2 meses sin pagar -> Recuperación de vehículo en campo
  | 'RETENIDO_MORA';

export type RefundStatus = 
  | 'SIN_REEMBOLSO'
  | 'POR_REEMBOLSAR'        // Justificación aprobada: retención del 30% por funcionamiento, devolución del 70%
  | 'SOLICITADO'
  | 'EN_AUDITORIA'
  | 'APROBADO'
  | 'REEMBOLSADO';

export type DocumentsStatus = 
  | 'PENDIENTE_RECEPCION'
  | 'EN_REVISION'
  | 'EXPEDIENTE_COMPLETO';

export type PhysicalInvoiceStatus = 
  | 'PENDIENTE_EMISION'
  | 'EMITIDA_EN_BOVEDA'
  | 'ENTREGADA_AL_CLIENTE';

export type VehicleRegistrationStatus = 
  | 'NO_INICIADO'
  | 'TRAMITE_INTT_EN_CURSO'
  | 'PLACAS_ASIGNADAS'
  | 'TITULO_ENTREGADO';

export type ContractStatus = 
  | 'QUOTATION' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'ACTIVE' 
  | 'MOROSO' 
  | 'POR_RECUPERAR' 
  | 'POR_VISITAR' 
  | 'EXPIRADO'              // Sin moto y más de 3 meses sin pagar -> Suspendido permanente sin derecho a retiro
  | 'POR_REEMBOLSAR' 
  | 'RESTRUCTURED' 
  | 'SETTLED'
  | 'IN_DEFAULT';

export interface GuarantorInfo {
  name: string;        // Nombre y Apellido del Fiador
  docId: string;       // CI del Fiador
  phone: string;       // Teléfono del Fiador
  address?: string;    // Dirección domiciliaria
  relationship?: string; // Parentesco
}

export interface LoanContract {
  id: string;
  tenantId: string;
  contractNumber: string;          // N° CONTRATO
  clientId: string;
  clientName: string;              // NOMBRE Y APELLIDO
  clientDocId: string;             // CI / Cédula
  clientPhone: string;             // TELEFONO
  clientAddress: string;
  guarantor: GuarantorInfo;        // DATOS DE LOS FIADORES (NOMBRE Y APELLIDO, CI, TELEFONO)
  
  // Vehículo y Precios
  vehicle: VehicleSpec;            // MARCA Y MODELO DEL VEHÍCULO
  concessionairePriceUSD: number;  // PRECIO CONCESIONARIO (Actualizable o Congelado si ENTREGADO)
  isDealerPriceFrozen: boolean;    // Bandera de congelamiento tras entrega
  companyPriceUSD: number;         // PRECIO EMPRESA (Precio de venta financiado al cliente)
  
  // Moras
  lateFeesPendingUSD: number;      // MORA X COBRAR
  lateFeesPaidUSD: number;         // MORAS PAGADAS
  overdueMonthsCount?: number;     // Meses de mora acumulados (1, 2, 3+)
  
  // Impuestos (IVA 16% e IGTF 3%)
  ivaPendingUSD: number;           // IVA 16% X PAGAR
  ivaPaidUSD: number;              // IVA 16% PAGADO
  igtfPendingUSD: number;          // IGTF X PAGAR (Aplica solo al pagar en divisas USD)
  igtfPaidUSD: number;             // IGTF PAGADO
  
  // Cuotas y Progreso
  quotasPendingCount: number;      // CUOTAS X COBRAR (Cantidad)
  quotasPendingAmountUSD: number;  // CUOTAS X COBRAR ($ Monto)
  quotasPaidCount: number;         // CUOTAS PAGADAS (Cantidad)
  quotasPaidAmountUSD: number;     // CUOTAS PAGADAS ($ Monto)
  quotasPaidPercent: number;       // % CUOTAS PAGADAS
  
  // Estatus Operativos Detallados
  deliveryStatus: DeliveryStatus;                       // ENTREGADO (EN QUÉ ESTATUS ESTÁ)
  refundStatus: RefundStatus;                           // REEMBOLSO (EN QUÉ ESTATUS ESTÁ)
  refundDetails?: {
    totalPaidUSD: number;
    companyRetention30PercentUSD: number; // 30% retenido por funcionamiento
    clientRefund70PercentUSD: number;     // 70% devuelto al cliente
    approvedByManagement: boolean;
    reason: string;
  };
  isExpiredPermanently?: boolean;                       // EXPIRADO: sin moto y > 3 meses impago (pierde el dinero)
  documentsStatus: DocumentsStatus;                     // DOCUMENTOS (EN QUÉ ESTATUS ESTÁ)
  physicalInvoiceStatus: PhysicalInvoiceStatus;         // FACTURA FISICA (EN QUÉ ESTATUS ESTÁ)
  vehicleRegistrationStatus: VehicleRegistrationStatus; // REGISTRO DE VEHICULO (EN QUÉ ESTATUS ESTÁ)
  
  // Progreso General
  overallProgressPercent: number;  // PORCENTAJE DEL PROGRESO FINAL EN GENERAL DEL CLIENTE

  // Datos financieros base
  initialCosts: InitialCostBreakdown;
  financedAmountUSD: number;
  interestRateAnnual: number;
  frequency: PaymentFrequency;
  totalQuotas: number;
  deliveryMilestone: {
    type: DeliveryMilestoneType;
    requiredQuotasToDeliver?: number;
    isDelivered: boolean;
    deliveredDate?: string;
  };
  schedule: PaymentScheduleItem[];
  totalPaidUSD: number;
  totalOutstandingUSD: number;
  status: ContractStatus;
  creationDate: string;
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
  disclaimerSigned: boolean;
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
  expirationDate: string;
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
  expiresAt: string;
  isExpired: boolean;
  sha256Seal: string;
  acceptedByClient: boolean;
  acceptedAt?: string;
}