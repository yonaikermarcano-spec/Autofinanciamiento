"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  Download,
  Check,
  Clock,
  DollarSign,
  FolderLock,
  FileCheck,
  UserCheck,
  Building,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Award
} from "lucide-react";
import {
  LegalDocumentationEngine,
  AlliedServiceOrder,
  ClientDocumentPhases,
  AlliedServiceItem
} from "../../modules/legal-documentation";

interface LegalDocsAndAlliedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LegalDocsAndAlliedModal({
  isOpen,
  onClose
}: LegalDocsAndAlliedModalProps) {
  const [orders, setOrders] = useState<AlliedServiceOrder[]>(LegalDocumentationEngine.getAllAlliedOrders());
  const [clientPhasesList, setClientPhasesList] = useState<ClientDocumentPhases[]>(LegalDocumentationEngine.getAllClientPhases());
  const [selectedContractNumber, setSelectedContractNumber] = useState<string>(clientPhasesList[0]?.contractNumber || "CTR-2026-001");
  const [activeTab, setActiveTab] = useState<"3_PHASES" | "ALLIED_ORDERS" | "FINANCIER_COMMISSIONS">("3_PHASES");

  // Orden para enviar al aliado
  const [payingOrder, setPayingOrder] = useState<AlliedServiceOrder | null>(null);
  const [paymentRefInput, setPaymentRefInput] = useState<string>("");
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

  const currentClientPhase = clientPhasesList.find(p => p.contractNumber === selectedContractNumber) || clientPhasesList[0];
  const commissionsSummary = LegalDocumentationEngine.getAccumulatedFinancierProfitUSD();

  const handleVerifyPayment = (orderId: string) => {
    LegalDocumentationEngine.verifyPaymentByFinancier(orderId);
    setOrders(LegalDocumentationEngine.getAllAlliedOrders());
    setSuccessBanner("¡Pago de la orden verificado! Ya puedes solicitar la emisión al Aliado.");
    setTimeout(() => setSuccessBanner(""), 3500);
  };

  const handleConfirmSentToPartner = () => {
    if (!payingOrder || !paymentRefInput.trim()) return;

    LegalDocumentationEngine.markSentToPartner(payingOrder.id, paymentRefInput.trim());
    setOrders(LegalDocumentationEngine.getAllAlliedOrders());
    setPayingOrder(null);
    setPaymentRefInput("");
    setSuccessBanner("¡Pedido registrado como enviado al Aliado con Ref: " + paymentRefInput + "!");
    setTimeout(() => setSuccessBanner(""), 3500);
  };

  const handleUpdateStatus = (orderId: string, status: 'LISTO_PARA_RETIRO' | 'ENTREGADO_A_CLIENTE') => {
    LegalDocumentationEngine.markReadyOrDelivered(orderId, status);
    setOrders(LegalDocumentationEngine.getAllAlliedOrders());
    setSuccessBanner("¡Estado actualizado con éxito: " + status.replace(/_/g, ' ') + "!");
    setTimeout(() => setSuccessBanner(""), 3500);
  };

  const handleToggleDoc = (phase: 'phase1' | 'phase2' | 'phase3', key: string, value: boolean) => {
    if (!currentClientPhase) return;

    const updated = {
      ...currentClientPhase,
      [phase]: {
        ...(currentClientPhase as any)[phase],
        [key]: value
      }
    };

    // Reevaluar completitud
    if (phase === 'phase1') {
      const p1 = updated.phase1;
      p1.isCompleted = p1.driverLicense.hasLicense && p1.rcvInitialDelivered && p1.medicalCertificateValid && p1.originCertificateCopyStored && p1.reservationOfTitleContractSigned && p1.inttRegistrationProofIssued;
    } else if (phase === 'phase2') {
      const p2 = updated.phase2;
      p2.isCompleted = p2.circulationCertificateCopyDelivered && p2.circulationCertificateOriginalInVault;
    } else if (phase === 'phase3') {
      const p3 = updated.phase3;
      p3.isCompleted = p3.circulationCertificateOriginalDelivered && p3.settlementReleaseDocumentSigned && p3.finalInvoiceDelivered;
    }

    const saved = LegalDocumentationEngine.updatePhaseChecklist(currentClientPhase.contractNumber, updated);
    setClientPhasesList(LegalDocumentationEngine.getAllClientPhases());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-2xl border border-blue-500/20">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Trazabilidad Documental en 3 Fases & Servicios Aliados (RCV / Médico)</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-800 dark:text-blue-300 px-2 py-0.2 rounded-full font-mono">
                  RESERVA DE DOMINIO & INTT
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Custodia de títulos, entregas por fase, pedidos B2B al aliado y comisiones acumuladas del 10%
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
            { id: "3_PHASES", label: "Trazabilidad Documental en 3 Fases", icon: FileCheck },
            { id: "ALLIED_ORDERS", label: "Pedidos al Aliado (RCV / Médico)", icon: ShieldCheck, count: orders.length },
            { id: "FINANCIER_COMMISSIONS", label: "Comisiones Acumuladas (10% Financiadora)", icon: DollarSign, count: "$" + commissionsSummary.totalAccumulatedProfitUSD }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={"px-4 py-2 font-semibold transition flex items-center space-x-2 border-b-2 cursor-pointer " + (
                  isActive 
                    ? "border-blue-500 text-blue-700 dark:text-blue-400" 
                    : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
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
          
          {/* Banner de Éxito */}
          {successBanner && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
              <span>{successBanner}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. TRAZABILIDAD DOCUMENTAL EN 3 FASES                                    */}
          {/* ========================================================================= */}
          {activeTab === "3_PHASES" && (
            <div className="space-y-6">
              
              {/* Selector de Contrato / Cliente */}
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">Seleccionar Expediente de Cliente:</label>
                  <select
                    value={selectedContractNumber}
                    onChange={e => setSelectedContractNumber(e.target.value)}
                    className="p-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                  >
                    {clientPhasesList.map(c => (
                      <option key={c.contractNumber} value={c.contractNumber}>
                        {c.clientName} ({c.contractNumber} - C.I. {c.clientDocId})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold block">FASE DOCUMENTAL ACTUAL</span>
                  <span className={"text-xs font-black px-3 py-1 rounded-full border inline-block mt-0.5 " + (
                    currentClientPhase.currentPhase === 3 ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30" :
                    currentClientPhase.currentPhase === 2 ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30" :
                    "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30"
                  )}>
                    ● FASE {currentClientPhase.currentPhase}: {currentClientPhase.currentPhase === 1 ? "Entrega con Reserva de Dominio" : currentClientPhase.currentPhase === 2 ? "Certificado Circulación en Proceso" : "Finiquito & Liberación Total"}
                  </span>
                </div>
              </div>

              {/* Grid de las 3 Fases */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* FASE 1: ENTREGA INICIAL */}
                <div className={"p-5 rounded-3xl border space-y-4 " + (
                  currentClientPhase.phase1.isCompleted
                    ? "bg-emerald-950/20 border-emerald-500/30"
                    : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                )}>
                  <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-purple-700 dark:text-purple-400 font-bold uppercase">FASE 1</span>
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Entrega Inicial del Vehículo</h4>
                      <p className="text-[10px] text-zinc-600 dark:text-zinc-400">Cliente amortizando cuotas</p>
                    </div>
                    {currentClientPhase.phase1.isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />}
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* Licencia */}
                    <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">1. Licencia de Conducir (INTT)</span>
                        <span className="text-[9px] bg-blue-500/20 text-blue-800 dark:text-blue-300 px-1.5 py-0.2 rounded font-mono">
                          {currentClientPhase.phase1.driverLicense.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-600 dark:text-zinc-400">
                        {currentClientPhase.phase1.driverLicense.notes} (Responsabilidad del cliente).
                      </p>
                    </div>

                    <label className="flex items-center space-x-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={currentClientPhase.phase1.rcvInitialDelivered}
                        onChange={e => handleToggleDoc('phase1', 'rcvInitialDelivered', e.target.checked)}
                        className="rounded text-purple-500"
                      />
                      <span>2. Póliza RCV Vigente Entregada</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentClientPhase.phase1.medicalCertificateValid}
                        onChange={e => handleToggleDoc('phase1', 'medicalCertificateValid', e.target.checked)}
                        className="rounded text-purple-500"
                      />
                      <span>3. Certificado Médico Vial Vigente</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentClientPhase.phase1.originCertificateCopyStored}
                        onChange={e => handleToggleDoc('phase1', 'originCertificateCopyStored', e.target.checked)}
                        className="rounded text-purple-500"
                      />
                      <span>4. Copia Certificado de Origen (a nombre empresa)</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentClientPhase.phase1.reservationOfTitleContractSigned}
                        onChange={e => handleToggleDoc('phase1', 'reservationOfTitleContractSigned', e.target.checked)}
                        className="rounded text-purple-500"
                      />
                      <span>5. Venta con Reserva de Dominio Firmada</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentClientPhase.phase1.inttRegistrationProofIssued}
                        onChange={e => handleToggleDoc('phase1', 'inttRegistrationProofIssued', e.target.checked)}
                        className="rounded text-purple-500"
                      />
                      <span>6. Constancia Trámite INTT en Proceso</span>
                    </label>
                  </div>
                </div>

                {/* FASE 2: CERTIFICADO DE CIRCULACIÓN */}
                <div className={"p-5 rounded-3xl border space-y-4 " + (
                  currentClientPhase.phase2.isCompleted
                    ? "bg-blue-950/20 border-blue-500/30"
                    : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                )}>
                  <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-blue-700 dark:text-blue-400 font-bold uppercase">FASE 2</span>
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Certificado de Circulación INTT</h4>
                      <p className="text-[10px] text-zinc-600 dark:text-zinc-400">Título emitido con reserva</p>
                    </div>
                    {currentClientPhase.phase2.isCompleted && <CheckCircle2 className="w-5 h-5 text-blue-700 dark:text-blue-400" />}
                  </div>

                  <div className="space-y-3 text-xs">
                    <p className="text-[11px] text-slate-700 dark:text-zinc-300">
                      Cuando el INTT emite el Certificado de Registro, se entrega una copia al cliente para que circule y el original queda en custodia:
                    </p>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentClientPhase.phase2.circulationCertificateCopyDelivered}
                        onChange={e => handleToggleDoc('phase2', 'circulationCertificateCopyDelivered', e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">1. Copia Certificado Circulación Entregada al Cliente</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentClientPhase.phase2.circulationCertificateOriginalInVault}
                        onChange={e => handleToggleDoc('phase2', 'circulationCertificateOriginalInVault', e.target.checked)}
                        className="rounded text-blue-500"
                      />
                      <span className="font-semibold text-amber-700 dark:text-amber-400">2. Original Custodiado en Bóveda Financiadora</span>
                    </label>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                      Nro Registro INTT: <strong className="text-zinc-900 dark:text-zinc-100">{currentClientPhase.phase2.circulationRegistrationNumber || "En trámite"}</strong>
                    </div>
                  </div>
                </div>

                {/* FASE 3: FINIQUITO Y LIBERACIÓN TOTAL */}
                <div className={"p-5 rounded-3xl border space-y-4 " + (
                  currentClientPhase.phase3.isCompleted
                    ? "bg-emerald-950/20 border-emerald-500/30"
                    : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                )}>
                  <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">FASE 3</span>
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Finiquito & Liberación Total</h4>
                      <p className="text-[10px] text-zinc-600 dark:text-zinc-400">100% cuotas pagadas</p>
                    </div>
                    {currentClientPhase.phase3.isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />}
                  </div>

                  <div className="space-y-3 text-xs">
                    <p className="text-[11px] text-slate-700 dark:text-zinc-300">
                      Al culminar el pago total, se entrega la titularidad definitiva al cliente:
                    </p>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentClientPhase.phase3.circulationCertificateOriginalDelivered}
                        onChange={e => handleToggleDoc('phase3', 'circulationCertificateOriginalDelivered', e.target.checked)}
                        className="rounded text-emerald-500"
                      />
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">1. Original del Certificado de Circulación Entregado</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentClientPhase.phase3.settlementReleaseDocumentSigned}
                        onChange={e => handleToggleDoc('phase3', 'settlementReleaseDocumentSigned', e.target.checked)}
                        className="rounded text-emerald-500"
                      />
                      <span>2. Finiquito y Levantamiento de Reserva de Dominio</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentClientPhase.phase3.finalInvoiceDelivered}
                        onChange={e => handleToggleDoc('phase3', 'finalInvoiceDelivered', e.target.checked)}
                        className="rounded text-emerald-500"
                      />
                      <span>3. Factura Definitiva de Venta Entregada</span>
                    </label>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. PEDIDOS AL ALIADO B2B (RCV & CERTIFICADO MÉDICO)                       */}
          {/* ========================================================================= */}
          {activeTab === "ALLIED_ORDERS" && (
            <div className="space-y-4">
              
              <div className="p-4 bg-blue-950/20 border border-blue-500/30 rounded-2xl text-blue-800 dark:text-blue-300 text-xs">
                <p className="font-bold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  <span>Flujo de Pedido al Aliado B2B de RCV y Certificados Médicos</span>
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                  1. El cliente solicita y paga en oficina. • 2. La financiadora comprueba el pago y solicita el pedido al Aliado por WhatsApp. • 3. El Aliado emite y la financiadora entrega en oficina acumulando su 10% de ganancia.
                </p>
              </div>

              <div className="space-y-3">
                {orders.map(ord => {
                  const waUrl = LegalDocumentationEngine.generatePartnerWhatsAppUrl(ord);

                  return (
                    <div 
                      key={ord.id}
                      className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 font-sans">{ord.serviceName}</span>
                          <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">#{ord.id}</span>
                          <span className={"text-[9px] px-2 py-0.2 rounded font-bold " + (
                            ord.status === "ENTREGADO_A_CLIENTE" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20" :
                            ord.status === "LISTO_PARA_RETIRO" ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20" :
                            ord.status === "PEDIDO_ENVIADO_ALIADO_WA" ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20" :
                            "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 animate-pulse"
                          )}>
                            ● {ord.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 font-mono text-slate-700 dark:text-zinc-300">
                          <p>Cliente: <strong className="text-zinc-900 dark:text-zinc-100 font-sans">{ord.clientName}</strong> ({ord.clientDocId})</p>
                          <p>Precio: <strong className="text-emerald-700 dark:text-emerald-400">{"$" + ord.priceUSD} USD</strong></p>
                          <p>Ganancia Financiadora (10%): <strong className="text-amber-700 dark:text-amber-400">+{"$" + ord.financierProfitUSD} USD</strong></p>
                        </div>

                        <p className="text-zinc-600 dark:text-zinc-400 text-[11px] font-sans">
                          📅 Fecha de Retiro en Oficina Agendada: <strong className="text-zinc-900 dark:text-zinc-100">{ord.pickupDateScheduled}</strong>
                        </p>

                        {ord.partnerPaymentRef && (
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono block">
                            Ref Pago Aliado: {ord.partnerPaymentRef} • WhatsApp Enviado: {ord.partnerWhatsAppSentAt}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                        {/* Botón 1: Comprobar Pago */}
                        {ord.status === "SOLICITADO_CLIENTE" && (
                          <button
                            onClick={() => handleVerifyPayment(ord.id)}
                            className="p-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs transition cursor-pointer"
                          >
                            Comprobar Pago
                          </button>
                        )}

                        {/* Botón 2: Enviar al Aliado WhatsApp */}
                        {ord.status === "PAGO_COMPROBADO" && (
                          <div className="flex space-x-2">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
                            >
                              <Send className="w-3 h-3" />
                              <span>Pedir al Aliado WA</span>
                            </a>

                            <button
                              onClick={() => setPayingOrder(ord)}
                              className="p-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition cursor-pointer"
                            >
                              Registrar Pago Aliado
                            </button>
                          </div>
                        )}

                        {/* Botón 3: Marcar Listo para Retiro */}
                        {ord.status === "PEDIDO_ENVIADO_ALIADO_WA" && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, "LISTO_PARA_RETIRO")}
                            className="p-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition cursor-pointer"
                          >
                            ✓ Listo para Retiro
                          </button>
                        )}

                        {/* Botón 4: Entregar a Cliente */}
                        {ord.status === "LISTO_PARA_RETIRO" && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, "ENTREGADO_A_CLIENTE")}
                            className="p-2 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition cursor-pointer shadow-md"
                          >
                            ✓ Entregar a Cliente
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. COMISIONES ACUMULADAS DE LA FINANCIADORA (10%)                         */}
          {/* ========================================================================= */}
          {activeTab === "FINANCIER_COMMISSIONS" && (
            <div className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 space-y-1">
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase">GANANCIA ACUMULADA FINANCIADORA (10%)</span>
                  <p className="text-3xl font-black font-mono text-amber-700 dark:text-amber-400">{"$" + commissionsSummary.totalAccumulatedProfitUSD.toFixed(2)} USD</p>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400">Descuento a favor en factura de software</span>
                </div>

                <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-950/20 space-y-1">
                  <span className="text-[10px] text-blue-700 dark:text-blue-400 font-bold uppercase">TOTAL SERVICIOS VENDIDOS</span>
                  <p className="text-3xl font-black font-mono text-zinc-900 dark:text-zinc-100">{commissionsSummary.totalSalesCount}</p>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400">RCV & Certificados Médicos</span>
                </div>

                <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20 space-y-1">
                  <span className="text-[10px] text-purple-700 dark:text-purple-400 font-bold uppercase">GANANCIA PLATAFORMA (10%)</span>
                  <p className="text-3xl font-black font-mono text-purple-700 dark:text-purple-400">{"$" + commissionsSummary.totalPlatformProfitUSD.toFixed(2)} USD</p>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400">Modelo Aliado B2B</span>
                </div>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs text-slate-800 dark:text-zinc-200">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>¿Cómo funciona la liquidación y descuento mensual?</span>
                </h4>
                <p className="leading-relaxed">
                  Por cada RCV o Certificado Médico vendido a través del sistema, el Aliado otorga un <strong>20% de ganancia</strong>. La financiadora recibe un <strong>10% neto</strong>.
                  La financiadora le transfiere el monto al Aliado y el 10% acumulado (actualmente: <strong className="text-amber-700 dark:text-amber-400">{"$" + commissionsSummary.totalAccumulatedProfitUSD + " USD"}</strong>) se le descuenta automáticamente a la financiadora en su fecha de cobro mensual de la plataforma.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* MODAL REGISTRAR PAGO A ALIADO */}
        {payingOrder && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs backdrop-blur-md animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] p-6 space-y-4 shadow-2xl text-zinc-900 dark:text-zinc-100 font-sans text-xs">
              <div className="flex items-center space-x-3 text-purple-700 dark:text-purple-400">
                <div className="p-2.5 bg-purple-500/20 rounded-2xl">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Registrar Pago al Aliado B2B</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{payingOrder.serviceName} (#{payingOrder.id})</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-1 font-mono text-slate-800 dark:text-zinc-200">
                <p>Monto Total a Pagar al Aliado: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{"$" + payingOrder.priceUSD} USD</strong></p>
                <p>Ganancia Financiadora: <strong className="text-amber-700 dark:text-amber-400">+{"$" + payingOrder.financierProfitUSD} USD</strong></p>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">Número de Referencia de Pago Bancario al Aliado:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: TRF-BANESCO-9948201"
                  value={paymentRefInput}
                  onChange={e => setPaymentRefInput(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => setPayingOrder(null)}
                  className="flex-1 p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleConfirmSentToPartner}
                  disabled={!paymentRefInput.trim()}
                  className="flex-1 p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-purple-950/50"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirmar & Notificar</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
