"use client";

import { LoanContract } from '../../types';
import { BcvEngine } from '../bcv-engine';

export type StaffRole = 'ASESOR_VENTAS' | 'COBRADOR_CAMPO';

export interface CommissionRule {
  id: string;
  role: StaffRole;
  ruleName: string;
  type: 'FIXED_PER_CONTRACT' | 'PERCENTAGE_ON_COLLECTION' | 'TIER_BONUS';
  fixedAmountUSD?: number;
  percentageRate?: number;
  thresholdTarget?: number;
  bonusAmountUSD?: number;
}

export interface StaffCommissionSummary {
  staffId: string;
  name: string;
  docId: string;
  phone: string;
  role: StaffRole;
  monthlyTargetUnits: number;
  contractsClosedCount: number;
  totalCollectedInFieldUSD: number;
  baseCommissionsUSD: number;
  targetBonusUSD: number;
  totalCommissionToPayUSD: number;
  totalCommissionToPayVES: number;
  isSettled: boolean;
  settledAt?: string;
  paymentMethod?: string;
  paymentReference?: string;
  receiptSha256?: string;
}

export class CommissionsEngine {
  private static rules: CommissionRule[] = [
    {
      id: "RULE-SALES-01",
      role: "ASESOR_VENTAS",
      ruleName: "Comisión Fija por Moto Colocada",
      type: "FIXED_PER_CONTRACT",
      fixedAmountUSD: 25.00
    },
    {
      id: "RULE-SALES-BONUS",
      role: "ASESOR_VENTAS",
      ruleName: "Bono Mensual por Meta de Ventas",
      type: "TIER_BONUS",
      thresholdTarget: 10,
      bonusAmountUSD: 100.00
    },
    {
      id: "RULE-FIELD-01",
      role: "COBRADOR_CAMPO",
      ruleName: "Comisión por Recuperación en Calle",
      type: "PERCENTAGE_ON_COLLECTION",
      percentageRate: 8.0
    },
    {
      id: "RULE-FIELD-BONUS",
      role: "COBRADOR_CAMPO",
      ruleName: "Bono por Eficiencia de Ruta en Calle",
      type: "TIER_BONUS",
      thresholdTarget: 2000,
      bonusAmountUSD: 50.00
    }
  ];

  private static staffSummaries: StaffCommissionSummary[] = [
    {
      staffId: "STF-001",
      name: "Andrés Velásquez",
      docId: "V-21948201",
      phone: "0414-5592019",
      role: "ASESOR_VENTAS",
      monthlyTargetUnits: 10,
      contractsClosedCount: 12,
      totalCollectedInFieldUSD: 0,
      baseCommissionsUSD: 300.00,
      targetBonusUSD: 100.00,
      totalCommissionToPayUSD: 400.00,
      totalCommissionToPayVES: 18740.00,
      isSettled: false
    },
    {
      staffId: "STF-002",
      name: "Mariana Silva",
      docId: "V-23910284",
      phone: "0412-3301928",
      role: "ASESOR_VENTAS",
      monthlyTargetUnits: 10,
      contractsClosedCount: 7,
      totalCollectedInFieldUSD: 0,
      baseCommissionsUSD: 175.00,
      targetBonusUSD: 0,
      totalCommissionToPayUSD: 175.00,
      totalCommissionToPayVES: 8198.75,
      isSettled: false
    },
    {
      staffId: "STF-003",
      name: "Héctor Rodríguez",
      docId: "V-19482019",
      phone: "0416-8819203",
      role: "COBRADOR_CAMPO",
      monthlyTargetUnits: 0,
      contractsClosedCount: 0,
      totalCollectedInFieldUSD: 2450.00,
      baseCommissionsUSD: 196.00,
      targetBonusUSD: 50.00,
      totalCommissionToPayUSD: 246.00,
      totalCommissionToPayVES: 11525.10,
      isSettled: false
    }
  ];

  public static getAllRules(): CommissionRule[] {
    return [...this.rules];
  }

  public static updateRule(updatedRule: CommissionRule, bcvRate?: number): CommissionRule[] {
    const activeBcvRate = bcvRate || BcvEngine.getCurrentRate().usdRate;
    const idx = this.rules.findIndex(r => r.id === updatedRule.id);
    if (idx !== -1) {
      this.rules[idx] = { ...updatedRule };
    } else {
      this.rules.push(updatedRule);
    }

    // Recalcular automáticamente todas las nóminas del personal
    this.recalculateAllStaff(activeBcvRate);
    return [...this.rules];
  }

  public static recalculateAllStaff(bcvRate?: number): StaffCommissionSummary[] {
    const activeBcvRate = bcvRate || BcvEngine.getCurrentRate().usdRate;
    const salesFixedRule = this.rules.find(r => r.role === "ASESOR_VENTAS" && r.type === "FIXED_PER_CONTRACT");
    const salesBonusRule = this.rules.find(r => r.role === "ASESOR_VENTAS" && r.type === "TIER_BONUS");
    const fieldPctRule = this.rules.find(r => r.role === "COBRADOR_CAMPO" && r.type === "PERCENTAGE_ON_COLLECTION");
    const fieldBonusRule = this.rules.find(r => r.role === "COBRADOR_CAMPO" && r.type === "TIER_BONUS");

    const fixedPerContract = salesFixedRule?.fixedAmountUSD ?? 25.00;
    const salesTargetThreshold = salesBonusRule?.thresholdTarget ?? 10;
    const salesBonusAmount = salesBonusRule?.bonusAmountUSD ?? 100.00;

    const fieldPercentage = (fieldPctRule?.percentageRate ?? 8.0) / 100;
    const fieldTargetThreshold = fieldBonusRule?.thresholdTarget ?? 2000;
    const fieldBonusAmount = fieldBonusRule?.bonusAmountUSD ?? 50.00;

    this.staffSummaries.forEach(staff => {
      if (staff.isSettled) return; // Mantener histórico si ya fue pagado

      if (staff.role === "ASESOR_VENTAS") {
        staff.baseCommissionsUSD = Number((staff.contractsClosedCount * fixedPerContract).toFixed(2));
        staff.targetBonusUSD = staff.contractsClosedCount >= salesTargetThreshold ? salesBonusAmount : 0;
      } else {
        staff.baseCommissionsUSD = Number((staff.totalCollectedInFieldUSD * fieldPercentage).toFixed(2));
        staff.targetBonusUSD = staff.totalCollectedInFieldUSD >= fieldTargetThreshold ? fieldBonusAmount : 0;
      }

      staff.totalCommissionToPayUSD = Number((staff.baseCommissionsUSD + staff.targetBonusUSD).toFixed(2));
      staff.totalCommissionToPayVES = Number((staff.totalCommissionToPayUSD * activeBcvRate).toFixed(2));
    });

    return [...this.staffSummaries];
  }

  public static getAllStaffSummaries(): StaffCommissionSummary[] {
    return [...this.staffSummaries];
  }

  public static settleCommission(
    staffId: string,
    paymentMethod: string,
    paymentReference: string
  ): StaffCommissionSummary {
    const staff = this.staffSummaries.find(s => s.staffId === staffId);
    if (!staff) {
      throw new Error("Colaborador no encontrado.");
    }

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const rawReceipt = staffId + "|" + staff.totalCommissionToPayUSD + "|" + paymentReference + "|" + timestamp;
    const receiptSha256 = "SHA256:" + Buffer.from(rawReceipt).toString('hex').slice(0, 32).toUpperCase();

    staff.isSettled = true;
    staff.settledAt = timestamp;
    staff.paymentMethod = paymentMethod;
    staff.paymentReference = paymentReference;
    staff.receiptSha256 = receiptSha256;

    return staff;
  }
}
