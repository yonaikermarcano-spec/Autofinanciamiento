"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Smartphone,
  Check,
  UserCheck,
  Calendar,
  Lock,
  ExternalLink
} from "lucide-react";
import {
  SmartNotificationsEngine,
  ManualContactQueueItem,
  InAppNotification
} from "../../modules/smart-notifications";
import { LoanContract } from "../../types";

interface SmartCommunicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contracts: LoanContract[];
  bcvRate: number;
}

export default function SmartCommunicationsModal({
  isOpen,
  onClose,
  contracts,
  bcvRate
}: SmartCommunicationsModalProps) {
  const [activeTab, setActiveTab] = useState<"MANUAL_QUEUE" | "IN_APP_LOG" | "ANTI_BAN_POLICY">("MANUAL_QUEUE");
  const [queue, setQueue] = useState<ManualContactQueueItem[]>(() => SmartNotificationsEngine.getSmartContactQueue(contracts, bcvRate));
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

  const handleMarkContacted = (queueId: string) => {
    const result = SmartNotificationsEngine.registerManualContact(queueId, "Asesor de Cobranzas");
    setQueue(SmartNotificationsEngine.getSmartContactQueue(contracts, bcvRate));
    setSuccessBanner("¡Contacto registrado exitosamente con sello " + result.sha256Seal.slice(0, 16) + "...! No se volverá a duplicar el mensaje hoy.");
    setTimeout(() => setSuccessBanner(""), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Centro de Notificaciones In-App & Contacto Manual Anti-Spam</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded-full font-mono">
                  WHATSAPP 1-A-1 SEGURO
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">
                Notificaciones automáticas en la app del cliente y bandeja de contacto manual 1 a 1 por asesor
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
            { id: "MANUAL_QUEUE", label: "Cola de Contacto 1 a 1 (Asesores)", icon: Send, count: queue.filter(q => !q.isContactedToday).length },
            { id: "IN_APP_LOG", label: "Buzón In-App Automático (Cero Spam)", icon: Smartphone },
            { id: "ANTI_BAN_POLICY", label: "Protocolo Anti-Baneo Meta", icon: Shield }
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
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.2 rounded-full font-bold">
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* CONTENIDO MODAL */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Banner de Éxito */}
          {successBanner && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{successBanner}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. COLA DE CONTACTO 1 A 1 MANUAL POR ASESOR                              */}
          {/* ========================================================================= */}
          {activeTab === "MANUAL_QUEUE" && (
            <div className="space-y-4">
              
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-300 flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Gestión Humana Individual (Protección contra Spam y Baneo)</span>
                  </p>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 mt-0.5">
                    El asesor presiona el botón para abrir la conversación en WhatsApp con el mensaje oficial ya redactado. Al enviar, marca la casilla para evitar duplicados.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {queue.map(item => (
                  <div 
                    key={item.id}
                    className={"p-5 rounded-3xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs " + (
                      item.isContactedToday
                        ? "bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 opacity-70"
                        : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                    )}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-sans">{item.clientName}</span>
                        <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">#{item.contractNumber}</span>
                        <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.2 rounded font-mono font-bold">
                          {item.categoryLabel}
                        </span>
                        {item.isContactedToday && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.2 rounded font-mono font-bold flex items-center space-x-1">
                            <Check className="w-2.5 h-2.5" />
                            <span>CONTACTADO HOY</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 font-mono text-zinc-300">
                        <p>Vehículo: <strong className="text-zinc-900 dark:text-zinc-100 font-sans">{item.vehicleModel}</strong></p>
                        <p>Cuota: <strong className="text-emerald-400">{"$" + item.dueAmountUSD} USD</strong> (Bs. {item.dueAmountVES.toLocaleString()} BCV)</p>
                        <p>Vence: <strong className="text-amber-400">{item.dueDate}</strong></p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-sans text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 italic">
                        "{item.customMessageWa.replace(/\n/g, ' ')}"
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                      {/* Botón WhatsApp */}
                      <a
                        href={item.waDirectUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleMarkContacted(item.id)}
                        className="p-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center space-x-1.5 shadow-md shadow-emerald-950/50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Abrir WhatsApp (1-Clic)</span>
                      </a>

                      {!item.isContactedToday && (
                        <button
                          onClick={() => handleMarkContacted(item.id)}
                          className="p-2.5 px-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition cursor-pointer"
                        >
                          Marcar Contactado
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. BUZÓN IN-APP AUTOMÁTICO                                                */}
          {/* ========================================================================= */}
          {activeTab === "IN_APP_LOG" && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-950/20 border border-blue-500/30 rounded-2xl text-xs text-blue-300">
                <p className="font-bold flex items-center space-x-1.5">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span>Notificaciones In-App en el Portal del Cliente (Seguras & Automáticas)</span>
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 mt-1">
                  Los avisos automáticos de cuotas por vencer, confirmaciones de pagos y revisiones de taller se entregan en el buzón dentro de la app móvil del cliente. No generan ningún riesgo de bloqueo en WhatsApp.
                </p>
              </div>

              <div className="space-y-3">
                {SmartNotificationsEngine.getInAppNotifications("CTR-2026-001").map(notif => (
                  <div key={notif.id} className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 font-sans">{notif.title}</span>
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">{notif.createdAt}</span>
                    </div>
                    <p className="text-zinc-300 text-xs font-sans">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. PROTOCOLO ANTI-BANEO DE WHATSAPP                                       */}
          {/* ========================================================================= */}
          {activeTab === "ANTI_BAN_POLICY" && (
            <div className="p-6 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs text-zinc-300">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Protocolo de Protección Anti-Baneo de Cuentas de WhatsApp</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <strong className="text-emerald-400 block">✅ Buenas Prácticas Implementadas:</strong>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">
                    <li>Envío 1 a 1 iniciado por clic manual del asesor.</li>
                    <li>Plantillas personalizadas con el nombre y datos exactos del cliente.</li>
                    <li>Uso de la app oficial del cliente para notificaciones recurrentes.</li>
                    <li>Registro de bitácora para evitar reenvíos en el mismo día.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-1.5">
                  <strong className="text-red-400 block">❌ Lo que el Sistema Bloquea por Seguridad:</strong>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">
                    <li>Bots de difusión masiva automatizada no oficial (evita reportes como Spam).</li>
                    <li>Mensajes idénticos repetitivos sin datos variables.</li>
                    <li>Envío fuera de horarios comerciales recomendados.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
