import { BcvRateSnapshot } from '../../types';

export type CurrencyBenchmark = 'USD_BCV' | 'EUR_BCV' | 'USDT_BINANCE';

export interface MultiRateSnapshot {
  usdRate: number;    // Dólar BCV Oficial
  eurRate: number;    // Euro BCV Oficial
  usdtRate: number;   // Binance USDT P2P
  activeBenchmark: CurrencyBenchmark;
  date: string;
  fetchedAt: string;
}

export class BcvEngine {
  private static rates: MultiRateSnapshot = {
    usdRate: 46.85,
    eurRate: 50.12,
    usdtRate: 52.40,
    activeBenchmark: 'USD_BCV',
    date: new Date().toISOString().split('T')[0],
    fetchedAt: new Date().toISOString()
  };

  public static getRates(): MultiRateSnapshot {
    return { ...this.rates };
  }

  public static getCurrentRate(): { usdRate: number; eurRate: number; usdtRate: number; activeRate: number; benchmarkLabel: string } {
    const activeRate = this.getActiveRateValue();
    const benchmarkLabel = this.getBenchmarkLabel(this.rates.activeBenchmark);
    return {
      usdRate: this.rates.usdRate,
      eurRate: this.rates.eurRate,
      usdtRate: this.rates.usdtRate,
      activeRate,
      benchmarkLabel
    };
  }

  public static getActiveRateValue(): number {
    switch (this.rates.activeBenchmark) {
      case 'EUR_BCV': return this.rates.eurRate;
      case 'USDT_BINANCE': return this.rates.usdtRate;
      case 'USD_BCV':
      default:
        return this.rates.usdRate;
    }
  }

  public static getBenchmarkLabel(benchmark: CurrencyBenchmark): string {
    switch (benchmark) {
      case 'EUR_BCV': return 'Euro BCV (€)';
      case 'USDT_BINANCE': return 'Binance USDT ($)';
      case 'USD_BCV':
      default:
        return 'Dólar BCV ($)';
    }
  }

  public static setActiveBenchmark(benchmark: CurrencyBenchmark): void {
    this.rates.activeBenchmark = benchmark;
  }

  public static setCustomRate(benchmark: CurrencyBenchmark, newRate: number): void {
    if (newRate <= 0) return;
    if (benchmark === 'USD_BCV') this.rates.usdRate = Number(newRate.toFixed(4));
    else if (benchmark === 'EUR_BCV') this.rates.eurRate = Number(newRate.toFixed(4));
    else if (benchmark === 'USDT_BINANCE') this.rates.usdtRate = Number(newRate.toFixed(4));
  }

  public static convertUsdToVes(amountUSD: number, customRate?: number): number {
    const rate = customRate || this.getActiveRateValue();
    return Number((amountUSD * rate).toFixed(2));
  }

  public static convertVesToUsd(amountVES: number, customRate?: number): number {
    const rate = customRate || this.getActiveRateValue();
    if (rate <= 0) return 0;
    return Number((amountVES / rate).toFixed(2));
  }

  public static formatVes(amount: number): string {
    return 'Bs. ' + amount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
