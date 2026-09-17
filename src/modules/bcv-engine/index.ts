import { BcvRateSnapshot } from '../../types';

export type CurrencyBenchmark = 'USD_BCV' | 'EUR_BCV' | 'USDT_BINANCE';

export interface MultiRateSnapshot {
  usdRate: number;    // Dólar BCV Oficial
  eurRate: number;    // Euro BCV Oficial
  usdtRate: number;   // Binance USDT P2P
  activeBenchmark: CurrencyBenchmark;
  date: string;
  fetchedAt: string;
  lastUpdated?: string;
  sources?: {
    usd: string;
    eur: string;
    usdt: string;
  };
}

const STORAGE_KEY = 'autolending_live_rates';

export class BcvEngine {
  private static isInitialized = false;

  private static rates: MultiRateSnapshot = {
    usdRate: 847.44,
    eurRate: 977.68,
    usdtRate: 950.00,
    activeBenchmark: 'USD_BCV',
    date: new Date().toISOString().split('T')[0],
    fetchedAt: new Date().toISOString(),
    lastUpdated: 'En vivo',
    sources: {
      usd: 'Banco Central de Venezuela (BCV Oficial)',
      eur: 'Banco Central de Venezuela (BCV Oficial)',
      usdt: 'Binance P2P (VES/USDT)'
    }
  };

  private static initFromStorage(): void {
    if (this.isInitialized) return;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed.usdRate === 'number' && parsed.usdRate > 0) {
            this.rates = {
              ...this.rates,
              ...parsed
            };
          }
        }
      } catch (e) {
        // ignore parse error
      }
      this.isInitialized = true;
    }
  }

  public static getRates(): MultiRateSnapshot {
    this.initFromStorage();
    return { ...this.rates };
  }

  public static getCurrentRate(): { usdRate: number; eurRate: number; usdtRate: number; activeRate: number; benchmarkLabel: string } {
    this.initFromStorage();
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
    this.initFromStorage();
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
    this.initFromStorage();
    this.rates.activeBenchmark = benchmark;
    this.persist();
  }

  public static setCustomRate(benchmark: CurrencyBenchmark, newRate: number): void {
    if (newRate <= 0) return;
    this.initFromStorage();
    if (benchmark === 'USD_BCV') this.rates.usdRate = Number(newRate.toFixed(4));
    else if (benchmark === 'EUR_BCV') this.rates.eurRate = Number(newRate.toFixed(4));
    else if (benchmark === 'USDT_BINANCE') this.rates.usdtRate = Number(newRate.toFixed(4));
    this.persist();
  }

  private static persist(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.rates));
      } catch (e) {
        // ignore
      }
    }
  }

  /**
   * Sincroniza las tasas reales en vivo consultando el endpoint interno /api/rates
   * o fallback directo a las fuentes públicas si la API interna no responde.
   */
  public static async syncLiveRates(): Promise<MultiRateSnapshot> {
    this.initFromStorage();
    try {
      // 1. Intentar llamar a /api/rates
      const res = await fetch('/api/rates', {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.usdRate === 'number' && data.usdRate > 0) {
          this.rates.usdRate = data.usdRate;
          if (data.eurRate && data.eurRate > 0) this.rates.eurRate = data.eurRate;
          if (data.usdtRate && data.usdtRate > 0) this.rates.usdtRate = data.usdtRate;
          this.rates.fetchedAt = data.fetchedAt || new Date().toISOString();
          this.rates.date = data.date || new Date().toISOString().split('T')[0];
          this.rates.lastUpdated = data.lastUpdated || new Date().toLocaleTimeString('es-VE');
          if (data.sources) this.rates.sources = data.sources;

          this.persist();
          this.notifyUpdate();
          return { ...this.rates };
        }
      }
    } catch (e) {
      console.warn('API interna /api/rates no disponible, probando fallback directo:', e);
    }

    // 2. Fallback de cliente: DolarApi directo
    try {
      const [dolarRes, euroRes] = await Promise.allSettled([
        fetch('https://ve.dolarapi.com/v1/dolares').then(r => r.ok ? r.json() : null),
        fetch('https://ve.dolarapi.com/v1/euros').then(r => r.ok ? r.json() : null)
      ]);

      if (dolarRes.status === 'fulfilled' && Array.isArray(dolarRes.value)) {
        const oficial = (dolarRes.value as any[]).find((d: any) => d.fuente === 'oficial');
        const paralelo = (dolarRes.value as any[]).find((d: any) => d.fuente === 'paralelo');
        if (oficial?.promedio) {
          this.rates.usdRate = Number(oficial.promedio.toFixed(2));
          this.rates.lastUpdated = oficial.fechaActualizacion || new Date().toLocaleTimeString('es-VE');
        }
        if (paralelo?.promedio) {
          this.rates.usdtRate = Number(paralelo.promedio.toFixed(2));
        }
      }

      if (euroRes.status === 'fulfilled' && Array.isArray(euroRes.value)) {
        const oficial = (euroRes.value as any[]).find((d: any) => d.fuente === 'oficial');
        if (oficial?.promedio) {
          this.rates.eurRate = Number(oficial.promedio.toFixed(2));
        }
      }

      this.rates.fetchedAt = new Date().toISOString();
      this.persist();
      this.notifyUpdate();
    } catch (err) {
      console.error('Error al sincronizar tasas en vivo en cliente:', err);
    }

    return { ...this.rates };
  }

  private static notifyUpdate(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bcv_rates_updated', { detail: { ...this.rates } }));
    }
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
