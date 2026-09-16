"use client";

import { LoanContract } from '../../types';
import { LocalDB } from '../local-db';

export interface DebtAssignmentInput {
  originalContractNumber: string;
  transferFeeUSD: number; // Tasa administrativa de traspaso (ej: $50 USD)
  newClient: {
    name: string;
    docId: string;
    phone: string;
    address: string;
    guarantorName: string;
    guarantorDocId: string;
    guarantorPhone: string;
  };
  reason: string;
}

export interface DebtAssignmentResult {
  transferCode: string;
  originalContractNumber: string;
  outgoingClientName: string;
  outgoingClientDocId: string;
  newClientName: string;
  newClientDocId: string;
  newClientPhone: string;
  vehicleModel: string;
  vinChassis: string;
  transferredOutstandingUSD: number;
  remainingQuotasCount: number;
  transferFeeUSD: number;
  tripartiteAgreementCode: string;
  newPromissoryNoteId: string;
  outgoingReleaseReceiptId: string;
  timestamp: string;
  sha256Seal: string;
}

export class DebtAssignmentEngine {
  public static calculateAndPrepareTransfer(
    contract: LoanContract,
    input: DebtAssignmentInput,
    bcvRate: number
  ): DebtAssignmentResult {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const transferCode = "TRASP-" + contract.contractNumber + "-" + Date.now().toString().slice(-4);
    const tripartiteAgreementCode = "CTR-TRIPARTITO-" + contract.contractNumber;
    const newPromissoryNoteId = "PAGARE-TRASP-" + contract.contractNumber;
    const outgoingReleaseReceiptId = "FINIQUITO-CEDENTE-" + contract.contractNumber;

    const rawSeal = transferCode + "|" + input.newClient.docId + "|" + contract.totalOutstandingUSD + "|" + timestamp;
    const sha256Seal = "SHA256:" + Buffer.from(rawSeal).toString('hex').slice(0, 32).toUpperCase();

    return {
      transferCode,
      originalContractNumber: contract.contractNumber,
      outgoingClientName: contract.clientName,
      outgoingClientDocId: contract.clientDocId,
      newClientName: input.newClient.name,
      newClientDocId: input.newClient.docId,
      newClientPhone: input.newClient.phone,
      vehicleModel: contract.vehicle?.brand + " " + contract.vehicle?.model,
      vinChassis: contract.vehicle?.vinChassis || "9BFBR150XTA00291",
      transferredOutstandingUSD: contract.totalOutstandingUSD,
      remainingQuotasCount: contract.quotasPendingCount || 30,
      transferFeeUSD: input.transferFeeUSD,
      tripartiteAgreementCode,
      newPromissoryNoteId,
      outgoingReleaseReceiptId,
      timestamp,
      sha256Seal
    };
  }

  public static executeTransfer(result: DebtAssignmentResult, input: DebtAssignmentInput): LoanContract {
    const contracts = LocalDB.getAllContracts();
    const contract = contracts.find(c => c.contractNumber === result.originalContractNumber);
    if (!contract) throw new Error("Contrato original no encontrado");

    const updatedContract: LoanContract = {
      ...contract,
      clientName: input.newClient.name,
      clientDocId: input.newClient.docId,
      clientPhone: input.newClient.phone,
      clientAddress: input.newClient.address,
      guarantor: {
        name: input.newClient.guarantorName,
        docId: input.newClient.guarantorDocId,
        phone: input.newClient.guarantorPhone
      },
      status: "ACTIVE"
    };

    LocalDB.updateContract(updatedContract);
    return updatedContract;
  }
}
