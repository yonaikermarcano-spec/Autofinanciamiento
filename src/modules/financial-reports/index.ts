"use client";

import { LoanContract } from '../../types';
import { BcvEngine } from '../bcv-engine';
import { TenantOnboardingEngine } from '../tenant-onboarding';

export interface SeniatSalesEntry {
  invoiceNumber: string;
  controlNumber: string;
  date: string;
  clientName: string;
  clientDocId: string;
  contractNumber: string;
  baseImponibleUSD: number;
  baseImponibleVES: number;
  iva16PercentUSD: number;
  iva16PercentVES: number;
  paymentMethod: 'PAGO_MOVIL' | 'BINANCE_USDT' | 'CASH_USD';
  igtf3PercentUSD: number;
  igtf3PercentVES: number;
  totalInvoiceUSD: number;
  totalInvoiceVES: number;
  bcvRateApplied: number;
}

export interface MonthlyCashFlowProjection {
  monthName: string;
  expectedLoanCollectionsUSD: number;
  expectedDownPaymentsUSD: number;
  totalInflowUSD: number;
  inventoryPurchasesUSD: number;
  fixedOperatingCostsUSD: number;
  totalOutflowUSD: number;
  netCashFlowUSD: number;
  cumulativeCashUSD: number;
}

export interface BalanceSheetData {
  currentAssets: {
    cashUSD: number;
    cashVESinUSD: number;
    bankVESinUSD: number;
    binanceUSDT: number;
    loanPortfolioActiveUSD: number;
    loanPortfolioOverdueUSD: number;
    totalCurrentAssetsUSD: number;
  };
  nonCurrentAssets: {
    vehicleInventoryUSD: number;
    gpsEquipmentUSD: number;
    totalNonCurrentAssetsUSD: number;
  };
  totalAssetsUSD: number;
  liabilities: {
    committedDownPaymentsVaultUSD: number;
    concessionairePayablesUSD: number;
    seniatTaxesPayableUSD: number;
    totalLiabilitiesUSD: number;
  };
  equity: {
    capitalStockUSD: number;
    retainedEarningsUSD: number;
    currentPeriodIncomeUSD: number;
    totalEquityUSD: number;
  };
}

export class FinancialReportsEngine {
  /**
   * Genera el Libro de Ventas Fiscal mensual para el SENIAT con desglose de IVA (16%) e IGTF (3%)
   */
  public static generateSeniatSalesBook(contracts: LoanContract[], bcvRate: number): SeniatSalesEntry[] {
    const entries: SeniatSalesEntry[] = [];
    let invoiceSeq = 1001;

    contracts.forEach(contract => {
      const paidQuotas = (contract.schedule || []).filter(q => q.status === "PAID");
      
      paidQuotas.forEach(quota => {
        const quotaTotalUSD = quota.paidAmountUSD || quota.totalQuotaUSD;
        const baseUSD = quota.capitalUSD + quota.interestUSD;
        const ivaUSD = quota.ivaUSD || Number((baseUSD * 0.16).toFixed(2));
        const method = (quota.paymentMethod as any) || "PAGO_MOVIL";
        
        // IGTF 3% solo aplica si se pagó en divisa en efectivo
        const igtfUSD = method === "CASH_USD" ? Number((quotaTotalUSD * 0.03).toFixed(2)) : 0.00;
        const totalUSD = quotaTotalUSD + igtfUSD;

        const baseVES = BcvEngine.convertUsdToVes(baseUSD, bcvRate);
        const ivaVES = BcvEngine.convertUsdToVes(ivaUSD, bcvRate);
        const igtfVES = BcvEngine.convertUsdToVes(igtfUSD, bcvRate);
        const totalVES = BcvEngine.convertUsdToVes(totalUSD, bcvRate);

        entries.push({
          invoiceNumber: "FACT-" + invoiceSeq,
          controlNumber: "00-" + (invoiceSeq * 3).toString().padStart(6, '0'),
          date: quota.paidDate || quota.dueDate,
          clientName: contract.clientName,
          clientDocId: contract.clientDocId,
          contractNumber: contract.contractNumber,
          baseImponibleUSD: baseUSD,
          baseImponibleVES: baseVES,
          iva16PercentUSD: ivaUSD,
          iva16PercentVES: ivaVES,
          paymentMethod: method,
          igtf3PercentUSD: igtfUSD,
          igtf3PercentVES: igtfVES,
          totalInvoiceUSD: totalUSD,
          totalInvoiceVES: totalVES,
          bcvRateApplied: bcvRate
        });

        invoiceSeq++;
      });
    });

    return entries;
  }

  /**
   * Proyecta el Flujo de Caja a 12 Meses
   */
  public static generate12MonthsCashFlow(contracts: LoanContract[], startingLiquidityUSD: number = 28000): MonthlyCashFlowProjection[] {
    const months = [
      "Septiembre 2026", "Octubre 2026", "Noviembre 2026", "Diciembre 2026",
      "Enero 2027", "Febrero 2027", "Marzo 2027", "Abril 2027",
      "Mayo 2027", "Junio 2027", "Julio 2027", "Agosto 2027"
    ];

    const activeContractsCount = contracts.filter(c => c.status === "ACTIVE").length || 8;
    const baseMonthlyCollection = activeContractsCount * 110.00;

    let cumulative = startingLiquidityUSD;
    const projections: MonthlyCashFlowProjection[] = [];

    months.forEach((month, idx) => {
      // Crecimiento proyectado del 5% mensual por colocación de nuevas unidades
      const growthFactor = 1 + (idx * 0.05);
      const expectedLoanCollectionsUSD = Number((baseMonthlyCollection * growthFactor).toFixed(2));
      const expectedDownPaymentsUSD = Number(((idx % 2 === 0 ? 1200 : 1800) * growthFactor).toFixed(2));
      const totalInflowUSD = Number((expectedLoanCollectionsUSD + expectedDownPaymentsUSD).toFixed(2));

      const inventoryPurchasesUSD = Number(((idx % 2 === 0 ? 2200 : 1400) * growthFactor).toFixed(2));
      const fixedOperatingCostsUSD = 2400.00;
      const totalOutflowUSD = Number((inventoryPurchasesUSD + fixedOperatingCostsUSD).toFixed(2));

      const netCashFlowUSD = Number((totalInflowUSD - totalOutflowUSD).toFixed(2));
      cumulative = Number((cumulative + netCashFlowUSD).toFixed(2));

      projections.push({
        monthName: month,
        expectedLoanCollectionsUSD,
        expectedDownPaymentsUSD,
        totalInflowUSD,
        inventoryPurchasesUSD,
        fixedOperatingCostsUSD,
        totalOutflowUSD,
        netCashFlowUSD,
        cumulativeCashUSD: cumulative
      });
    });

    return projections;
  }

  /**
   * Genera el Balance General consolidado
   */
  public static generateBalanceSheet(contracts: LoanContract[]): BalanceSheetData {
    const activePortfolio = Number(contracts.filter(c => (c.overdueMonthsCount || 0) < 2).reduce((sum, c) => sum + c.totalOutstandingUSD, 0).toFixed(2));
    const overduePortfolio = Number(contracts.filter(c => (c.overdueMonthsCount || 0) >= 2).reduce((sum, c) => sum + c.totalOutstandingUSD, 0).toFixed(2));

    const cashUSD = 14500;
    const cashVESinUSD = 3200;
    const bankVESinUSD = 4800;
    const binanceUSDT = 5500;
    const totalCurrentAssetsUSD = Number((cashUSD + cashVESinUSD + bankVESinUSD + binanceUSDT + activePortfolio + overduePortfolio).toFixed(2));

    const vehicleInventoryUSD = 18400;
    const gpsEquipmentUSD = 2400;
    const totalNonCurrentAssetsUSD = Number((vehicleInventoryUSD + gpsEquipmentUSD).toFixed(2));
    const totalAssetsUSD = Number((totalCurrentAssetsUSD + totalNonCurrentAssetsUSD).toFixed(2));

    const committedDownPaymentsVaultUSD = 18000;
    const concessionairePayablesUSD = 6500;
    const seniatTaxesPayableUSD = 1420;
    const totalLiabilitiesUSD = Number((committedDownPaymentsVaultUSD + concessionairePayablesUSD + seniatTaxesPayableUSD).toFixed(2));

    const capitalStockUSD = 35000;
    const retainedEarningsUSD = 12000;
    const currentPeriodIncomeUSD = Number((totalAssetsUSD - totalLiabilitiesUSD - capitalStockUSD - retainedEarningsUSD).toFixed(2));
    const totalEquityUSD = Number((capitalStockUSD + retainedEarningsUSD + currentPeriodIncomeUSD).toFixed(2));

    return {
      currentAssets: {
        cashUSD,
        cashVESinUSD,
        bankVESinUSD,
        binanceUSDT,
        loanPortfolioActiveUSD: activePortfolio,
        loanPortfolioOverdueUSD: overduePortfolio,
        totalCurrentAssetsUSD
      },
      nonCurrentAssets: {
        vehicleInventoryUSD,
        gpsEquipmentUSD,
        totalNonCurrentAssetsUSD
      },
      totalAssetsUSD,
      liabilities: {
        committedDownPaymentsVaultUSD,
        concessionairePayablesUSD,
        seniatTaxesPayableUSD,
        totalLiabilitiesUSD
      },
      equity: {
        capitalStockUSD,
        retainedEarningsUSD,
        currentPeriodIncomeUSD,
        totalEquityUSD
      }
    };
  }

  /**
   * Exporta datos a CSV
   */
    public static exportToCSV(data: any[], filename: string): void {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(';');
    const rows = data.map(obj => Object.values(obj).map(v => typeof v === 'string' ? '"' + v.replace(/"/g, '""') + '"' : v).join(';')).join('\n');
    const csvContent = "\uFEFF" + headers + "\n" + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
