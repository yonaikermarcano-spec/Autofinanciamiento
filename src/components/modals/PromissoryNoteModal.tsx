"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Download,
  Printer,
  Smartphone,
  ShieldCheck,
  Send,
  UserCheck,
  Building,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { PromissoryNoteEngine, PromissoryNote, PromissoryNoteSignature } from "../../modules/promissory-note";
import { LoanContract } from "../../types";

interface PromissoryNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  contracts: LoanContract[];
  initialContractNumber?: string;
  onOpenWhatsapp?: (phone: string, text: string) => void;
}

export default function PromissoryNoteModal({
  isOpen,
  onClose,
  contracts,
  initialContractNumber,
  onOpenWhatsapp
}: PromissoryNoteModalProps) {
  const [notes, setNotes] = useState<PromissoryNote[]>(PromissoryNoteEngine.getAllNotes());
  const [selectedNoteNumber, setSelectedNoteNumber] = useState<string>(
    initialContractNumber ? ("PAGARE-" + initialContractNumber.replace("CTR-", "") + "-2026") : (notes[0]?.noteNumber || "PAGARE-CTR001-2026")
  );
  const [activeTab, setActiveTab] = useState<"DOCUMENT_VIEW" | "OTP_SIGNING_CONSOLE" | "QR_VERIFIER">("DOCUMENT_VIEW");

  // Estados de Firma OTP
  const [clientOtpInput, setClientOtpInput] = useState<string>("");
  const [guarantorOtpInput, setGuarantorOtpInput] = useState<string>("");
  const [successBanner, setSuccessBanner] = useState<string>("");

  
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

  let currentNote = notes.find(n => n.noteNumber === selectedNoteNumber);

  // Si no existe, crearlo al vuelo
  if (!currentNote && contracts.length > 0) {
    const targetContract = contracts.find(c => c.contractNumber === initialContractNumber) || contracts[0];
    currentNote = PromissoryNoteEngine.createPromissoryNote(targetContract);
  }

  const handleSignClientOTP = () => {
    if (!currentNote) return;
    const otpToUse = clientOtpInput || currentNote.clientSignature.otpCode;
    const res = PromissoryNoteEngine.signWithOTP(currentNote.id, "DEUDOR_PRINCIPAL", otpToUse);
    setNotes(PromissoryNoteEngine.getAllNotes());
    setSuccessBanner(res.message);
    setTimeout(() => setSuccessBanner(""), 3500);
  };

  const handleSignGuarantorOTP = () => {
    if (!currentNote) return;
    const otpToUse = guarantorOtpInput || currentNote.guarantorSignature.otpCode;
    const res = PromissoryNoteEngine.signWithOTP(currentNote.id, "FIADOR_SOLIDARIO", otpToUse);
    setNotes(PromissoryNoteEngine.getAllNotes());
    setSuccessBanner(res.message);
    setTimeout(() => setSuccessBanner(""), 3500);
  };

  const handleDownloadText = () => {
    if (!currentNote) return;
    const text = PromissoryNoteEngine.generatePromissoryNoteLegalText(currentNote);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = currentNote.noteNumber + ".txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-2xl border border-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Pagarés Mercantiles Electrónicos & Firma OTP / QR</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-2 py-0.2 rounded-full font-mono">
                  CÓDIGO COMERCIO ART. 486
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Título ejecutivo mercantil autónomo, token OTP al teléfono del fiador y código QR notarial
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
            { id: "DOCUMENT_VIEW", label: "Texto Legal del Pagaré Mercantil", icon: FileText },
            { id: "OTP_SIGNING_CONSOLE", label: "Consola de Firma Digital OTP", icon: KeyRound },
            { id: "QR_VERIFIER", label: "Verificación QR & Peritaje Jurídico Digital", icon: QrCode }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={"px-4 py-2 font-semibold transition flex items-center space-x-2 border-b-2 cursor-pointer " + (
                  isActive 
                    ? "border-emerald-500 text-emerald-700 dark:text-emerald-400" 
                    : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENIDO MODAL */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Banner de Éxito */}
          {successBanner && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
              <span>{successBanner}</span>
            </div>
          )}

          {/* Selector de Pagaré */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
            <div className="flex items-center space-x-3">
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">Seleccionar Título Valor:</span>
              <select
                value={selectedNoteNumber}
                onChange={e => setSelectedNoteNumber(e.target.value)}
                className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-mono"
              >
                {contracts.map(c => {
                  const num = "PAGARE-" + c.contractNumber.replace("CTR-", "") + "-2026";
                  return (
                    <option key={c.id} value={num}>
                      {num + " - " + c.clientName + " ($" + c.totalOutstandingUSD + " USD)"}
                    </option>
                  );
                })}
              </select>
            </div>

            {currentNote && (
              <div className="flex items-center space-x-2">
                <span className={"text-[10px] px-2.5 py-1 rounded-full font-bold uppercase " + (
                  currentNote.status === "SIGNED_AND_ACTIVE" 
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                )}>
                  ● {currentNote.status.replace(/_/g, " ")}
                </span>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* PESTAÑA 1: VISTA DE TEXTO LEGAL DEL PAGARÉ                                */}
          {/* ========================================================================= */}
          {activeTab === "DOCUMENT_VIEW" && currentNote && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Título Ejecutivo Mercantil Autónomo</h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                    N° {currentNote.noteNumber} • Beneficiario: {currentNote.legalEntityBeneficiary} ({currentNote.beneficiaryRif})
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDownloadText}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span>Descargar Pagaré (.TXT)</span>
                  </button>
                </div>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-slate-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed overflow-y-auto">
                {PromissoryNoteEngine.generatePromissoryNoteLegalText(currentNote)}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PESTAÑA 2: CONSOLA DE FIRMA DIGITAL OTP                                   */}
          {/* ========================================================================= */}
          {activeTab === "OTP_SIGNING_CONSOLE" && currentNote && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. DEUDOR PRINCIPAL */}
                <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">1. Firma Deudor Principal</h4>
                    </div>
                    <span className={"text-[10px] px-2 py-0.5 rounded-full font-bold " + (
                      currentNote.clientSignature.isSigned ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    )}>
                      {currentNote.clientSignature.isSigned ? "✓ FIRMADO" : "PENDIENTE"}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-mono">
                    <p>Nombre: <strong className="text-zinc-900 dark:text-zinc-100 font-sans">{currentNote.clientSignature.name}</strong></p>
                    <p className="text-slate-700 dark:text-zinc-300">C.I.: <strong className="text-slate-900 dark:text-zinc-100">{currentNote.clientSignature.docId}</strong></p>
                    <p>Teléfono: <span className="text-zinc-600 dark:text-zinc-400">{currentNote.clientSignature.phone}</span></p>
                    <p>Código OTP Generado: <strong className="text-amber-700 dark:text-amber-400 font-bold">{currentNote.clientSignature.otpCode}</strong></p>
                  </div>

                  {currentNote.clientSignature.isSigned ? (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-1 text-[11px] font-mono text-emerald-800 dark:text-emerald-300">
                      <p>Fecha Firma: {currentNote.clientSignature.signedAt}</p>
                      <p className="truncate">Hash: {currentNote.clientSignature.signatureHash}</p>
                      <p>IP: {currentNote.clientSignature.ipAddress}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2">
                      <input
                        type="text"
                        placeholder="Ingresar OTP de 6 dígitos..."
                        value={clientOtpInput}
                        onChange={e => setClientOtpInput(e.target.value)}
                        className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs text-center"
                      />
                      <button
                        onClick={handleSignClientOTP}
                        className="w-full p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Validar Token OTP & Estampar Firma Deudor</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. FIADOR SOLIDARIO */}
                <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">2. Firma Fiador Solidario</h4>
                    </div>
                    <span className={"text-[10px] px-2 py-0.5 rounded-full font-bold " + (
                      currentNote.guarantorSignature.isSigned ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    )}>
                      {currentNote.guarantorSignature.isSigned ? "✓ FIRMADO" : "PENDIENTE"}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-mono">
                    <p>Fiador: <strong className="text-zinc-900 dark:text-zinc-100 font-sans">{currentNote.guarantorSignature.name}</strong></p>
                    <p className="text-slate-700 dark:text-zinc-300">C.I.: <strong className="text-slate-900 dark:text-zinc-100">{currentNote.guarantorSignature.docId}</strong></p>
                    <p>Teléfono: <span className="text-zinc-600 dark:text-zinc-400">{currentNote.guarantorSignature.phone}</span></p>
                    <p>Código OTP Generado: <strong className="text-amber-700 dark:text-amber-400 font-bold">{currentNote.guarantorSignature.otpCode}</strong></p>
                  </div>

                  {currentNote.guarantorSignature.isSigned ? (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-1 text-[11px] font-mono text-emerald-800 dark:text-emerald-300">
                      <p>Fecha Firma: {currentNote.guarantorSignature.signedAt}</p>
                      <p className="truncate">Hash: {currentNote.guarantorSignature.signatureHash}</p>
                      <p>IP: {currentNote.guarantorSignature.ipAddress}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2">
                      <input
                        type="text"
                        placeholder="Ingresar OTP de 6 dígitos..."
                        value={guarantorOtpInput}
                        onChange={e => setGuarantorOtpInput(e.target.value)}
                        className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs text-center"
                      />
                      <button
                        onClick={handleSignGuarantorOTP}
                        className="w-full p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Validar Token OTP & Estampar Aval Fiador</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* PESTAÑA 3: VERIFICACIÓN QR & PERITAJE                                     */}
          {/* ========================================================================= */}
          {activeTab === "QR_VERIFIER" && currentNote && (
            <div className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50 text-center space-y-4 max-w-md mx-auto">
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-3xl flex items-center justify-center shadow-2xl border border-zinc-200 dark:border-zinc-700">
                <QrCode className="w-32 h-32 text-zinc-950" />
              </div>

              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Código QR de Autenticidad Digital del Título</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono mt-1">{currentNote.qrVerificationUrl}</p>
              </div>

              <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-slate-800 dark:text-zinc-200 space-y-1 text-left">
                <p>Pagaré: <strong className="text-emerald-700 dark:text-emerald-400">{currentNote.noteNumber}</strong></p>
                <p>Sello SHA-256: <span className="text-[10px] text-zinc-600 dark:text-zinc-400 break-all">{currentNote.sha256Seal}</span></p>
                <p>Estatus de Ejecución: <strong className="text-zinc-900 dark:text-zinc-100">{currentNote.status}</strong></p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
