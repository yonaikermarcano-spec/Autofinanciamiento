"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  TrendingUp,
  PieChart,
  BarChart3,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Calendar,
  Layers,
  ArrowUpRight,
  Calculator,
  Bike,
  Sparkles
} from "lucide-react";
import {
  ExecutiveBIEngine,
  CashFlowPeriodProjection,
  PortfolioHealthMetric,
  ModelProfitabilityItem,
  FleetExpansionResult
} from "../../modules/executive-bi";
import { LoanContract } from "../../types";

interface ExecutiveBIModalProps {
  isOpen: boolean;
  onClose: () => void;
  contracts: LoanContract[];
  bcvRate: number;
}

export default function ExecutiveBIModal({
  isOpen,
  onClose,
  contracts,
  bcvRate
}: ExecutiveBIModalProps) {
  const [activeTab, setActiveTab] = useState<"CASH_FLOW" | "NPL_HEALTH" | "MODEL_PROFIT" | "EXPANSION_ROI">("CASH_FLOW");

  // Proyecciones y Métricas
  const cashFlows = ExecutiveBIEngine.getCashFlowProjections(contracts, bcvRate);
  const portfolioHealth = ExecutiveBIEngine.calculatePortfolioHealth(contracts);
  const modelProfitability = ExecutiveBIEngine.getModelProfitabilityMatrix();

  // Estado Simulador Expansión
  const [simCapitalUSD, setSimCapitalUSD] = useState<number>(15000);
  const [simBikePriceUSD, setSimBikePriceUSD] = useState<number>(1200);
  const [simDownPercent, setSimDownPercent] = useState<number>(35);
  const [simTermMonths, setSimTermMonths] = useState<number>(12);
  const [simInterestAnnual, setSimInterestAnnual] = useState<number>(24);

  const expansionResult: FleetExpansionResult = ExecutiveBIEngine.simulateFleetExpansion({
    capitalInjectionUSD: simCapitalUSD,
    targetBikePriceUSD: simBikePriceUSD,
    downPaymentPercent: simDownPercent,
    termMonths: simTermMonths,
    interestRateAnnual: simInterestAnnual
  });

  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Centro de Inteligencia Ejecutiva (BI) & Proyecciones</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded-full font-mono">
                  FINANCIAL ANALYTICS
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">
                Flujo de caja a 30/60/90 días, calidad de cartera NPL, rentabilidad por modelo y simulador ROI
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas Superiores */}
        <div className="flex items-center space-x-1 px-6 pt-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-xs">
          {[
            { id: "CASH_FLOW", label: "Flujo de Caja (30/60/90 Días)", icon: BarChart3 },
            { id: "NPL_HEALTH", label: "Salud de Cartera (NPL Ratio)", icon: ShieldCheck, count: portfolioHealth.nplRatioPercent + "% NPL" },
            { id: "MODEL_PROFIT", label: "Rentabilidad por Modelo", icon: Bike },
            { id: "EXPANSION_ROI", label: "Simulador Expansión & ROI", icon: Calculator }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={"px-4 py-2 font-semibold transition flex items-center space-x-2 border-b-2 cursor-pointer " + (
                  isActive 
                    ? "border-emerald-500 text-emerald-400" 
                    : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-200"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.count !== undefined && (
                  <span className="text-[10px] bg-zinc-800 text-zinc-300 font-mono px-1.5 py-0.2 rounded-full font-bold">
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* CONTENIDO MODAL */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* ========================================================================= */}
          {/* 1. PROYECCIÓN DE FLUJO DE CAJA                                            */}
          {/* ========================================================================= */}
          {activeTab === "CASH_FLOW" && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cashFlows.map(cf => (
                  <div 
                    key={cf.periodDays}
                    className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{cf.label}</span>
                      <span className="text-[10px] bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded font-mono">
                        {cf.expectedQuotasCount} cuotas estimadas
                      </span>
                    </div>

                    <div>
                      <span className="text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100">
                        {"$" + cf.netExpectedCashFlowUSD.toLocaleString()} USD
                      </span>
                      <span className="text-xs text-emerald-400 font-mono block mt-0.5">
                        {"≈ Bs. " + cf.netExpectedCashFlowVES.toLocaleString() + " BCV"}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">
                      <div className="flex justify-between">
                        <span>Cobranza Bruta Teórica:</span>
                        <span className="text-zinc-200">{"$" + cf.grossProjectedUSD}</span>
                      </div>
                      <div className="flex justify-between text-amber-400/90">
                        <span>Castigo por Mora Estimada:</span>
                        <span>-{"$" + cf.expectedDefaultRiskUSD}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-2 text-xs text-zinc-300">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Criterio Metodológico de la Proyección de Liquidez</span>
                </h4>
                <p className="leading-relaxed text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">
                  Las proyecciones se calculan sobre el cronograma activo de amortización, aplicando un factor de corrección por mora estacional (5% en 30 días, 6.5% en 60 días y 8% en 90 días). Todos los montos en Bolívares se indexan automáticamente a la tasa oficial del BCV (<strong className="text-zinc-900 dark:text-zinc-100">{"Bs. " + bcvRate}</strong>).
                </p>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. CALIDAD DE CARTERA & NPL RATIO                                         */}
          {/* ========================================================================= */}
          {activeTab === "NPL_HEALTH" && (
            <div className="space-y-6">
              
              {/* Header NPL */}
              <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-bold uppercase">CARTERA TOTAL EN CALLE</span>
                  <p className="text-3xl font-black font-mono text-zinc-900 dark:text-zinc-100">{"$" + portfolioHealth.totalPortfolioOutstandingUSD.toLocaleString()} USD</p>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">Capital amortizable por recuperar</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-bold uppercase">ÍNDICE DE MORA CRÍTICA (NPL)</span>
                  <div className="flex items-baseline justify-end space-x-1 mt-0.5">
                    <span className="text-3xl font-black font-mono text-emerald-400">{portfolioHealth.nplRatioPercent}%</span>
                  </div>
                  <span className={"text-[10px] font-bold px-2 py-0.5 rounded border inline-block mt-1 " + (
                    portfolioHealth.portfolioHealthStatus === 'EXCELENTE' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                    "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  )}>
                    ● SALUD: {portfolioHealth.portfolioHealthStatus}
                  </span>
                </div>
              </div>

              {/* Barra de Distribución de Cartera */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-300">Composición de la Cartera por Nivel de Riesgo:</span>
                <div className="h-4 rounded-full bg-zinc-800 flex overflow-hidden">
                  <div style={{ width: portfolioHealth.healthyPercent + "%" }} className="bg-emerald-500" title="Cartera Sana" />
                  <div style={{ width: portfolioHealth.moderateRiskPercent + "%" }} className="bg-blue-500" title="Riesgo Moderado" />
                  <div style={{ width: portfolioHealth.highRiskPercent + "%" }} className="bg-amber-500" title="Riesgo Alto" />
                  <div style={{ width: portfolioHealth.nplRatioPercent + "%" }} className="bg-red-500" title="Mora Crítica" />
                </div>
              </div>

              {/* Detalle por Tramo */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold block">🟢 CARTERA SANA (0-7 DÍAS)</span>
                  <strong className="text-zinc-900 dark:text-zinc-100 text-base font-mono block">{"$" + portfolioHealth.healthyPortfolioUSD.toLocaleString()} USD</strong>
                  <span className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">{portfolioHealth.healthyPercent}% de la cartera</span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-1">
                  <span className="text-[10px] text-blue-400 font-bold block">🔵 RIESGO MODERADO (8-30 DÍAS)</span>
                  <strong className="text-zinc-900 dark:text-zinc-100 text-base font-mono block">{"$" + portfolioHealth.moderateRiskPortfolioUSD.toLocaleString()} USD</strong>
                  <span className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">{portfolioHealth.moderateRiskPercent}% de la cartera</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold block">🟡 RIESGO ALTO (31-60 DÍAS)</span>
                  <strong className="text-zinc-900 dark:text-zinc-100 text-base font-mono block">{"$" + portfolioHealth.highRiskPortfolioUSD.toLocaleString()} USD</strong>
                  <span className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">{portfolioHealth.highRiskPercent}% de la cartera</span>
                </div>

                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-1">
                  <span className="text-[10px] text-red-400 font-bold block">🔴 MORA CRÍTICA (+60 DÍAS)</span>
                  <strong className="text-zinc-900 dark:text-zinc-100 text-base font-mono block">{"$" + portfolioHealth.nplCriticalPortfolioUSD.toLocaleString()} USD</strong>
                  <span className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">{portfolioHealth.nplRatioPercent}% de la cartera</span>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. RENTABILIDAD POR MODELO DE MOTO                                        */}
          {/* ========================================================================= */}
          {activeTab === "MODEL_PROFIT" && (
            <div className="space-y-4">
              
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-300">
                <p className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-1.5">
                  <Bike className="w-4 h-4 text-emerald-400" />
                  <span>Matriz de Desempeño Financiero y Riesgo por Marca & Modelo</span>
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 mt-1">
                  Compara qué modelos ofrecen mayor margen financiero neto vs menor índice de mora para optimizar las compras a concesionarios.
                </p>
              </div>

              <div className="space-y-3">
                {modelProfitability.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-sans">{item.brand} {item.modelName}</span>
                        <span className="text-[10px] bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 px-2 py-0.2 rounded">
                          {item.unitsFinanced} unidades
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 text-xs">
                        <p>Financiamiento Promedio: <strong className="text-zinc-900 dark:text-zinc-100 font-mono">{"$" + item.avgFinancedUSD}</strong></p>
                        <p>Interés Promedio Generado: <strong className="text-emerald-400 font-mono">+{"$" + item.avgInterestEarnedUSD}</strong></p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-right">
                      <div>
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block">TASA MORA</span>
                        <strong className="text-amber-400 text-xs">{item.defaultRatePercent}%</strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block">MARGEN NETO</span>
                        <strong className="text-emerald-400 text-sm">{item.netProfitMarginPercent}%</strong>
                      </div>

                      <span className={"text-[10px] font-bold px-2.5 py-1 rounded font-sans " + (
                        item.recommendedInventoryAction === "AUMENTAR_COLOCACION" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                        item.recommendedInventoryAction === "MANTENER_NIVEL" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" :
                        "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      )}>
                        ● {item.recommendedInventoryAction.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. SIMULADOR DE EXPANSIÓN & ROI                                           */}
          {/* ========================================================================= */}
          {activeTab === "EXPANSION_ROI" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Formulario Parámetros (Col 5) */}
              <div className="lg:col-span-5 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Parámetros de Inversión</h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">Calcula el retorno de inyectar nuevo capital para compra de flota.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-zinc-700 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block mb-1">Capital a Inyectar ($ USD)</label>
                    <input
                      type="number"
                      min="1000"
                      step="500"
                      value={simCapitalUSD}
                      onChange={e => setSimCapitalUSD(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-emerald-400 font-bold font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block mb-1">Precio Promedio de Moto ($ USD)</label>
                    <input
                      type="number"
                      value={simBikePriceUSD}
                      onChange={e => setSimBikePriceUSD(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-700 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block mb-1">% Inicial ({simDownPercent}%)</label>
                      <input
                        type="range"
                        min="20"
                        max="50"
                        step="5"
                        value={simDownPercent}
                        onChange={e => setSimDownPercent(parseInt(e.target.value, 10))}
                        className="w-full accent-emerald-500 mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-700 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block mb-1">Plazo ({simTermMonths} meses)</label>
                      <select
                        value={simTermMonths}
                        onChange={e => setSimTermMonths(parseInt(e.target.value, 10))}
                        className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-mono"
                      >
                        <option value={6}>6 Meses</option>
                        <option value={12}>12 Meses</option>
                        <option value={18}>18 Meses</option>
                        <option value={24}>24 Meses</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resultados Simulador (Col 7) */}
              <div className="lg:col-span-7 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-4">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">RESULTADOS PROYECTADOS</span>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block font-sans">Nuevas Motos a Colocar:</span>
                    <strong className="text-zinc-900 dark:text-zinc-100 text-xl">{expansionResult.newBikesPurchasedCount} unidades</strong>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block font-sans">Inicial Recuperada al Instante:</span>
                    <strong className="text-emerald-400 text-xl">{"$" + expansionResult.downPaymentRecoveredInstantUSD} USD</strong>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block font-sans">Ingreso Mensual por Cuotas:</span>
                    <strong className="text-indigo-400 text-xl">{"$" + expansionResult.monthlyCashInflowExpectedUSD} USD/mes</strong>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block font-sans">Retorno de Inversión (ROI):</span>
                    <strong className="text-amber-400 text-xl">{expansionResult.netProfitabilityROI}%</strong>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 space-y-1">
                  <p className="font-bold">⏱️ Período de Recuperación Total del Capital (Payback):</p>
                  <p className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">
                    {expansionResult.paybackPeriodMonths} meses para amortizar el 100% de la inversión y quedar en ganancia pura.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
