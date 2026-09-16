"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Search,
  Download,
  Filter,
  RefreshCw,
  Lock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Cpu,
  Layers,
  Link as LinkIcon
} from "lucide-react";
import { ForensicAuditEngine, ForensicAuditEvent, ChainVerificationResult, AuditSeverity, AuditModuleCategory } from "../../modules/forensic-audit";

interface ForensicAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForensicAuditModal({
  isOpen,
  onClose
}: ForensicAuditModalProps) {
  const [events, setEvents] = useState<ForensicAuditEvent[]>(ForensicAuditEngine.getAllEvents());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("TODOS");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("TODAS");
  
  const [verificationResult, setVerificationResult] = useState<ChainVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  
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

  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const res = ForensicAuditEngine.verifyChainIntegrity();
      setVerificationResult(res);
      setIsVerifying(false);
    }, 600);
  };

    const handleExportCSV = () => {
    const csv = ForensicAuditEngine.exportAuditToCSV(";");
    // Incluir BOM UTF-8 (\uFEFF) para visualización perfecta de tildes, eñes y columnas en Excel Windows
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Bitacora_Forense_AutoLendingOS_" + new Date().toISOString().slice(0, 10) + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEvents = events.filter(e => {
    if (selectedModule !== "TODOS" && e.module !== selectedModule) return false;
    if (selectedSeverity !== "TODAS" && e.severity !== selectedSeverity) return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      const match = 
        e.id.toLowerCase().includes(term) ||
        e.action.toLowerCase().includes(term) ||
        e.operatorName.toLowerCase().includes(term) ||
        e.details.toLowerCase().includes(term) ||
        e.currentHash.toLowerCase().includes(term);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Auditoría Forense Criptográfica & Trazabilidad Inmutable</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.2 rounded-full font-mono">
                  SHA-256 CHAIN
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">
                Registro inmutable encadenado de operaciones de caja, créditos, campo y telemetría
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="p-1.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Exportar CSV</span>
            </button>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Panel Superior: Verificación Criptográfica */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-xs text-zinc-300 uppercase tracking-wider">
                Estado de la Cadena Forense (Merkle & Hashes Consecutivos)
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 mt-0.5">
                Garantiza que ningún registro ha sido borrado, modificado o insertado retroactivamente.
              </p>
            </div>

            <button
              onClick={handleRunVerification}
              disabled={isVerifying}
              className="bg-purple-600 hover:bg-purple-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs px-4 py-2 rounded-2xl transition flex items-center space-x-2 shadow-lg shadow-purple-950/50 cursor-pointer"
            >
              {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Cpu className="w-3.5 h-3.5" />}
              <span>Verificar Integridad de Cadena</span>
            </button>
          </div>

          {/* Resultado de la Verificación */}
          {verificationResult && (
            <div className={"p-3.5 rounded-2xl border flex items-center justify-between text-xs animate-in fade-in " + (
              verificationResult.isChainValid 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
            )}>
              <div className="flex items-center space-x-2.5">
                {verificationResult.isChainValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                )}
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">
                    {verificationResult.isChainValid 
                      ? "¡Cadena 100% Válida e Inalterada! (" + verificationResult.totalEventsChecked + " eventos verificados)"
                      : "¡Alerta de Corrupción! Evento alterado: " + verificationResult.corruptedEventId}
                  </p>
                  <p className="text-[10px] opacity-80 font-mono">
                    Root Merkle Hash: {verificationResult.rootMerkleHash} • Verificado: {verificationResult.verificationTimestamp}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 font-bold">
                AUDITORÍA FORENSE OK
              </span>
            </div>
          )}

          {/* Barra de Filtros */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-1 items-center space-x-2 min-w-[280px]">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Buscar por ID, acción, operador, hash o detalle..."
                  className="w-full text-xs rounded-2xl pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <select
                value={selectedModule}
                onChange={e => setSelectedModule(e.target.value)}
                className="text-xs rounded-2xl px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="TODOS">Todos los Módulos</option>
                <option value="TESORERIA">Tesorería</option>
                <option value="CAJA_ARQUEO">Caja & Arqueo</option>
                <option value="RECAUDACION">Recaudación</option>
                <option value="TELEMETRIA_GPS">Telemetría GPS</option>
                <option value="CAMPO_PWA">Campo / PWA</option>
                <option value="LEGAL_INTT">Legal / INTT</option>
                <option value="AUTH_SEGURIDAD">Seguridad & RBAC</option>
              </select>

              <select
                value={selectedSeverity}
                onChange={e => setSelectedSeverity(e.target.value)}
                className="text-xs rounded-2xl px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="TODAS">Todas las Severidades</option>
                <option value="INFO">Info</option>
                <option value="WARNING">Advertencia</option>
                <option value="FINANCIAL_IMPACT">Impacto Financiero</option>
                <option value="CRITICAL_SECURITY">Seguridad Crítica</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Eventos */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-semibold uppercase">
                <tr>
                  <th className="p-3">Seq / ID</th>
                  <th className="p-3">Fecha & Hora</th>
                  <th className="p-3">Operador & Rol</th>
                  <th className="p-3">Módulo</th>
                  <th className="p-3">Acción & Detalle</th>
                  <th className="p-3">Severidad</th>
                  <th className="p-3 text-right">Sello SHA-256</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 font-mono text-[11px]">
                {filteredEvents.map(evt => {
                  const isExpanded = expandedEventId === evt.id;

                  return (
                    <React.Fragment key={evt.id}>
                      <tr 
                        onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                        className="hover:bg-white dark:bg-zinc-900/50 cursor-pointer transition"
                      >
                        <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">
                          #{evt.sequenceNumber} <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-normal">({evt.id})</span>
                        </td>
                        <td className="p-3 text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                          {evt.timestamp}
                        </td>
                        <td className="p-3 font-sans">
                          <p className="font-semibold text-zinc-200">{evt.operatorName}</p>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">{evt.operatorRole}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-mono">
                            {evt.module}
                          </span>
                        </td>
                        <td className="p-3 font-sans">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{evt.action}</p>
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 truncate max-w-xs">{evt.details}</p>
                        </td>
                        <td className="p-3">
                          <span className={"text-[10px] px-2 py-0.5 rounded-full font-bold " + (
                            evt.severity === "CRITICAL_SECURITY" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                            evt.severity === "FINANCIAL_IMPACT" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                            evt.severity === "WARNING" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" :
                            "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          )}>
                            {evt.severity}
                          </span>
                        </td>
                        <td className="p-3 text-right text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-mono">
                          {evt.currentHash.slice(0, 18)}...
                        </td>
                      </tr>

                      {/* Fila Expandida con Cadena Criptográfica */}
                      {isExpanded && (
                        <tr className="bg-zinc-50 dark:bg-zinc-950/90">
                          <td colSpan={7} className="p-4 border-t border-b border-zinc-200 dark:border-zinc-800">
                            <div className="space-y-2 text-xs font-mono bg-white dark:bg-zinc-900/60 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800/80">
                              <p className="font-sans font-bold text-zinc-200 text-xs">
                                Desglose Criptográfico del Bloque #{evt.sequenceNumber}:
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                                <div className="p-2 bg-black/40 rounded-lg">
                                  <span className="text-zinc-600 dark:text-zinc-400 block">Previous Hash (Encadenamiento):</span>
                                  <span className="text-zinc-300 break-all">{evt.previousHash}</span>
                                </div>
                                <div className="p-2 bg-black/40 rounded-lg">
                                  <span className="text-emerald-500 block">Current Hash (Firma de Integridad):</span>
                                  <span className="text-emerald-400 break-all font-bold">{evt.currentHash}</span>
                                </div>
                              </div>
                              <p className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-sans text-xs pt-1">
                                <strong>Detalle Completo:</strong> {evt.details} (IP Origen: {evt.ipAddress})
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
