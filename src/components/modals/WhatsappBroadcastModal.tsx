"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  Smartphone, 
  Copy, 
  Check, 
  Clock, 
  ExternalLink,
  Search,
  Filter,
  ShieldCheck,
  Calendar,
  DollarSign,
  User,
  Bike,
  Sparkles,
  History
} from "lucide-react";
import { LoanContract } from "../../types";
import { WhatsappNotificationEngine, NotificationTemplateType, NotificationLog } from "../../modules/whatsapp-notifications";
import { BcvEngine } from "../../modules/bcv-engine";

interface WhatsappBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  contracts: LoanContract[];
  initialContract?: LoanContract | null;
  initialTemplate?: NotificationTemplateType;
  bcvRate: number;
}

export default function WhatsappBroadcastModal({
  isOpen,
  onClose,
  contracts,
  initialContract,
  initialTemplate = "PREVENTIVE_3_DAYS",
  bcvRate
}: WhatsappBroadcastModalProps) {
  const [selectedContractId, setSelectedContractId] = useState<string>(
    initialContract?.id || contracts[0]?.id || ""
  );
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplateType>(initialTemplate);
  const [activeTab, setActiveTab] = useState<"BROADCAST" | "TEMPLATES" | "LOGS">("BROADCAST");
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<NotificationLog[]>(WhatsappNotificationEngine.getLogs());
  const [searchTerm, setSearchTerm] = useState("");

  
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

  const currentContract = contracts.find(c => c.id === selectedContractId) || initialContract || contracts[0];

  const generatedMessage = currentContract 
    ? WhatsappNotificationEngine.generateMessage(selectedTemplate, currentContract, {}, bcvRate)
    : "";

  const whatsappUrl = currentContract 
    ? WhatsappNotificationEngine.getWhatsAppLink(currentContract.clientPhone, generatedMessage)
    : "#";

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDispatch = () => {
    if (!currentContract) return;

    const newLog = WhatsappNotificationEngine.logNotification({
      contractNumber: currentContract.contractNumber,
      clientName: currentContract.clientName,
      clientPhone: currentContract.clientPhone,
      templateType: selectedTemplate,
      messageText: generatedMessage,
      status: "SENT"
    });

    setLogs(WhatsappNotificationEngine.getLogs());

    // Abrir WhatsApp en pestaña nueva
    window.open(whatsappUrl, "_blank");
  };

  const templatesList = Object.values(WhatsappNotificationEngine.TEMPLATES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Centro de Mensajería & WhatsApp Automático</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.2 rounded-full font-mono">
                  VE V2.0
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">
                Disparo de recordatorios de cuotas, alertas de mora y confirmaciones de pago
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas Internas */}
        <div className="flex items-center space-x-1 px-6 pt-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-xs">
          {[
            { id: "BROADCAST", label: "Enviar Mensaje Directo", icon: Send },
            { id: "TEMPLATES", label: "Gestor de Plantillas (7)", icon: Sparkles },
            { id: "LOGS", label: "Bitácora de Envíos", icon: History }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={"px-4 py-2 font-semibold transition flex items-center space-x-2 border-b-2 " + (
                  isActive 
                    ? "border-emerald-500 text-emerald-400" 
                    : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-200"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENIDO DE LA PESTAÑA */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* ========================================================================= */}
          {/* PESTAÑA 1: ENVIAR MENSAJE DIRECTO / BATCH                                 */}
          {/* ========================================================================= */}
          {activeTab === "BROADCAST" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Selector de Cliente y Plantilla */}
              <div className="lg:col-span-5 space-y-4 text-xs">
                
                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-semibold block mb-1.5">
                    1. Seleccionar Cliente / Contrato
                  </label>
                  <select
                    value={selectedContractId}
                    onChange={e => setSelectedContractId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                  >
                    {contracts.map(c => (
                      <option key={c.id} value={c.id}>
                        {"#" + c.contractNumber + " - " + c.clientName + " (" + c.clientPhone + ")"}
                      </option>
                    ))}
                  </select>
                </div>

                {currentContract && (
                  <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-1.5 text-xs font-mono">
                    <p className="text-zinc-300 font-bold">{currentContract.clientName}</p>
                    <p className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 text-[11px]">{"Tlf: " + currentContract.clientPhone + " • CI: " + currentContract.clientDocId}</p>
                    <p className="text-emerald-400 text-[11px]">{"Vehículo: " + (currentContract.vehicle?.brand || "") + " " + (currentContract.vehicle?.model || "")}</p>
                    <p className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 text-[11px]">{"Deuda: $" + currentContract.totalOutstandingUSD + " USD • Estatus: " + currentContract.deliveryStatus}</p>
                  </div>
                )}

                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-semibold block mb-1.5">
                    2. Seleccionar Plantilla de Mensaje
                  </label>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {templatesList.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTemplate(t.id)}
                        className={"w-full text-left p-2.5 rounded-lg border transition cursor-pointer flex items-center justify-between " + (
                          selectedTemplate === t.id 
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" 
                            : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-300 hover:bg-zinc-800/60"
                        )}
                      >
                        <div>
                          <p className="font-semibold text-xs">{t.title}</p>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase">{t.category}</span>
                        </div>
                        {selectedTemplate === t.id && <Check className="w-4 h-4 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Vista Previa del Mensaje (WhatsApp Simulator) */}
              <div className="lg:col-span-7 space-y-4">
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Vista Previa del Mensaje en Vivo</span>
                  </span>

                  <button
                    onClick={handleCopyMessage}
                    className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 flex items-center space-x-1 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "¡Copiado!" : "Copiar Texto"}</span>
                  </button>
                </div>

                {/* Burbuja WhatsApp */}
                <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-inner relative">
                  <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <span>Destinatario: <strong className="text-zinc-300">{currentContract?.clientPhone}</strong></span>
                    <span>Tasa Aplicada: Bs. {bcvRate.toFixed(2)}</span>
                  </div>

                  <div className="bg-[#0b291d] border border-emerald-500/20 rounded-2xl p-4 text-xs text-emerald-100 whitespace-pre-wrap font-sans leading-relaxed shadow-sm">
                    {generatedMessage}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-600 dark:text-zinc-400">
                    <span>Variables Dinámicas Reemplazadas al 100%</span>
                    <span>Formato Oficial VE</span>
                  </div>
                </div>

                {/* Botón de Disparo */}
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={handleDispatch}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold p-3 rounded-2xl transition flex items-center justify-center space-x-2 text-xs shadow-lg shadow-emerald-950/50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Abrir & Despachar por WhatsApp (wa.me)</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* PESTAÑA 2: GESTOR DE LAS 7 PLANTILLAS                                     */}
          {/* ========================================================================= */}
          {activeTab === "TEMPLATES" && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">
                Estas plantillas se disparan automáticamente según el ciclo de vida del financiamiento o de forma manual por el operador:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templatesList.map(t => (
                  <div 
                    key={t.id}
                    className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">{t.title}</span>
                      <span className={"text-[10px] px-2 py-0.5 rounded-full font-semibold " + (
                        t.category === "PREVENTIVO" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        t.category === "COBRANZA" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                        t.category === "LEGAL" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      )}>
                        {t.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">{t.description}</p>
                    <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-300 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {t.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PESTAÑA 3: BITÁCORA DE ENVÍOS & AUDITORÍA                                 */}
          {/* ========================================================================= */}
          {activeTab === "LOGS" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">Total Mensajes Registrados: {logs.length}</span>
                <span className="text-[11px] text-emerald-400 font-mono">● Registro Criptográfico SHA-256</span>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 uppercase font-semibold">
                    <tr>
                      <th className="p-3">ID / Fecha</th>
                      <th className="p-3">Contrato & Cliente</th>
                      <th className="p-3">Plantilla</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 text-right">Sello Criptográfico</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-white dark:bg-zinc-900/40">
                        <td className="p-3">
                          <p className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">{log.id}</p>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">{log.sentAt}</span>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-zinc-200">{log.clientName}</p>
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">{"#" + log.contractNumber + " • " + log.clientPhone}</p>
                        </td>
                        <td className="p-3">
                          <span className="text-zinc-300 font-medium">{log.templateType}</span>
                        </td>
                        <td className="p-3">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            ● {log.status}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">
                          {log.sha256Seal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
