"use client";

import { LoanContract } from '../../types';
import { LocalDB } from '../local-db';
import { BcvEngine } from '../bcv-engine';

export type BankProvider = 'BANCO_DE_VENEZUELA' | 'BANESCO' | 'MERCANTIL' | 'BANCAMIGA' | 'PROVINCIAL';

export type PushNotificationStatus = 'MATCHED_AUTO' | 'UNMATCHED_AVAILABLE' | 'UNDER_HUMAN_REVIEW' | 'APPROVED_MANUAL';

export interface BankPushNotification {
  id: string;
  provider: BankProvider;
  rawText: string;
  referenceNumber: string;
  amountVES: number;
  senderNameOrPhone?: string;
  receivedAt: string;
  status: PushNotificationStatus;
  matchedContractNumber?: string;
  matchedClientName?: string;
}

export interface ClientPaymentAttempt {
  id: string;
  contractNumber: string;
  clientDocId: string;
  clientName: string;
  originBank: string;
  senderPhone: string;
  referenceNumber: string;
  reportedAmountVES: number;
  expectedAmountUSD: number;
  quotaNumber: number;
  submittedAt: string;
  status: 'VALIDATED_INSTANT' | 'PENDING_HUMAN_REVIEW' | 'APPROVED_MANUAL' | 'REJECTED';
  reviewReason?: string;
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  sha256Receipt?: string;
}

export interface CompanyBankPaymentInfo {
  provider: BankProvider;
  bankName: string;
  bankCode: string;
  phone: string;
  rif: string;
  beneficiaryName: string;
  isPrimary: boolean;
}

export class BankPushEngine {
  public static readonly COMPANY_PAYMENT_ACCOUNTS: CompanyBankPaymentInfo[] = [
    {
      provider: "BANCO_DE_VENEZUELA",
      bankName: "Banco de Venezuela (BDV)",
      bankCode: "0102",
      phone: "0414-3329011",
      rif: "J-50192841-0",
      beneficiaryName: "AutoLending Inversiones C.A.",
      isPrimary: true
    },
    {
      provider: "BANESCO",
      bankName: "Banesco Banco Universal",
      bankCode: "0134",
      phone: "0414-3329011",
      rif: "J-50192841-0",
      beneficiaryName: "AutoLending Inversiones C.A.",
      isPrimary: false
    },
    {
      provider: "MERCANTIL",
      bankName: "Mercantil Banco Universal",
      bankCode: "0105",
      phone: "0414-3329011",
      rif: "J-50192841-0",
      beneficiaryName: "AutoLending Inversiones C.A.",
      isPrimary: false
    }
  ];

  private static pushNotifications: BankPushNotification[] = [
    {
      id: "PUSH-BDV-001",
      provider: "BANCO_DE_VENEZUELA",
      rawText: "BDV: Ha recibido un Pago Movil de JOSE CASTILLO por Bs. 2.342,50. Ref: 0049281. 25/08/2026 08:30",
      referenceNumber: "0049281",
      amountVES: 2342.50,
      senderNameOrPhone: "JOSE CASTILLO",
      receivedAt: "2026-08-25 08:30:12",
      status: "MATCHED_AUTO",
      matchedContractNumber: "CTR-2026-001",
      matchedClientName: "José Gregorio Castillo"
    },
    {
      id: "PUSH-BANESCO-002",
      provider: "BANESCO",
      rawText: "Banesco PagoMovil: Recibio Bs. 1.874,00 de 04128894401. Ref: 849201 25/08/2026 08:45",
      referenceNumber: "849201",
      amountVES: 1874.00,
      senderNameOrPhone: "04128894401",
      receivedAt: "2026-08-25 08:45:00",
      status: "UNMATCHED_AVAILABLE"
    }
  ];

  private static paymentAttempts: ClientPaymentAttempt[] = [
    {
      id: "PAY-2026-001",
      contractNumber: "CTR-2026-001",
      clientDocId: "V-18492019",
      clientName: "José Gregorio Castillo",
      originBank: "Banco de Venezuela",
      senderPhone: "0414-3329011",
      referenceNumber: "0049281",
      reportedAmountVES: 2342.50,
      expectedAmountUSD: 50.00,
      quotaNumber: 1,
      submittedAt: "2026-08-25 08:31:00",
      status: "VALIDATED_INSTANT",
      sha256Receipt: "SHA256:5041594D4F56494C5F4354523030315F56414C494441544544"
    }
  ];

  public static getAllPushNotifications(): BankPushNotification[] {
    return [...this.pushNotifications];
  }

  public static getAllPaymentAttempts(): ClientPaymentAttempt[] {
    return [...this.paymentAttempts];
  }

  /**
   * Parsea el texto en lenguaje natural de una notificación push o SMS bancario
   */
  public static parseRawPushNotification(rawText: string): BankPushNotification {
    const text = rawText.trim();
    let provider: BankProvider = "BANCO_DE_VENEZUELA";

    if (/banesco/i.test(text)) provider = "BANESCO";
    else if (/mercantil|tpago/i.test(text)) provider = "MERCANTIL";
    else if (/bancamiga/i.test(text)) provider = "BANCAMIGA";
    else if (/provincial|bbva/i.test(text)) provider = "PROVINCIAL";

    // Extraer monto
    const amountMatch = text.match(/Bs.?s*([0-9.,]+)/i);
    let amountVES = 0;
    if (amountMatch && amountMatch[1]) {
      const cleanMonto = amountMatch[1].replace(/./g, '').replace(',', '.');
      amountVES = parseFloat(cleanMonto) || 0;
    }

    // Extraer referencia
    const refMatch = text.match(/Ref:?s*([0-9A-Za-z]+)/i) || text.match(/Referencia:?s*([0-9A-Za-z]+)/i);
    const referenceNumber = refMatch && refMatch[1] ? refMatch[1].trim() : Math.floor(100000 + Math.random() * 900000).toString();

    // Extraer remitente
    const senderMatch = text.match(/des+([A-Za-z0-9s]+?)(?:s+por|s+Ref|.|$)/i);
    const senderNameOrPhone = senderMatch && senderMatch[1] ? senderMatch[1].trim() : undefined;

    const newPush: BankPushNotification = {
      id: "PUSH-" + Date.now().toString().slice(-6),
      provider,
      rawText,
      referenceNumber,
      amountVES,
      senderNameOrPhone,
      receivedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: "UNMATCHED_AVAILABLE"
    };

    this.pushNotifications.unshift(newPush);
    return newPush;
  }

  /**
   * Procesa el intento de pago del cliente desde su móvil (Estilo Cashea)
   */
  public static submitClientPayment(params: {
    contract: LoanContract;
    originBank: string;
    senderPhone: string;
    referenceNumber: string;
    reportedAmountVES: number;
    quotaNumber: number;
    expectedAmountUSD: number;
  }): { success: boolean; isInstantValidated: boolean; message: string; attempt: ClientPaymentAttempt } {
    const { contract, originBank, senderPhone, referenceNumber, reportedAmountVES, quotaNumber, expectedAmountUSD } = params;

    const cleanInputRef = referenceNumber.trim().replace(/^0+/, ''); // Normalizar ceros a la izquierda

    // Buscar si ya llegó la notificación push del banco con esa referencia
    const matchingPush = this.pushNotifications.find(p => {
      const cleanPushRef = p.referenceNumber.trim().replace(/^0+/, '');
      return cleanPushRef === cleanInputRef || cleanPushRef.endsWith(cleanInputRef) || cleanInputRef.endsWith(cleanPushRef);
    });

    const isMatch = !!matchingPush;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (isMatch && matchingPush) {
      // 🟢 VALIDACIÓN INSTANTÁNEA AL ESTILO CASHEA
      matchingPush.status = "MATCHED_AUTO";
      matchingPush.matchedContractNumber = contract.contractNumber;
      matchingPush.matchedClientName = contract.clientName;

      const rawReceipt = contract.contractNumber + "|" + referenceNumber + "|" + reportedAmountVES + "|" + timestamp;
      const sha256Receipt = "SHA256:" + Buffer.from(rawReceipt).toString('hex').slice(0, 32).toUpperCase();

      const attempt: ClientPaymentAttempt = {
        id: "PAY-" + Date.now().toString().slice(-6),
        contractNumber: contract.contractNumber,
        clientDocId: contract.clientDocId,
        clientName: contract.clientName,
        originBank,
        senderPhone,
        referenceNumber,
        reportedAmountVES,
        expectedAmountUSD,
        quotaNumber,
        submittedAt: timestamp,
        status: "VALIDATED_INSTANT",
        sha256Receipt
      };

      this.paymentAttempts.unshift(attempt);

      return {
        success: true,
        isInstantValidated: true,
        message: "¡Pago Móvil Verificado al Instante! Tu cuota #" + quotaNumber + " ha sido procesada con éxito.",
        attempt
      };
    } else {
      // 🟡 EN CASO DE DESFASE O ERROR: PASA A SOLICITUD DE REVISIÓN HUMANA
      const attempt: ClientPaymentAttempt = {
        id: "REV-" + Date.now().toString().slice(-6),
        contractNumber: contract.contractNumber,
        clientDocId: contract.clientDocId,
        clientName: contract.clientName,
        originBank,
        senderPhone,
        referenceNumber,
        reportedAmountVES,
        expectedAmountUSD,
        quotaNumber,
        submittedAt: timestamp,
        status: "PENDING_HUMAN_REVIEW",
        reviewReason: "Notificación push aún no recibida del banco o referencia en proceso de confirmación."
      };

      this.paymentAttempts.unshift(attempt);

      return {
        success: false,
        isInstantValidated: false,
        message: "Tu pago ha sido registrado y enviado a Revisión Manual por nuestro equipo de caja. Te notificaremos en cuanto sea verificado.",
        attempt
      };
    }
  }

  /**
   * Aprueba manualmente un pago en revisión humana
   */
  public static approveHumanReview(attemptId: string, reviewerName: string, notes: string = "Verificado en cuenta bancaria"): ClientPaymentAttempt {
    const attempt = this.paymentAttempts.find(a => a.id === attemptId);
    if (!attempt) {
      throw new Error("Solicitud de revisión no encontrada.");
    }

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const rawReceipt = attempt.contractNumber + "|" + attempt.referenceNumber + "|" + attempt.reportedAmountVES + "|" + timestamp;
    const sha256Receipt = "SHA256:" + Buffer.from(rawReceipt).toString('hex').slice(0, 32).toUpperCase();

    attempt.status = "APPROVED_MANUAL";
    attempt.reviewedBy = reviewerName;
    attempt.reviewedAt = timestamp;
    attempt.reviewerNotes = notes;
    attempt.sha256Receipt = sha256Receipt;

    return attempt;
  }
}
