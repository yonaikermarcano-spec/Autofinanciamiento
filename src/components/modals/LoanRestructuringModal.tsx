"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  RefreshCw,
  FileSignature,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
  Printer
} from "lucide-react";
import { LoanRestructuringEngine, RestructuringResult } from "../../modules/loan-restructuring";
import { LoanContract } from "../../types";

interface LoanRestructuringModalProps {
  isOpen: boolean;
  onClose: () => void;
  contracts: LoanContract[];
  bcvRate: number;
}

export default function LoanRestructuringModal({
  isOpen,
  onClose,
  contracts,
  bcvRate
}: LoanRestructuringModalProps) {
  const [selectedContractNumber, setSelectedContractNumber] = useState<string>(contracts[0]?.contractNumber || "CTR-2026-001");
  const [reason, setReason] = useState<'CONTINGENCIA_MEDICA' | 'ACCIDENTE_TRANSITO' | 'REDUCCION_INGRESOS' | 'ACUERDO_EXTRAJUDICIAL'>('CONTINGENCIA_MEDICA');
  const [customNotes, setCustomNotes] = useState<string>("Cliente presentó informe médico temporal. Se acuerda extender el plazo para reducir la cuota semanal.");
  const [waiveLateFees, setWaiveLateFees] = useState<boolean>(true);
  const [newTermWeeks, setNewTermWeeks] = useState<number>(24);
  const [interestRateAnnual, setInterestRateAnnual] = useState<number>(18);
  const [successMessage, setSuccessMessage] = useState<string>("");

  
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

  const currentContract = contracts.find(c => c.contractNumber === selectedContractNumber) || contracts[0];

  const proposal: RestructuringResult = LoanRestructuringEngine.calculateProposal(
    currentContract,
    {
      contractNumber: selectedContractNumber,
      reason,
      customNotes,
      waiveLateFees,
      newTermWeeks,
      interestRateAnnual
    },
    bcvRate
  );

  const handleApplyRestructuring = () => {
    LoanRestructuringEngine.applyRestructuring(proposal);
    setSuccessMessage("¡Refinanciamiento aplicado exitosamente! Se emitió el Addendum #" + proposal.addendumCode + " y el nuevo Pagaré #" + proposal.newPromissoryNoteId + " con sello " + proposal.sha256Seal.slice(0, 16) + "...");
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/10 text-orange-700 dark:text-orange-400 rounded-2xl border border-orange-500/20">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Reestructuración de Créditos & Refinanciamiento</span>
                <span className="text-[10px] bg-orange-500/20 text-orange-800 dark:text-orange-300 px-2 py-0.2 rounded-full font-mono">
                  ADDENDUM & NUEVO PAGARÉ
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Alivio financiero por contingencias, condonación de moras y recálculo de cuotas
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
          
          {/* Banner de Éxito */}
          {successMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Formulario y Simulación en 2 Columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Columna Izquierda: Parámetros del Refinanciamiento (Col 5) */}
            <div className="lg:col-span-5 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-4 text-xs">
              <div>
                <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">Seleccionar Contrato del Cliente:</label>
                <select
                  value={selectedContractNumber}
                  onChange={e => setSelectedContractNumber(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                >
                  {contracts.map(c => (
                    <option key={c.contractNumber} value={c.contractNumber}>
                      {c.clientName} ({c.contractNumber} - Saldo: ${c.totalOutstandingUSD})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">Motivo del Refinanciamiento:</label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value as any)}
                  className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs"
                >
                  <option value="CONTINGENCIA_MEDICA">Contingencia Médica / Salud</option>
                  <option value="ACCIDENTE_TRANSITO">Accidente de Tránsito / Reparación</option>
                  <option value="REDUCCION_INGRESOS">Baja Temporal de Ingresos</option>
                  <option value="ACUERDO_EXTRAJUDICIAL">Acuerdo Extrajudicial Preventivo</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">Justificación / Dictamen Comité:</label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 text-xs"
                />
              </div>

              <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={waiveLateFees}
                    onChange={e => setWaiveLateFees(e.target.checked)}
                    className="rounded text-orange-500"
                  />
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">Condonar 100% de Moras Acumuladas</span>
                </label>
                <span className="text-[11px] text-zinc-600 dark:text-zinc-400 block pl-5">
                  Monto a exonerar: <strong className="text-emerald-700 dark:text-emerald-400">${currentContract.lateFeesPendingUSD || 0} USD</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">Nuevo Plazo ({newTermWeeks} sem)</label>
                  <select
                    value={newTermWeeks}
                    onChange={e => setNewTermWeeks(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                  >
                    <option value={12}>12 Semanas (3 Meses)</option>
                    <option value={24}>24 Semanas (6 Meses)</option>
                    <option value={36}>36 Semanas (9 Meses)</option>
                    <option value={48}>48 Semanas (12 Meses)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">Tasa Anual ({interestRateAnnual}%)</label>
                  <input
                    type="number"
                    value={interestRateAnnual}
                    onChange={e => setInterestRateAnnual(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Columna Derecha: Resultado y Nuevo Pagaré (Col 7) */}
            <div className="lg:col-span-7 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-4">
              <span className="text-[10px] text-orange-700 dark:text-orange-400 font-bold uppercase tracking-wider">PROPUESTA DE REFINANCIAMIENTO</span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans block">Deuda Anterior:</span>
                  <strong className="text-zinc-600 dark:text-zinc-400 line-through">{"$" + proposal.previousOutstandingUSD} USD</strong>
                </div>

                <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans block">Nueva Deuda Refinanciada:</span>
                  <strong className="text-zinc-900 dark:text-zinc-100 text-base">{"$" + proposal.newRestructuredDebtUSD} USD</strong>
                </div>

                <div className="p-3.5 bg-emerald-950/20 rounded-2xl border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-sans block">Nueva Cuota Semanal:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 text-base">{"$" + proposal.newWeeklyQuotaUSD} USD</strong>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block">≈ Bs. {(proposal.newWeeklyQuotaUSD * bcvRate).toFixed(2)} BCV</span>
                </div>
              </div>

              {/* Ficha Legal */}
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-1.5">
                    <FileSignature className="w-4 h-4 text-orange-700 dark:text-orange-400" />
                    <span>Documentos Jurídicos a Emitir</span>
                  </span>
                  <span className="text-[10px] bg-orange-500/20 text-orange-800 dark:text-orange-300 px-2 py-0.2 rounded font-mono">
                    SUSTITUCIÓN DE TÍTULO
                  </span>
                </div>

                <p className="text-slate-700 dark:text-zinc-300 font-mono text-[11px]">
                  • Código Addendum: <strong className="text-zinc-900 dark:text-zinc-100">{proposal.addendumCode}</strong>
                </p>
                <p className="text-slate-700 dark:text-zinc-300 font-mono text-[11px]">
                  • Nuevo Pagaré Mercantil: <strong className="text-zinc-900 dark:text-zinc-100">{proposal.newPromissoryNoteId}</strong>
                </p>
                <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono truncate">
                  Sello Criptográfico: {proposal.sha256Seal}
                </p>
              </div>

              {/* Botón Aplicar */}
              <div className="pt-2">
                <button
                  onClick={handleApplyRestructuring}
                  className="w-full p-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-orange-950/50"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Aplicar Refinanciamiento & Emitir Nuevo Pagaré</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
