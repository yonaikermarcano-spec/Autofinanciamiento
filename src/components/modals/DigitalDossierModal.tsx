"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  PackageCheck,
  Download,
  Printer,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  Bike,
  UserCheck,
  QrCode,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { DigitalDossierEngine, DigitalDossierBundle } from "../../modules/digital-dossier";
import { LoanContract } from "../../types";

interface DigitalDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  contracts: LoanContract[];
  bcvRate: number;
}

export default function DigitalDossierModal({
  isOpen,
  onClose,
  contracts,
  bcvRate
}: DigitalDossierModalProps) {
  const [selectedContractNumber, setSelectedContractNumber] = useState<string>(contracts[0]?.contractNumber || "CTR-2026-001");
  const [successExportMessage, setSuccessExportMessage] = useState<string>("");

  
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

  const dossier: DigitalDossierBundle = DigitalDossierEngine.generateClientDossier(selectedContractNumber, bcvRate);

  const handlePrintDossier = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dossier, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "EXPEDIENTE_DIGITAL_" + dossier.contractNumber + ".json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSuccessExportMessage("¡Expediente Digital #" + dossier.contractNumber + " exportado con éxito con sello " + dossier.masterDossierSha256.slice(0, 16) + "...!");
    setTimeout(() => setSuccessExportMessage(""), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-2xl border border-amber-500/20">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Exportador de Expediente Digital Integral (Dossier)</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.2 rounded-full font-mono">
                  SELLO FORENSE SHA-256
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Consolidación en 1 clic de contratos, pagarés OTP, inspecciones, scoring, GPS y taller
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
          {successExportMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
              <span>{successExportMessage}</span>
            </div>
          )}

          {/* Selector de Contrato & Botones de Acción */}
          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">Seleccionar Expediente de Cliente:</label>
              <select
                value={selectedContractNumber}
                onChange={e => setSelectedContractNumber(e.target.value)}
                className="p-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
              >
                {contracts.map(c => (
                  <option key={c.contractNumber} value={c.contractNumber}>
                    {c.clientName} ({c.contractNumber} - C.I. {c.clientDocId})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrintDossier}
                className="p-2.5 px-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Dossier</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="p-2.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-amber-950/50"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Expediente (JSON)</span>
              </button>
            </div>
          </div>

          {/* Resumen del Expediente */}
          <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 gap-2">
              <div>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase">TITULAR DEL FINANCIAMIENTO</span>
                <h4 className="text-lg font-black text-zinc-900 dark:text-zinc-100">{dossier.clientName}</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                  C.I. {dossier.clientDocId} • Teléfono: {dossier.clientPhone} • Contrato: #{dossier.contractNumber}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold block">VEHÍCULO ADQUIRIDO</span>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{dossier.vehicleBrandModel}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                  Placa: {dossier.vehiclePlate} • VIN: {dossier.vinChassis}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
              <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans block">Precio Financiado:</span>
                <strong className="text-zinc-900 dark:text-zinc-100 text-sm">{"$" + dossier.totalFinancedUSD} USD</strong>
              </div>

              <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans block">Total Amortizado:</span>
                <strong className="text-emerald-700 dark:text-emerald-400 text-sm">{"$" + dossier.totalPaidUSD} USD</strong>
              </div>

              <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans block">Saldo Remanente:</span>
                <strong className="text-amber-700 dark:text-amber-400 text-sm">{"$" + dossier.totalOutstandingUSD} USD</strong>
              </div>

              <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans block">Documentos Anexos:</span>
                <strong className="text-indigo-700 dark:text-indigo-400 text-sm">{dossier.documents.length} Archivos</strong>
              </div>
            </div>
          </div>

          {/* Lista de Documentos Integrados en el Expediente */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Documentos Integrados en el Expediente Forense:</span>
            </h4>

            <div className="space-y-2.5">
              {dossier.documents.map((doc, idx) => (
                <div 
                  key={doc.id}
                  className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 font-sans">{idx + 1}. {doc.title}</span>
                      <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">#{doc.documentNumber}</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.2 rounded font-mono font-bold">
                        ● {doc.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-zinc-300 font-sans text-xs">
                      {doc.summaryDetails}
                    </p>

                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono block">
                      Emisión: {doc.issueDate} • Sello: {doc.sha256Seal}
                    </span>
                  </div>

                  <div className="flex-shrink-0">
                    <span className="text-[10px] bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 px-2.5 py-1 rounded font-mono border border-zinc-200 dark:border-zinc-800">
                      {doc.categoryLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sello Master Criptográfico */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs font-mono text-amber-800 dark:text-amber-300 space-y-1">
            <p className="font-bold flex items-center space-x-1.5 font-sans">
              <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Sello Master de Integridad Forense (Merkle Root SHA-256):</span>
            </p>
            <p className="text-zinc-900 dark:text-zinc-100 text-xs truncate font-bold">{dossier.masterDossierSha256}</p>
            <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans">
              Garantiza la autenticidad e inalterabilidad de todos los recaudos ante tribunales, aseguradoras e inversionistas.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
