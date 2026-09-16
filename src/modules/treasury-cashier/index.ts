export interface CashRegisterShift {
  shiftId: string;
  cashierName: string;
  cashierRole: "ADMIN" | "BRANCH_CASHIER" | "FIELD_COLLECTOR";
  openedAt: string;
  closedAt?: string;
  status: "OPEN" | "CLOSED";
  
  // Saldos Iniciales de Apertura (Fondo de cambio)
  openingBalanceUSD: number;
  openingBalanceVES: number;
  
  // Movimientos Registrados en el Sistema (Teóricos)
  systemCollectionsCashUSD: number;
  systemCollectionsCashVES: number;
  systemCollectionsPagoMovilVES: number;
  systemCollectionsBinanceUSDT: number;
  systemExpensesCashUSD: number;
  systemExpensesCashVES: number;
  
  // Arqueo Ciego (Declarado por el cajero al cierre)
  declaredCashUSD?: number;
  declaredCashVES?: number;
  
  // Diferencias (Sobrantes o Faltantes)
  differenceUSD?: number;
  differenceVES?: number;
  isBalanced?: boolean;
  closingNotes?: string;
}

export class TreasuryCashierModule {
  /**
   * Abre un nuevo turno de caja
   */
  public static openShift(params: {
    cashierName: string;
    cashierRole: CashRegisterShift["cashierRole"];
    openingBalanceUSD: number;
    openingBalanceVES: number;
  }): CashRegisterShift {
    return {
      shiftId: `SHF-${Date.now().toString().slice(-6)}`,
      cashierName: params.cashierName,
      cashierRole: params.cashierRole,
      openedAt: new Date().toISOString(),
      status: "OPEN",
      openingBalanceUSD: params.openingBalanceUSD,
      openingBalanceVES: params.openingBalanceVES,
      systemCollectionsCashUSD: 0,
      systemCollectionsCashVES: 0,
      systemCollectionsPagoMovilVES: 0,
      systemCollectionsBinanceUSDT: 0,
      systemExpensesCashUSD: 0,
      systemExpensesCashVES: 0
    };
  }

  /**
   * Registra un movimiento en la caja activa
   */
  public static recordMovement(
    shift: CashRegisterShift,
    type: "COLLECTION" | "EXPENSE",
    method: "CASH_USD" | "CASH_VES" | "PAGO_MOVIL" | "BINANCE_USDT",
    amount: number
  ): CashRegisterShift {
    const updated = { ...shift };
    if (type === "COLLECTION") {
      if (method === "CASH_USD") updated.systemCollectionsCashUSD += amount;
      if (method === "CASH_VES") updated.systemCollectionsCashVES += amount;
      if (method === "PAGO_MOVIL") updated.systemCollectionsPagoMovilVES += amount;
      if (method === "BINANCE_USDT") updated.systemCollectionsBinanceUSDT += amount;
    } else {
      if (method === "CASH_USD") updated.systemExpensesCashUSD += amount;
      if (method === "CASH_VES") updated.systemExpensesCashVES += amount;
    }
    return updated;
  }

  /**
   * Realiza el arqueo ciego y cierre de turno calculando faltantes y sobrantes
   */
  public static closeShiftWithAudit(
    shift: CashRegisterShift,
    declaredCashUSD: number,
    declaredCashVES: number,
    closingNotes?: string
  ): CashRegisterShift {
    const expectedCashUSD = Number((
      shift.openingBalanceUSD + shift.systemCollectionsCashUSD - shift.systemExpensesCashUSD
    ).toFixed(2));

    const expectedCashVES = Number((
      shift.openingBalanceVES + shift.systemCollectionsCashVES - shift.systemExpensesCashVES
    ).toFixed(2));

    const differenceUSD = Number((declaredCashUSD - expectedCashUSD).toFixed(2));
    const differenceVES = Number((declaredCashVES - expectedCashVES).toFixed(2));

    const isBalanced = Math.abs(differenceUSD) < 0.05 && Math.abs(differenceVES) < 1.0;

    return {
      ...shift,
      closedAt: new Date().toISOString(),
      status: "CLOSED",
      declaredCashUSD,
      declaredCashVES,
      differenceUSD,
      differenceVES,
      isBalanced,
      closingNotes: closingNotes || (isBalanced ? "Arqueo conforme sin diferencias." : "Discrepancia detectada en arqueo físico.")
    };
  }
}