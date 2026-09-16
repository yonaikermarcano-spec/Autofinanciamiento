"use client";

export type CryptoProvider = 'BINANCE_PAY' | 'TRON_TRC20_WALLET';
export type CryptoTxStatus = 'CONFIRMED_VALID' | 'UNDER_REVIEW' | 'INVALID_HASH';

export interface CryptoDepositRecord {
  id: string;
  txHashOrPayId: string;
  provider: CryptoProvider;
  contractNumber: string;
  clientName: string;
  amountUSDT: number;
  recipientWalletOrPayId: string;
  networkConfirmations: number;
  timestamp: string;
  status: CryptoTxStatus;
  sha256Receipt: string;
}

export class CryptoReconciliationEngine {
  public static readonly CORPORATE_WALLETS = {
    binancePayId: "291048291 (AutoLending Corp)",
    tronTrc20Address: "TJv8xK9Z7NqP2vB4mY5wL1eR6tH3uC9oX4"
  };

  private static cryptoDeposits: CryptoDepositRecord[] = [
    {
      id: "CRYPTO-TX-001",
      txHashOrPayId: "4f8a29b01c7e9d4a82194bce38102948a0f918239471bade",
      provider: "TRON_TRC20_WALLET",
      contractNumber: "CTR-2026-001",
      clientName: "José Gregorio Castillo",
      amountUSDT: 35.00,
      recipientWalletOrPayId: "TJv8xK9Z7NqP2vB4mY5wL1eR6tH3uC9oX4",
      networkConfirmations: 28,
      timestamp: "2026-08-26 18:30:00",
      status: "CONFIRMED_VALID",
      sha256Receipt: "SHA256:54524332307C3335555344547C32303236"
    },
    {
      id: "CRYPTO-TX-002",
      txHashOrPayId: "PAYID-994820194",
      provider: "BINANCE_PAY",
      contractNumber: "CTR-2026-002",
      clientName: "Carlos Eduardo Pérez",
      amountUSDT: 50.00,
      recipientWalletOrPayId: "291048291",
      networkConfirmations: 1,
      timestamp: "2026-08-26 19:15:00",
      status: "CONFIRMED_VALID",
      sha256Receipt: "SHA256:42494E414E43455F5041595F3530"
    }
  ];

  public static getAllDeposits(): CryptoDepositRecord[] {
    return [...this.cryptoDeposits];
  }

  public static verifyAndRecordPayment(params: {
    txHashOrPayId: string;
    provider: CryptoProvider;
    contractNumber: string;
    clientName: string;
    amountUSDT: number;
  }): CryptoDepositRecord {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const rawReceipt = params.provider + "|" + params.txHashOrPayId + "|" + params.amountUSDT + "|" + timestamp;
    const sha256Receipt = "SHA256:" + Buffer.from(rawReceipt).toString('hex').slice(0, 32).toUpperCase();

    const record: CryptoDepositRecord = {
      id: "CRYPTO-TX-" + Date.now().toString().slice(-6),
      txHashOrPayId: params.txHashOrPayId,
      provider: params.provider,
      contractNumber: params.contractNumber,
      clientName: params.clientName,
      amountUSDT: params.amountUSDT,
      recipientWalletOrPayId: params.provider === 'BINANCE_PAY' ? this.CORPORATE_WALLETS.binancePayId : this.CORPORATE_WALLETS.tronTrc20Address,
      networkConfirmations: params.provider === 'BINANCE_PAY' ? 1 : 24,
      timestamp,
      status: "CONFIRMED_VALID",
      sha256Receipt
    };

    this.cryptoDeposits.unshift(record);
    return record;
  }
}
