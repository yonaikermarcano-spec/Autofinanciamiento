"use client";

import { LoanContract, PaymentScheduleItem } from '../../types';
import { LocalDB } from '../local-db';

export interface RestructuringProposalInput {
  contractNumber: string;
  reason: 'CONTINGENCIA_MEDICA' | 'ACCIDENTE_TRANSITO' | 'REDUCCION_INGRESOS' | 'ACUERDO_EXTRAJUDICIAL';
  customNotes: string;
  waiveLateFees: boolean; // Condonar 100% de moras
  newTermWeeks: number; // Nuevo plazo en semanas (ej: 24 semanas)
  interestRateAnnual: number;
}

export interface RestructuringResult {
  contractNumber: string;
  clientName: string;
  clientDocId: string;
  previousOutstandingUSD: number;
  waivedLateFeesUSD: number;
  newRestructuredDebtUSD: number;
  newWeeklyQuotaUSD: number;
  newTotalQuotas: number;
  newSchedule: PaymentScheduleItem[];
  addendumCode: string;
  newPromissoryNoteId: string;
  generatedAt: string;
  sha256Seal: string;
}

export class LoanRestructuringEngine {
  public static calculateProposal(
    contract: LoanContract,
    input: RestructuringProposalInput,
    bcvRate: number
  ): RestructuringResult {
    const waivedLateFeesUSD = input.waiveLateFees ? (contract.lateFeesPendingUSD || 0) : 0;
    const baseCapitalToRestructure = contract.totalOutstandingUSD;
    
    // Interés mensual aplicado al plazo nuevo
    const monthlyRate = (input.interestRateAnnual / 100) / 12;
    const termMonths = input.newTermWeeks / 4;
    const totalInterestUSD = Number((baseCapitalToRestructure * monthlyRate * termMonths).toFixed(2));
    
    const newRestructuredDebtUSD = Number((baseCapitalToRestructure + totalInterestUSD).toFixed(2));
    const newWeeklyQuotaUSD = Number((newRestructuredDebtUSD / input.newTermWeeks).toFixed(2));

    const newSchedule: PaymentScheduleItem[] = [];
    const today = new Date();

    for (let i = 1; i <= input.newTermWeeks; i++) {
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + (i * 7));
      const dueDateStr = dueDate.toISOString().slice(0, 10);

      newSchedule.push({
        quotaNumber: i,
        dueDate: dueDateStr,
        capitalUSD: Number((baseCapitalToRestructure / input.newTermWeeks).toFixed(2)),
        interestUSD: Number((totalInterestUSD / input.newTermWeeks).toFixed(2)),
        ivaUSD: 0,
        totalQuotaUSD: newWeeklyQuotaUSD,
        paidAmountUSD: 0,
        remainingAmountUSD: newWeeklyQuotaUSD,
        status: "PENDING",
        whatsappSent: false
      });
    }

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const addendumCode = "ADDENDUM-" + contract.contractNumber + "-REST-" + Date.now().toString().slice(-4);
    const newPromissoryNoteId = "PAGARE-REST-" + contract.contractNumber + "-" + Date.now().toString().slice(-4);

    const rawSeal = addendumCode + "|" + newRestructuredDebtUSD + "|" + newWeeklyQuotaUSD + "|" + timestamp;
    const sha256Seal = "SHA256:" + Buffer.from(rawSeal).toString('hex').slice(0, 32).toUpperCase();

    return {
      contractNumber: contract.contractNumber,
      clientName: contract.clientName,
      clientDocId: contract.clientDocId,
      previousOutstandingUSD: contract.totalOutstandingUSD,
      waivedLateFeesUSD,
      newRestructuredDebtUSD,
      newWeeklyQuotaUSD,
      newTotalQuotas: input.newTermWeeks,
      newSchedule,
      addendumCode,
      newPromissoryNoteId,
      generatedAt: timestamp,
      sha256Seal
    };
  }

  public static applyRestructuring(result: RestructuringResult): LoanContract {
    const contracts = LocalDB.getAllContracts();
    const contract = contracts.find(c => c.contractNumber === result.contractNumber);
    if (!contract) throw new Error("Contrato no encontrado");

    const updatedContract: LoanContract = {
      ...contract,
      status: "RESTRUCTURED",
      totalOutstandingUSD: result.newRestructuredDebtUSD,
      totalPaidUSD: contract.totalPaidUSD,
      lateFeesPendingUSD: 0,
      totalQuotas: result.newTotalQuotas,
      schedule: result.newSchedule,
      quotasPaidCount: 0,
      quotasPendingCount: result.newTotalQuotas,
      quotasPaidPercent: 0
    };

    LocalDB.updateContract(updatedContract);
    return updatedContract;
  }
}
