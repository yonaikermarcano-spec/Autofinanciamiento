"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Scale,
  FileText,
  Gavel,
  Download,
  Printer,
  ShieldAlert,
  Clock,
  UserX,
  AlertTriangle,
  CheckCircle2,
  Send,
  Building,
  FileCheck,
  ChevronRight
} from "lucide-react";
import { JudicialCollectionEngine, JudicialCase, JudicialPhase } from "../../modules/judicial-collection";
import { LoanContract } from "../../types";

interface JudicialCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contracts: LoanContract[];
  bcvRate: number;
}

export default function JudicialCollectionModal({
  isOpen,
  onClose,
  contracts,
  bcvRate
}: JudicialCollectionModalProps) {
  const [cases, setCases] = useState<JudicialCase[]>(JudicialCollectionEngine.getAllCases());
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || "JUD-2026-001");
  const [activeTab, setActiveTab] = useState<"CASES_LIST" | "INTIMATION_LETTER" | "COURT_COMPLAINT">("CASES_LIST");

  const [isCreatingCase, setIsCreatingCase] = useState<boolean>(false);
  const [targetContractId, setTargetContractId] = useState<string>(contracts[0]?.id || "");

  
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

  const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const handleCreateNewJudicialCase = () => {
    const targetContract = contracts.find(c => c.id === targetContractId);
    if (!targetContract) return;

    const newCase = JudicialCollectionEngine.calculateJudicialClaim(targetContract, bcvRate, 20);
    setCases(prev => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
    setIsCreatingCase(false);
  };

  const handleDownloadTextDoc = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans">
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-2xl border border-amber-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Gestión de Cobranza Judicial & Intimaciones Extrajudiciales</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-0.2 rounded-full font-mono">
                  CPC ART. 640
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Procedimiento legal de intimación, cálculo de costas procesales 20% y medidas cautelares de secuestro
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

        {/* Pestañas Superiores */}
        <div className="flex items-center space-x-1 px-6 pt-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-xs">
          {[
            { id: "CASES_LIST", label: "Expedientes Jurídicos Activos", icon: Gavel, count: cases.length },
            { id: "INTIMATION_LETTER", label: "Carta de Intimación Extrajudicial (72h)", icon: FileText },
            { id: "COURT_COMPLAINT", label: "Libelo de Demanda Mercantil (Tribunales)", icon: Building }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={"px-4 py-2 font-semibold transition flex items-center space-x-2 border-b-2 cursor-pointer " + (
                  isActive 
                    ? "border-amber-500 text-amber-700 dark:text-amber-400" 
                    : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.count !== undefined && (
                  <span className="text-[10px] font-mono bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.2 rounded-full">
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
          {/* PESTAÑA 1: LISTA DE EXPEDIENTES JURÍDICOS                                */}
          {/* ========================================================================= */}
          {activeTab === "CASES_LIST" && (
            <div className="space-y-5">
              
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Litigios y Cobranzas Judiciales Activas</h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                    Deudores y fiadores bajo procedimiento de intimación o ejecución de garantía prendaria.
                  </p>
                </div>

                <button
                  onClick={() => setIsCreatingCase(true)}
                  className="p-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-zinc-950 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-md"
                >
                  <Gavel className="w-3.5 h-3.5" />
                  <span>+ Iniciar Procedimiento Judicial</span>
                </button>
              </div>

              {/* Formulario de Nuevo Litigio */}
              {isCreatingCase && (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-amber-500/30 space-y-3 animate-in fade-in">
                  <h4 className="font-bold text-xs text-amber-700 dark:text-amber-400">Seleccionar Contrato Moroso para Demanda</h4>
                  <div className="flex items-center space-x-3">
                    <select
                      value={targetContractId}
                      onChange={e => setTargetContractId(e.target.value)}
                      className="flex-1 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs"
                    >
                      {contracts.map(c => (
                        <option key={c.id} value={c.id}>
                          {"#" + c.contractNumber + " - " + c.clientName + " ($" + c.totalOutstandingUSD + " USD pendiente • Mora: $" + (c.lateFeesPendingUSD || 0) + ")"}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleCreateNewJudicialCase}
                      className="p-2 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs transition cursor-pointer"
                    >
                      Calcular Pretensión & Aperturar Caso
                    </button>
                  </div>
                </div>
              )}

              {/* Grid de Casos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cases.map(c => {
                  const isSelected = selectedCaseId === c.id;

                  return (
                    <div 
                      key={c.id}
                      onClick={() => setSelectedCaseId(c.id)}
                      className={"p-5 rounded-2xl border transition cursor-pointer space-y-3 " + (
                        isSelected 
                          ? "bg-amber-950/20 border-amber-500/50 shadow-lg" 
                          : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-200 dark:border-zinc-700"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono font-bold bg-zinc-100/80 dark:bg-zinc-800/80 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md">
                              {c.id}
                            </span>
                            <span className={"text-[10px] px-2 py-0.5 rounded-full font-bold uppercase " + (
                              c.currentPhase === "EXTRAJUDICIAL_INTIMATION" ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20" :
                              c.currentPhase === "COURT_INTIMATION_FILED" ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20" :
                              "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20"
                            )}>
                              ● {c.currentPhase.replace(/_/g, " ")}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 pt-1">{c.clientName}</h4>
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                            {"CI: " + c.clientDocId + " • Fiador: " + c.guarantorName}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 block">
                            {"$" + c.totalClaimUSD.toFixed(2) + " USD"}
                          </span>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">
                            Bs. {c.totalClaimVES.toLocaleString("es-VE")}
                          </span>
                        </div>
                      </div>

                      {/* Desglose Económico */}
                      <div className="p-3 bg-white dark:bg-zinc-900/80 rounded-lg border border-zinc-200 dark:border-zinc-800/80 space-y-1 text-xs font-mono">
                        <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                          <span>Capital Líquido:</span>
                          <span>{"$" + c.capitalOwedUSD.toFixed(2)} USD</span>
                        </div>
                        <div className="flex justify-between text-amber-700 dark:text-amber-400">
                          <span>Intereses de Mora:</span>
                          <span>{"$" + c.lateFeesOwedUSD.toFixed(2)} USD</span>
                        </div>
                        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                          <span>Costas Judiciales ({c.courtFeesPercent}%):</span>
                          <span>{"$" + c.courtFeesUSD.toFixed(2)} USD</span>
                        </div>
                        <div className="flex justify-between text-zinc-900 dark:text-zinc-100 font-bold pt-1 border-t border-zinc-200 dark:border-zinc-800">
                          <span>Pretensión Total Demanda:</span>
                          <span className="text-emerald-700 dark:text-emerald-400">{"$" + c.totalClaimUSD.toFixed(2)} USD</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 pt-1">
                        <span className="truncate max-w-[200px]">{c.assignedLawyer}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedCaseId(c.id); setActiveTab("INTIMATION_LETTER"); }}
                          className="text-amber-700 dark:text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
                        >
                          <span>Ver Notificación</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* PESTAÑA 2: CARTA NOTARIADA DE INTIMACIÓN (72H)                            */}
          {/* ========================================================================= */}
          {activeTab === "INTIMATION_LETTER" && currentCase && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Carta de Intimación Extrajudicial & Requerimiento Formal</h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                    Caso: {currentCase.id} • Cliente: {currentCase.clientName} (#{currentCase.contractNumber})
                  </p>
                </div>

                <button
                  onClick={() => handleDownloadTextDoc(
                    JudicialCollectionEngine.generateNotarizedIntimationLetter(currentCase, bcvRate),
                    "Carta_Intimacion_" + currentCase.contractNumber + ".txt"
                  )}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>Descargar Documento (.TXT)</span>
                </button>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-slate-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed overflow-y-auto">
                {JudicialCollectionEngine.generateNotarizedIntimationLetter(currentCase, bcvRate)}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PESTAÑA 3: LIBELO DE DEMANDA MERCANTIL (CPC ART. 640)                     */}
          {/* ========================================================================= */}
          {activeTab === "COURT_COMPLAINT" && currentCase && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Libelo de Demanda por Procedimiento de Intimación (CPC Art. 640)</h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                    Tribunal Competente: {currentCase.courtName || "Tribunal de Municipio"}
                  </p>
                </div>

                <button
                  onClick={() => handleDownloadTextDoc(
                    JudicialCollectionEngine.generateCourtComplaintLibel(currentCase),
                    "Libelo_Demanda_CPC640_" + currentCase.contractNumber + ".txt"
                  )}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>Descargar Libelo de Demanda</span>
                </button>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-slate-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed overflow-y-auto">
                {JudicialCollectionEngine.generateCourtComplaintLibel(currentCase)}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
