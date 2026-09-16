export interface TenantBusinessProfile {
  tenantId: string;
  legalName: string;
  commercialName: string;
  rif: string;
  address: string;
  phone: string;
  logoUrl?: string;
  
  // Políticas de Financiamiento
  deliveryPolicy: "IMMEDIATE" | "ACCUMULATED_QUOTAS" | "ROTATIVE_POOL";
  requiredQuotasForDelivery: number; // ej. 3
  minimumDownPaymentPercent: number; // ej. 30
  defaultAnnualInterestRate: number; // ej. 18
  defaultAdminFeeUSD: number;        // ej. 50
  defaultGpsFeeUSD: number;          // ej. 120
  defaultInttFeeUSD: number;         // ej. 80
  defaultRcvFeeUSD: number;          // ej. 35

  // Políticas de Cobranza & Mora
  gracePeriodDays: number;           // ej. 3 días
  dailySurchargePercent: number;     // ej. 0.5% diario
  daysUntilGpsImmobilization: number;// ej. 15 días
  daysUntilRepossessionOrder: number;// ej. 30 días
  
  // Ajustes de Precios Pre-Entrega
  allowPriceAdjustmentsPreDelivery: boolean;
  
  // Canales de Cobro Habilitados
  acceptPagoMovil: boolean;
  acceptBinanceUSDT: boolean;
  acceptCashUSD: boolean;
  
  configuredAt: string;
}

export class TenantOnboardingEngine {
  private static defaultProfile: TenantBusinessProfile = {
    tenantId: "tenant-autolending",
    legalName: "Inversiones AutoLending C.A.",
    commercialName: "AutoLending Venezuela",
    rif: "J-50192840-2",
    address: "Av. Francisco de Miranda, Torre Cavendes, Piso 6, Chacao, Caracas",
    phone: "+58 412-5558921",
    deliveryPolicy: "ACCUMULATED_QUOTAS",
    requiredQuotasForDelivery: 3,
    minimumDownPaymentPercent: 30,
    defaultAnnualInterestRate: 18,
    defaultAdminFeeUSD: 50,
    defaultGpsFeeUSD: 120,
    defaultInttFeeUSD: 80,
    defaultRcvFeeUSD: 35,
    gracePeriodDays: 3,
    dailySurchargePercent: 0.5,
    daysUntilGpsImmobilization: 15,
    daysUntilRepossessionOrder: 30,
    allowPriceAdjustmentsPreDelivery: true,
    acceptPagoMovil: true,
    acceptBinanceUSDT: true,
    acceptCashUSD: true,
    configuredAt: new Date().toISOString()
  };

  public static getProfile(): TenantBusinessProfile {
    return { ...this.defaultProfile };
  }

  public static updateProfile(updates: Partial<TenantBusinessProfile>): TenantBusinessProfile {
    this.defaultProfile = {
      ...this.defaultProfile,
      ...updates,
      configuredAt: new Date().toISOString()
    };
    return { ...this.defaultProfile };
  }
}