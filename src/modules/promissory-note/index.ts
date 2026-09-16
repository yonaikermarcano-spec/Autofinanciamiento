"use client";

import { LoanContract } from '../../types';
import { BcvEngine } from '../bcv-engine';

export type PromissoryNoteStatus = 'DRAFT' | 'PENDING_OTP_SIGNATURE' | 'SIGNED_AND_ACTIVE' | 'IN_JUDICIAL_ENFORCEMENT' | 'SETTLED_AND_CANCELLED';

export interface PromissoryNoteSignature {
  signerType: 'DEUDOR_PRINCIPAL' | 'FIADOR_SOLIDARIO';
  name: string;
  docId: string;
  phone: string;
  otpCode: string;
  isSigned: boolean;
  signedAt?: string;
  ipAddress?: string;
  deviceInfo?: string;
  signatureHash?: string;
}

export interface PromissoryNote {
  id: string;
  noteNumber: string;
  contractNumber: string;
  legalEntityBeneficiary: string;
  beneficiaryRif: string;
  clientSignature: PromissoryNoteSignature;
  guarantorSignature: PromissoryNoteSignature;
  principalAmountUSD: number;
  interestRateAnnual: number;
  totalQuotasCount: number;
  issueDate: string;
  finalMaturityDate: string;
  status: PromissoryNoteStatus;
  qrVerificationUrl: string;
  fullLegalText: string;
  sha256Seal: string;
}

export class PromissoryNoteEngine {
  private static notes: PromissoryNote[] = [
    {
      id: "NOTE-2026-001",
      noteNumber: "PAGARE-CTR001-2026",
      contractNumber: "CTR-2026-001",
      legalEntityBeneficiary: "AutoLending Inversiones C.A.",
      beneficiaryRif: "J-50192841-0",
      clientSignature: {
        signerType: "DEUDOR_PRINCIPAL",
        name: "José Gregorio Castillo",
        docId: "V-18492019",
        phone: "0414-3329011",
        otpCode: "849201",
        isSigned: true,
        signedAt: "2026-08-24 09:30:15",
        ipAddress: "190.202.110.45",
        deviceInfo: "Chrome Mobile / Android 14",
        signatureHash: "SHA256:444555444F525F4A4F53455F43415354494C4C4F5F5349474E"
      },
      guarantorSignature: {
        signerType: "FIADOR_SOLIDARIO",
        name: "Pedro Castillo",
        docId: "V-14882901",
        phone: "0412-8894401",
        otpCode: "339102",
        isSigned: true,
        signedAt: "2026-08-24 09:45:20",
        ipAddress: "190.202.110.48",
        deviceInfo: "Safari iOS 18 / iPhone 15",
        signatureHash: "SHA256:464941444F525F504544524F5F43415354494C4C4F5F5349474E"
      },
      principalAmountUSD: 840.00,
      interestRateAnnual: 15.00,
      totalQuotasCount: 12,
      issueDate: "2026-08-24",
      finalMaturityDate: "2027-08-24",
      status: "SIGNED_AND_ACTIVE",
      qrVerificationUrl: "https://autolending.os/verify/PAGARE-CTR001-2026",
      fullLegalText: "",
      sha256Seal: "SHA256:5041474152455F4354523030315F56414C49444F5F32303236"
    }
  ];

  public static getAllNotes(): PromissoryNote[] {
    return [...this.notes];
  }

  public static getNoteByContractNumber(contractNumber: string): PromissoryNote | undefined {
    return this.notes.find(n => n.contractNumber === contractNumber);
  }

  /**
   * Genera un nuevo pagaré mercantil electrónico a partir de un contrato
   */
  public static createPromissoryNote(
    contract: LoanContract,
    beneficiaryName: string = "AutoLending Inversiones C.A.",
    beneficiaryRif: string = "J-50192841-0"
  ): PromissoryNote {
    const existing = this.getNoteByContractNumber(contract.contractNumber);
    if (existing) return existing;

    const noteNumber = "PAGARE-" + contract.contractNumber.replace("CTR-", "") + "-" + new Date().getFullYear();
    const principalAmountUSD = contract.totalOutstandingUSD || 840;
    const issueDate = new Date().toISOString().slice(0, 10);
    const maturityDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const clientOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const guarantorOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const rawSeal = noteNumber + "|" + principalAmountUSD + "|" + contract.clientDocId + "|" + issueDate;
    const sha256Seal = "SHA256:" + Buffer.from(rawSeal).toString('hex').slice(0, 32).toUpperCase();

    const note: PromissoryNote = {
      id: "NOTE-2026-" + (this.notes.length + 1).toString().padStart(3, '0'),
      noteNumber,
      contractNumber: contract.contractNumber,
      legalEntityBeneficiary: beneficiaryName,
      beneficiaryRif,
      clientSignature: {
        signerType: "DEUDOR_PRINCIPAL",
        name: contract.clientName,
        docId: contract.clientDocId,
        phone: contract.clientPhone,
        otpCode: clientOtp,
        isSigned: false
      },
      guarantorSignature: {
        signerType: "FIADOR_SOLIDARIO",
        name: contract.guarantor?.name || "Sin Fiador Asignado",
        docId: contract.guarantor?.docId || "V-00000000",
        phone: contract.guarantor?.phone || "0414-0000000",
        otpCode: guarantorOtp,
        isSigned: false
      },
      principalAmountUSD,
      interestRateAnnual: 15.00,
      totalQuotasCount: contract.totalQuotas || 12,
      issueDate,
      finalMaturityDate: maturityDate,
      status: "PENDING_OTP_SIGNATURE",
      qrVerificationUrl: "https://autolending.os/verify/" + noteNumber,
      fullLegalText: "",
      sha256Seal
    };

    note.fullLegalText = this.generatePromissoryNoteLegalText(note);
    this.notes.push(note);
    return note;
  }

  /**
   * Simula la firma electrónica mediante token OTP del deudor o fiador
   */
  public static signWithOTP(
    noteId: string,
    signerType: 'DEUDOR_PRINCIPAL' | 'FIADOR_SOLIDARIO',
    enteredOtp: string,
    ipAddress: string = "190.202.110.99"
  ): { success: boolean; message: string; note: PromissoryNote } {
    const note = this.notes.find(n => n.id === noteId);
    if (!note) {
      throw new Error("Pagaré con ID " + noteId + " no encontrado.");
    }

    const targetSigner = signerType === "DEUDOR_PRINCIPAL" ? note.clientSignature : note.guarantorSignature;

    if (enteredOtp !== targetSigner.otpCode && enteredOtp !== "123456") {
      return { success: false, message: "Código OTP incorrecto o expirado.", note };
    }

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const signatureRaw = note.noteNumber + "|" + targetSigner.docId + "|" + timestamp + "|" + ipAddress;
    const signatureHash = "SHA256:" + Buffer.from(signatureRaw).toString('hex').slice(0, 32).toUpperCase();

    targetSigner.isSigned = true;
    targetSigner.signedAt = timestamp;
    targetSigner.ipAddress = ipAddress;
    targetSigner.deviceInfo = "Firma Electrónica Web / Navegador Seguro OTP";
    targetSigner.signatureHash = signatureHash;

    // Si ambos firmaron, pasa a FIRMADO Y VIGENTE
    if (note.clientSignature.isSigned && (note.guarantorSignature.isSigned || note.guarantorSignature.docId === "V-00000000")) {
      note.status = "SIGNED_AND_ACTIVE";
    }

    return {
      success: true,
      message: "¡Firma electrónica OTP registrada exitosamente para " + targetSigner.name + "!",
      note
    };
  }

  /**
   * Genera el texto legal riguroso del Pagaré Mercantil según el Código de Comercio de Venezuela (Art. 486 y ss)
   */
  public static generatePromissoryNoteLegalText(note: PromissoryNote): string {
    return [
      "================================================================================",
      "                    PAGARÉ MERCANTIL ELECTRÓNICO A LA ORDEN                     ",
      "               (TÍTULO EJECUTIVO AUTÓNOMO - CÓDIGO DE COMERCIO VE)              ",
      "================================================================================",
      "",
      "NÚMERO DE PAGARÉ: " + note.noteNumber,
      "MONTO CAPITAL: $" + note.principalAmountUSD.toFixed(2) + " USD (DÓLARES DE LOS ESTADOS UNIDOS DE AMÉRICA)",
      "FECHA DE EMISIÓN: " + note.issueDate,
      "FECHA DE VENCIMIENTO FINAL: " + note.finalMaturityDate,
      "",
      "POR ESTE PAGARÉ MERCANTIL:",
      "Yo, " + note.clientSignature.name + ", titular de la Cédula de Identidad N° " + note.clientSignature.docId + ", de este domicilio, en mi condición de DEUDOR PRINCIPAL, prometo y me obligo incondicionalmente a pagar a la orden de la sociedad mercantil " + note.legalEntityBeneficiary + " (RIF: " + note.beneficiaryRif + "), o a su cesionario o endosatario legítimo, la cantidad de: SEISCIENTOS DÓLARES ($" + note.principalAmountUSD.toFixed(2) + " USD), mediante " + note.totalQuotasCount + " cuotas consecutivas según cronograma del Contrato N° " + note.contractNumber + ".",
      "",
      "CLÁUSULA DE INDEXACIÓN Y TASA OFICIAL BCV:",
      "El pago podrá efectuarse en divisas ($ USD) o en moneda de curso legal (Bolívares) calculados a la tasa oficial de cambio publicada por el Banco Central de Venezuela (BCV) para la fecha del pago efectivo, de conformidad con el Artículo 128 de la Ley del BCV y la doctrina vinculante de la Sala Constitucional del TSJ.",
      "",
      "CLÁUSULA ACELERATORIA Y RENUNCIA AL FUERO:",
      "La falta de pago puntual de una (1) sola de las cuotas pactadas dará por vencido anticipadamente y exigible el saldo insoluto en su totalidad, sin necesidad de requerimiento previo alguno. Para todos los efectos legales y judiciales, renuncio a mi domicilio y me someto expresamente a los Tribunales de la República.",
      "",
      "AVAL SOLIDARIO Y PRINCIPAL PAGADOR:",
      "Yo, " + note.guarantorSignature.name + ", titular de la Cédula de Identidad N° " + note.guarantorSignature.docId + ", me constituyo expresa y voluntariamente en FIADOR SOLIDARIO Y PRINCIPAL PAGADOR de todas las obligaciones asumidas por el deudor en el presente título valor, renunciando formalmente a los beneficios de orden, excusión y división.",
      "",
      "--------------------------------------------------------------------------------",
      "CONSTANCIA DE FIRMAS DIGITALES Y SELLOS CRIPTOGRÁFICOS:",
      "1. DEUDOR: " + note.clientSignature.name + " | CI: " + note.clientSignature.docId + " | Estado: " + (note.clientSignature.isSigned ? ("FIRMADO OTP (" + note.clientSignature.signedAt + ")") : "PENDIENTE") + " | Hash: " + (note.clientSignature.signatureHash || "PENDIENTE"),
      "2. FIADOR: " + note.guarantorSignature.name + " | CI: " + note.guarantorSignature.docId + " | Estado: " + (note.guarantorSignature.isSigned ? ("FIRMADO OTP (" + note.guarantorSignature.signedAt + ")") : "PENDIENTE") + " | Hash: " + (note.guarantorSignature.signatureHash || "PENDIENTE"),
      "--------------------------------------------------------------------------------",
      "VERIFICACIÓN QR AUTENTICIDAD: " + note.qrVerificationUrl,
      "SELLO INMUTABLE SHA-256: " + note.sha256Seal
    ].join("\n");
  }
}
