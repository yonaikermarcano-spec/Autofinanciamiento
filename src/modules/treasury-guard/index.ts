import { TreasuryVaultMetrics, RotativePoolStatus } from '../../types';

export class TreasuryGuard {
  /**
   * Calcula las métricas de salud de tesorería y alerta de descapitalización
   */
  public static evaluateTreasuryHealth(params: {
    totalCashUSD: number;
    totalCashVESInUSD: number;
    totalBankVESInUSD: number;
    totalBinanceUSDT: number;
    committedDownPaymentsUSD: number; // Iniciales de vehículos aún no comprados/entregados
    monthlyFixedCostsUSD: number;     // Costos operativos del mes (nómina, alquiler, etc.)
    currentMonthCollectedUSD: number; // Cobranza real acumulada en el mes
  }): TreasuryVaultMetrics {
    const totalLiquidAssetsUSD = Number((
      params.totalCashUSD + 
      params.totalCashVESInUSD + 
      params.totalBankVESInUSD + 
      params.totalBinanceUSDT
    ).toFixed(2));

    // Capital libre = Activos líquidos totales MENOS iniciales comprometidas para compras de activos
    const freeOperatingCapitalUSD = Number((totalLiquidAssetsUSD - params.committedDownPaymentsUSD).toFixed(2));

    // Ingreso mínimo mensual requerido para no quebrar = Costos fijos
    const minimumMonthlyCollectionRequiredUSD = params.monthlyFixedCostsUSD;

    const breakEvenProgressPercent = minimumMonthlyCollectionRequiredUSD > 0
      ? Number(((params.currentMonthCollectedUSD / minimumMonthlyCollectionRequiredUSD) * 100).toFixed(1))
      : 100;

    // Runway en meses = Capital libre / Costo fijo mensual
    const runwayMonths = params.monthlyFixedCostsUSD > 0
      ? Number((freeOperatingCapitalUSD / params.monthlyFixedCostsUSD).toFixed(1))
      : 99;

    let liquidityAlert: 'HEALTHY' | 'MODERATE_RISK' | 'CRITICAL_INSOLVENCY_RISK' = 'HEALTHY';
    if (freeOperatingCapitalUSD < 0 || runwayMonths < 1.0) {
      liquidityAlert = 'CRITICAL_INSOLVENCY_RISK';
    } else if (runwayMonths < 2.5) {
      liquidityAlert = 'MODERATE_RISK';
    }

    return {
      totalCashUSD: params.totalCashUSD,
      totalCashVES: params.totalCashVESInUSD,
      totalBankVES: params.totalBankVESInUSD,
      totalBinanceUSDT: params.totalBinanceUSDT,
      committedDownPaymentsUSD: params.committedDownPaymentsUSD,
      freeOperatingCapitalUSD,
      monthlyFixedCostsUSD: params.monthlyFixedCostsUSD,
      minimumMonthlyCollectionRequiredUSD,
      currentMonthCollectedUSD: params.currentMonthCollectedUSD,
      breakEvenProgressPercent,
      runwayMonths,
      liquidityAlert
    };
  }

  /**
   * Simula la capacidad de compra en un Fondo Rotativo (Autofinanciamiento)
   */
  public static simulateRotativePool(params: {
    totalPoolCashUSD: number;
    queuedAdjudicationsCount: number;
    unitCostUSD: number;
    averageDailyCollectionsUSD: number;
  }): RotativePoolStatus {
    const purchasableUnitsNow = Math.floor(params.totalPoolCashUSD / params.unitCostUSD);
    const deficitUnits = Math.max(0, params.queuedAdjudicationsCount - purchasableUnitsNow);
    
    const neededCashForDeficit = deficitUnits * params.unitCostUSD;
    const estimatedDaysToNextPurchase = params.averageDailyCollectionsUSD > 0
      ? Math.ceil((params.unitCostUSD - (params.totalPoolCashUSD % params.unitCostUSD)) / params.averageDailyCollectionsUSD)
      : 999;

    const isBottleneckDetected = deficitUnits > 0;

    return {
      totalPoolCashUSD: params.totalPoolCashUSD,
      totalQueuedAdjudications: params.queuedAdjudicationsCount,
      costPerUnitUSD: params.unitCostUSD,
      purchasableUnitsNow,
      estimatedDaysToNextPurchase,
      isBottleneckDetected
    };
  }
}