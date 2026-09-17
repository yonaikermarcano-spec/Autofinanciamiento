import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache de 60 segundos para alto rendimiento

export async function GET() {
  // Tasas base de respaldo en caso de desconexión total
  let usd = 847.44;
  let eur = 977.68;
  let usdt = 950.00;
  let fuenteUsd = "Banco Central de Venezuela (BCV Oficial)";
  let fuenteEur = "Banco Central de Venezuela (BCV Oficial)";
  let fuenteUsdt = "Binance P2P (VES/USDT)";
  let lastUpdated = new Date().toISOString();

  try {
    const [dolarRes, euroRes, binanceRes] = await Promise.allSettled([
      // 1. Dólares (Oficial BCV y Paralelo de respaldo)
      fetch("https://ve.dolarapi.com/v1/dolares", {
        headers: { "Accept": "application/json", "User-Agent": "AutoLending-OS/1.0" },
        next: { revalidate: 60 }
      }).then(r => r.ok ? r.json() : null),

      // 2. Euros (Oficial BCV)
      fetch("https://ve.dolarapi.com/v1/euros", {
        headers: { "Accept": "application/json", "User-Agent": "AutoLending-OS/1.0" },
        next: { revalidate: 60 }
      }).then(r => r.ok ? r.json() : null),

      // 3. Binance P2P USDT/VES
      fetch("https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        },
        body: JSON.stringify({
          asset: "USDT",
          fiat: "VES",
          merchantCheck: false,
          page: 1,
          rows: 5,
          tradeType: "BUY",
          transAmount: "5000"
        }),
        next: { revalidate: 60 }
      }).then(r => r.ok ? r.json() : null)
    ]);

    // Procesar Dólares
    if (dolarRes.status === "fulfilled" && Array.isArray(dolarRes.value)) {
      const oficial = dolarRes.value.find((d: any) => d.fuente === "oficial");
      const paralelo = dolarRes.value.find((d: any) => d.fuente === "paralelo");
      if (oficial && typeof oficial.promedio === 'number') {
        usd = Number(oficial.promedio.toFixed(2));
        if (oficial.fechaActualizacion) lastUpdated = oficial.fechaActualizacion;
      }
      // Si Binance falla, usamos paralelo como respaldo confiable
      if (paralelo && typeof paralelo.promedio === 'number') {
        usdt = Number(paralelo.promedio.toFixed(2));
        fuenteUsdt = "Mercado Paralelo (DolarApi)";
      }
    }

    // Procesar Euros
    if (euroRes.status === "fulfilled" && Array.isArray(euroRes.value)) {
      const oficial = euroRes.value.find((d: any) => d.fuente === "oficial");
      if (oficial && typeof oficial.promedio === 'number') {
        eur = Number(oficial.promedio.toFixed(2));
      }
    }

    // Procesar Binance P2P en Vivo
    if (binanceRes.status === "fulfilled" && binanceRes.value && Array.isArray(binanceRes.value.data)) {
      const prices = binanceRes.value.data
        .slice(0, 5)
        .map((a: any) => parseFloat(a?.adv?.price))
        .filter((p: number) => !isNaN(p) && p > 0);
      if (prices.length > 0) {
        const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
        usdt = Number(avg.toFixed(2));
        fuenteUsdt = "Binance P2P En Vivo";
      }
    }
  } catch (err) {
    console.error("Error al obtener tasas en vivo en API route:", err);
  }

  return NextResponse.json({
    success: true,
    usdRate: usd,
    eurRate: eur,
    usdtRate: usdt,
    date: new Date().toISOString().split('T')[0],
    fetchedAt: new Date().toISOString(),
    lastUpdated,
    sources: {
      usd: fuenteUsd,
      eur: fuenteEur,
      usdt: fuenteUsdt
    }
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
    }
  });
}
