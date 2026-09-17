"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Building2,
  DollarSign,
  TrendingUp,
  Bike,
  ShieldCheck,
  Layers,
  Award,
  Download,
  Printer
} from "lucide-react";
import { InvestorPortalEngine, InvestorProfile } from "../../modules/investor-portal";

interface InvestorPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  bcvRate: number;
}

export default function InvestorPortalModal({
  isOpen,
  onClose,
  bcvRate
}: InvestorPortalModalProps) {
  const [investors, setInvestors] = useState<InvestorProfile[]>(InvestorPortalEngine.getAllInvestors());
  const [selectedInvestorId, setSelectedInvestorId] = useState<string>(investors[0]?.id || "INV-001");

  
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

  const currentInvestor = investors.find(inv => inv.id === selectedInvestorId) || investors[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Portal del Inversionista & Socio Capitalista</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.2 rounded-full font-mono">
                  EQUITY & DIVIDENDS
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Monitoreo de capital aportado, motos asignadas en garantía y dividendos mensuales liquidados
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO MODAL */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Selector de Socio Inversionista */}
          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">Seleccionar Socio Inversionista:</label>
              <select
                value={selectedInvestorId}
                onChange={e => setSelectedInvestorId(e.target.value)}
                className="p-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
              >
                {investors.map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.companyOrName} ({inv.docIdOrRif} - ${inv.totalCapitalInvestedUSD} USD)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.print()}
                className="p-2 px-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Reporte de Rendimiento</span>
              </button>
            </div>
          </div>

          {/* Tarjetas de Rendimiento Financiero */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-5 rounded-3xl border border-purple-500/30 bg-purple-950/20 space-y-1">
              <span className="text-[10px] text-purple-400 font-bold uppercase block font-sans">CAPITAL APORTADO</span>
              <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{"$" + currentInvestor.totalCapitalInvestedUSD.toLocaleString("es-VE") } USD</p>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans">{currentInvestor.activeFinancedUnitsCount} motos financiadas</span>
            </div>

            <div className="p-5 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block font-sans">RENTABILIDAD ANUAL (APY)</span>
              <p className="text-2xl font-black text-emerald-400">{currentInvestor.annualizedRoiPercent}%</p>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans">Rendimiento sobre capital</span>
            </div>

            <div className="p-5 rounded-3xl border border-blue-500/30 bg-blue-950/20 space-y-1">
              <span className="text-[10px] text-blue-400 font-bold uppercase block font-sans">DIVIDENDOS PAGADOS</span>
              <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{"$" + currentInvestor.monthlyDividendsPaidUSD.toLocaleString("es-VE") } USD</p>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans">Acumulado año en curso</span>
            </div>

            <div className="p-5 rounded-3xl border border-amber-500/30 bg-amber-950/20 space-y-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase block font-sans">DIVIDENDO ESTE MES</span>
              <p className="text-2xl font-black text-amber-400">{"$" + currentInvestor.pendingDividendsThisMonthUSD.toLocaleString("es-VE") } USD</p>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans">Liquidación al cierre</span>
            </div>
          </div>

          {/* Lista de Vehículos Asignados en Garantía */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center space-x-2">
              <Bike className="w-4 h-4 text-purple-400" />
              <span>Flota Asignada en Garantía al Inversionista:</span>
            </h4>

            <div className="space-y-2.5">
              {currentInvestor.allocatedVehicles.map((veh, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 font-sans">{veh.model}</span>
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400">#{veh.contractNumber}</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-bold">
                        ● {veh.healthStatus}
                      </span>
                    </div>

                    <p className="text-zinc-300 font-sans text-xs">
                      Cliente: <strong className="text-zinc-900 dark:text-zinc-100">{veh.clientName}</strong> • Cuota Mensual: <strong className="text-emerald-400">{"$" + veh.monthlyQuotaUSD} USD</strong>
                    </p>

                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono block">
                      VIN Chasis: {veh.vin}
                    </span>
                  </div>

                  <div className="flex-shrink-0">
                    <span className="text-[10px] bg-white dark:bg-zinc-900 text-purple-300 px-2.5 py-1 rounded font-mono border border-zinc-200 dark:border-zinc-800">
                      Garantía Activa
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
