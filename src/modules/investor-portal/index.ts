"use client";

export interface InvestorProfile {
  id: string;
  companyOrName: string;
  docIdOrRif: string;
  totalCapitalInvestedUSD: number;
  activeFinancedUnitsCount: number;
  totalActivePortfolioUSD: number;
  annualizedRoiPercent: number; // Ej: 28% APY
  monthlyDividendsPaidUSD: number;
  pendingDividendsThisMonthUSD: number;
  allocatedVehicles: {
    vin: string;
    model: string;
    contractNumber: string;
    clientName: string;
    monthlyQuotaUSD: number;
    healthStatus: 'AL_DIA' | 'EN_MORA_LEVE';
  }[];
}

export class InvestorPortalEngine {
  private static investors: InvestorProfile[] = [
    {
      id: "INV-001",
      companyOrName: "Inversiones Capital Caracas C.A.",
      docIdOrRif: "J-50192844-0",
      totalCapitalInvestedUSD: 25000.00,
      activeFinancedUnitsCount: 20,
      totalActivePortfolioUSD: 24200.00,
      annualizedRoiPercent: 28.5,
      monthlyDividendsPaidUSD: 580.00,
      pendingDividendsThisMonthUSD: 620.00,
      allocatedVehicles: [
        {
          vin: "9BFBR150XTA00291",
          model: "Bera SBR 150cc",
          contractNumber: "CTR-2026-001",
          clientName: "José Gregorio Castillo",
          monthlyQuotaUSD: 140.00,
          healthStatus: "AL_DIA"
        },
        {
          vin: "8EK150XPA001928",
          model: "Empire Keeway EK Express",
          contractNumber: "CTR-2026-002",
          clientName: "Carlos Eduardo Pérez",
          monthlyQuotaUSD: 155.00,
          healthStatus: "AL_DIA"
        }
      ]
    },
    {
      id: "INV-002",
      companyOrName: "Grupo Financiero Oriental",
      docIdOrRif: "J-40918234-9",
      totalCapitalInvestedUSD: 15000.00,
      activeFinancedUnitsCount: 12,
      totalActivePortfolioUSD: 14100.00,
      annualizedRoiPercent: 26.0,
      monthlyDividendsPaidUSD: 325.00,
      pendingDividendsThisMonthUSD: 360.00,
      allocatedVehicles: [
        {
          vin: "9MT150LEON00381",
          model: "Motos Toro León 150cc",
          contractNumber: "CTR-2026-003",
          clientName: "Marcos Antonio Díaz",
          monthlyQuotaUSD: 160.00,
          healthStatus: "EN_MORA_LEVE"
        }
      ]
    }
  ];

  public static getAllInvestors(): InvestorProfile[] {
    return [...this.investors];
  }

  public static getInvestorById(id: string): InvestorProfile | undefined {
    return this.investors.find(inv => inv.id === id);
  }
}
