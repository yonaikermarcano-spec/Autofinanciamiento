"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Check,
  Send,
  Zap,
  Building,
  DollarSign,
  Clock,
  ShieldCheck,
  Radio,
  FileCheck,
  UserCheck,
  ExternalLink,
  QrCode,
  Copy,
  Download,
  Settings,
  HelpCircle,
  Play
} from "lucide-react";
import { BankPushEngine, BankPushNotification, ClientPaymentAttempt } from "../../modules/bank-push";

interface BankPushReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentApproved?: () => void;
}

export default function BankPushReconciliationModal({
  isOpen,
  onClose,
  onPaymentApproved
}: BankPushReconciliationModalProps) {
  const [notifications, setNotifications] = useState<BankPushNotification[]>(BankPushEngine.getAllPushNotifications());
  const [attempts, setAttempts] = useState<ClientPaymentAttempt[]>(BankPushEngine.getAllPaymentAttempts());
  const [activeTab, setActiveTab] = useState<"SETUP_GUIDE" | "LIVE_STREAM" | "HUMAN_REVIEW_INBOX" | "COMPANY_ACCOUNTS">("SETUP_GUIDE");

  // Simulador de Push Entrante
  const [customPushInput, setCustomPushInput] = useState<string>("");
  const [selectedReviewAttempt, setSelectedReviewAttempt] = useState<ClientPaymentAttempt | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState<string>("Verificado en cuenta bancaria corporativa");
  const [successBanner, setSuccessBanner] = useState<string>("");
  const [copiedWebhook, setCopiedWebhook] = useState<boolean>(false);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [connectionTestSuccess, setConnectionTestSuccess] = useState<boolean>(false);

  
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

  const pendingReviewsCount = attempts.filter(a => a.status === "PENDING_HUMAN_REVIEW").length;
  const webhookUrl = typeof window !== 'undefined' ? (window.location.origin + "/api/bank-push/webhook") : "https://autolending.os/api/bank-push/webhook";

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2500);
  };

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    setTimeout(() => {
      setIsTestingConnection(false);
      setConnectionTestSuccess(true);
      const testPush = BankPushEngine.parseRawPushNotification(
        "BDV: Ha recibido un Pago Movil de PRUEBA CONEXION por Bs. 100,00. Ref: TEST" + Math.floor(1000 + Math.random() * 9000) + ". " + new Date().toLocaleTimeString()
      );
      setNotifications(BankPushEngine.getAllPushNotifications());
      setTimeout(() => setConnectionTestSuccess(false), 4000);
    }, 1500);
  };

  const handleSimulateIncomingPush = () => {
    const raw = customPushInput.trim() || "BDV: Ha recibido un Pago Movil de MARCOS DIAZ por Bs. 2.342,50. Ref: 9948201. " + new Date().toLocaleTimeString();
    const created = BankPushEngine.parseRawPushNotification(raw);
    setNotifications(BankPushEngine.getAllPushNotifications());
    setCustomPushInput("");
    setSuccessBanner("¡Notificación Push bancaria recibida y parseada en vivo: Ref " + created.referenceNumber + " por Bs. " + created.amountVES + "!");
    setTimeout(() => setSuccessBanner(""), 3500);
  };

  const handleApproveReview = (attemptId: string) => {
    BankPushEngine.approveHumanReview(attemptId, "Cajero Principal", reviewerNotes);
    setAttempts(BankPushEngine.getAllPaymentAttempts());
    setSelectedReviewAttempt(null);
    setSuccessBanner("¡Pago aprobado manualmente con éxito! Se ha actualizado el contrato del cliente.");
    if (onPaymentApproved) onPaymentApproved();
    setTimeout(() => setSuccessBanner(""), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Receptor Push Bancario & Pagos Móviles (Estilo Cashea)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded-full font-mono">
                  BDV / BANESCO / MERCANTIL
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">
                Escucha automática de notificaciones push del teléfono corporativo y bandeja de revisión humana
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
            { id: "SETUP_GUIDE", label: "⚙️ Guía de Auto-Configuración (2 Min)", icon: Settings },
            { id: "LIVE_STREAM", label: "Feed en Vivo de Notificaciones Push", icon: Radio, count: notifications.length },
            { id: "HUMAN_REVIEW_INBOX", label: "Bandeja de Revisión Manual", icon: AlertTriangle, count: pendingReviewsCount },
            { id: "COMPANY_ACCOUNTS", label: "Cuentas de Recaudación Pago Móvil", icon: Building }
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
                  <span className={"text-[10px] font-mono px-1.5 py-0.2 rounded-full " + (
                    t.id === "HUMAN_REVIEW_INBOX" && pendingReviewsCount > 0
                      ? "bg-amber-500/20 text-amber-400 font-bold"
                      : "bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  )}>
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
          {/* 0. GUÍA DE AUTO-CONFIGURACIÓN EN 3 PASOS PARA EL USUARIO                  */}
          {/* ========================================================================= */}
          {activeTab === "SETUP_GUIDE" && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  <span>¿Cómo conectar el celular de la empresa con AutoLending OS?</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  No necesitas programar nada ni entregar tus claves bancarias. Sigue estos <strong>3 sencillos pasos</strong> en el teléfono Android corporativo donde tienes instaladas las apps del <strong>Banco de Venezuela, Banesco o Mercantil</strong> para que las notificaciones de Pago Móvil se sincronicen en tiempo real:
                </p>
              </div>

              {/* Grid de 3 Pasos Ilustrados */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* PASO 1 */}
                <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-xs font-mono">
                      1
                    </div>
                    <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Descargar App de Reenvío en el Celular</h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Instala gratis en el teléfono Android corporativo la app oficial <strong>MacroDroid</strong> o <strong>Notification Forwarder</strong> desde Google Play Store.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <a
                      href="https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full p-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-zinc-900 dark:text-zinc-100 font-bold text-[11px] transition flex items-center justify-center space-x-1.5 shadow-sm block text-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5 inline" />
                      <span>Descargar MacroDroid (Play Store)</span>
                    </a>
                  </div>
                </div>

                {/* PASO 2 */}
                <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold flex items-center justify-center text-xs font-mono">
                      2
                    </div>
                    <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Copiar la URL Webhook de tu Sistema</h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Esta es la dirección privada y segura donde tu teléfono enviará el texto de las notificaciones push en segundo plano.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 truncate">
                      {webhookUrl}
                    </div>
                    <button
                      onClick={handleCopyWebhook}
                      className="w-full p-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-[11px] transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedWebhook ? "¡URL Copiada al Portapapeles!" : "Copiar URL del Webhook"}</span>
                    </button>
                  </div>
                </div>

                {/* PASO 3 */}
                <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-xs font-mono">
                      3
                    </div>
                    <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Crear la Regla de Reenvío en 1 Minuto</h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      En MacroDroid crea una regla con:
                      <br />• <strong>Disparador:</strong> Notificación de BDV / Banesco / Mercantil.
                      <br />• <strong>Acción:</strong> HTTP Request (POST) a la URL copiada.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleTestConnection}
                      disabled={isTestingConnection}
                      className={"w-full p-2.5 rounded-lg font-bold text-[11px] transition flex items-center justify-center space-x-1.5 cursor-pointer " + (
                        connectionTestSuccess
                          ? "bg-emerald-600 text-zinc-900 dark:text-zinc-100"
                          : "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30"
                      )}
                    >
                      {isTestingConnection ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Comprobando Conexión...</span>
                        </>
                      ) : connectionTestSuccess ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                          <span>¡Conexión Exitosa (Push de Prueba Recibido)!</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Probar Conexión en Vivo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

              {/* Tarjeta de Seguridad y Privacidad */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-start space-x-3 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100">100% Seguro y No Invasivo</h5>
                  <p className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 text-[11px]">
                    La app de reenvío no tiene acceso a tus cuentas bancarias, contraseñas ni dinero. Solo lee el texto emergente que el banco muestra en la barra superior de notificaciones cuando entra un pago y se lo envía a tu ERP para que tus clientes disfruten de validación instantánea estilo Cashea.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. FEED EN VIVO DE NOTIFICACIONES PUSH                                    */}
          {/* ========================================================================= */}
          {activeTab === "LIVE_STREAM" && (
            <div className="space-y-4">
              
              {/* Caja de Ingesta Rápida / Simulación */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Receptor Push / Inyector de Alertas SMS</h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">Pega el texto copiado de la app bancaria o simula una alerta push entrante en vivo.</p>
                  </div>

                  <button
                    onClick={handleSimulateIncomingPush}
                    className="p-2 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>+ Recibir Push en Vivo</span>
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Ej: BDV: Ha recibido un Pago Movil de CARLOS PEREZ por Bs. 1.850,00. Ref: 884920. 25/08/2026..."
                  value={customPushInput}
                  onChange={e => setCustomPushInput(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                />
              </div>

              {/* Lista de Notificaciones Push */}
              <div className="space-y-2.5">
                {notifications.map(notif => {
                  const isAuto = notif.status === "MATCHED_AUTO";

                  return (
                    <div 
                      key={notif.id}
                      className={"p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 " + (
                        isAuto 
                          ? "bg-emerald-950/20 border-emerald-500/40" 
                          : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                            {notif.provider.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs font-mono font-black text-emerald-400">
                            Bs. {notif.amountVES.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">
                            Ref: <strong className="text-zinc-900 dark:text-zinc-100">{notif.referenceNumber}</strong>
                          </span>
                        </div>

                        <p className="text-xs text-zinc-300 font-mono line-clamp-1">
                          {notif.rawText}
                        </p>

                        {notif.matchedClientName && (
                          <span className="text-[10px] text-emerald-400 font-sans block">
                            ✓ Auto-Conciliado con: {notif.matchedClientName} (#{notif.matchedContractNumber})
                          </span>
                        )}
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className={"text-[10px] px-2.5 py-1 rounded-full font-bold uppercase " + (
                          isAuto ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        )}>
                          ● {isAuto ? "MATCH AUTO (CASHEA)" : "DISPONIBLE EN BANCO"}
                        </span>
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono block mt-1">
                          {notif.receivedAt}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. BANDEJA DE REVISIÓN MANUAL HUMANA                                     */}
          {/* ========================================================================= */}
          {activeTab === "HUMAN_REVIEW_INBOX" && (
            <div className="space-y-4">
              
              <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-amber-300 text-xs">
                <p className="font-bold flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Pagos Reportados por Clientes en Espera de Confirmación Humana</span>
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 mt-1">
                  Estos pagos fueron reportados desde la App del Cliente pero la red bancaria presentó retraso en la notificación push. Revisa tu cuenta y aprueba con 1 clic para dar tranquilidad al cliente.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-semibold uppercase">
                    <tr>
                      <th className="p-3">Ticket / Cliente</th>
                      <th className="p-3">Banco & Teléfono</th>
                      <th className="p-3">Referencia</th>
                      <th className="p-3">Monto Reportado</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850 font-mono text-[11px]">
                    {attempts.map(att => (
                      <tr key={att.id} className="hover:bg-white dark:bg-zinc-900/40">
                        <td className="p-3">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{att.id}</p>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-sans">{att.clientName} (#{att.contractNumber})</span>
                        </td>
                        <td className="p-3 font-sans text-zinc-200">
                          <p>{att.originBank}</p>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">{att.senderPhone}</span>
                        </td>
                        <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">
                          {att.referenceNumber}
                        </td>
                        <td className="p-3 font-bold text-emerald-400">
                          Bs. {att.reportedAmountVES.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span className={"text-[10px] px-2 py-0.5 rounded-full font-bold " + (
                            att.status === "VALIDATED_INSTANT" ? "bg-emerald-500/10 text-emerald-400" :
                            att.status === "APPROVED_MANUAL" ? "bg-blue-500/10 text-blue-400" :
                            "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                          )}>
                            ● {att.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {att.status === "PENDING_HUMAN_REVIEW" ? (
                            <button
                              onClick={() => setSelectedReviewAttempt(att)}
                              className="p-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs transition cursor-pointer"
                            >
                              Revisar & Aprobar
                            </button>
                          ) : (
                            <span className="text-[10px] text-zinc-600 dark:text-zinc-400">✓ Completado</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. CUENTAS BANCARIAS DE RECAUDACIÓN                                       */}
          {/* ========================================================================= */}
          {activeTab === "COMPANY_ACCOUNTS" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BankPushEngine.COMPANY_PAYMENT_ACCOUNTS.map((acc, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{acc.bankName}</h4>
                    {acc.isPrimary && (
                      <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                        PRINCIPAL
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs font-mono text-zinc-300">
                    <p>Teléfono Pago Móvil: <strong className="text-emerald-400">{acc.phone}</strong></p>
                    <p>RIF: <span className="text-zinc-200">{acc.rif}</span></p>
                    <p>Código Banco: <span className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">{acc.bankCode}</span></p>
                    <p>Titular: <span className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-sans">{acc.beneficiaryName}</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* MODAL DE APROBACIÓN MANUAL */}
        {selectedReviewAttempt && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs backdrop-blur-md animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] p-6 space-y-4 shadow-2xl text-zinc-900 dark:text-zinc-100 font-sans">
              
              <div className="flex items-center space-x-3 text-amber-400">
                <div className="p-2.5 bg-amber-500/20 rounded-2xl border border-amber-500/30">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Aprobación Manual de Pago</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">Ticket: #{selectedReviewAttempt.id}</p>
                </div>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs font-mono">
                <p>Cliente: <strong className="text-zinc-900 dark:text-zinc-100 font-sans">{selectedReviewAttempt.clientName}</strong></p>
                <p>Contrato: <span className="text-zinc-300">#{selectedReviewAttempt.contractNumber}</span></p>
                <p>Referencia Bancaria: <strong className="text-amber-400 font-bold">{selectedReviewAttempt.referenceNumber}</strong></p>
                <p>Monto en Bolívares: <strong className="text-emerald-400">Bs. {selectedReviewAttempt.reportedAmountVES.toLocaleString()}</strong></p>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-zinc-700 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block">Nota del Cajero / Verificador:</label>
                <input
                  type="text"
                  value={reviewerNotes}
                  onChange={e => setReviewerNotes(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs font-sans"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => setSelectedReviewAttempt(null)}
                  className="flex-1 p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => handleApproveReview(selectedReviewAttempt.id)}
                  className="flex-1 p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-950/50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aprobar Pago y Notificar</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
