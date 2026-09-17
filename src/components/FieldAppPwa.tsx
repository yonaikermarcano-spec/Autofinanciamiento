"use client";

import React, { useState } from "react";
import {
  Navigation,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  DollarSign,
  Smartphone,
  Send,
  Camera,
  ShieldAlert,
  ArrowLeft,
  Search,
  Bike,
  UserCheck,
  Radio,
  Clock,
  Key,
  FileText,
  Lock,
  MessageSquare,
  Check,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import { LoanContract } from "../types";
import { FieldAppEngine, HomeInspectionRecord, InspectionResult } from "../modules/field-app";
import { WhatsappNotificationEngine } from "../modules/whatsapp-notifications";
import { BcvEngine } from "../modules/bcv-engine";
import { toast } from "./common/GoogleSnackbar";

interface FieldAppPwaProps {
  contracts: LoanContract[];
  onBackToDashboard: () => void;
  bcvRate: number;
}

export default function FieldAppPwa({
  contracts,
  onBackToDashboard,
  bcvRate
}: FieldAppPwaProps) {
  const [activeTab, setActiveTab] = useState<"ROUTE" | "INSPECTION" | "COLLECTION" | "REPOSSESSION">("ROUTE");
  const [officerName, setOfficerName] = useState("Héctor Rodríguez (Oficial de Campo)");
  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0]?.id || "");
  const [searchFilter, setSearchFilter] = useState("");
  
  // Estado para Inspección
  const [housingType, setHousingType] = useState<"PROPIA" | "ALQUILADA" | "FAMILIAR">("PROPIA");
  const [housingCondition, setHousingCondition] = useState<"EXCELENTE" | "BUENA" | "REGULAR">("BUENA");
  const [guarantorVerified, setGuarantorVerified] = useState(true);
  const [incomeVerified, setIncomeVerified] = useState(true);
  const [inspectionDictamen, setInspectionDictamen] = useState<InspectionResult>("APROBADO_ENTREGA");
  const [inspectionNotes, setInspectionNotes] = useState("Vivienda propia verificada. Solvencia constatada.");
  const [inspectionsList, setInspectionsList] = useState<HomeInspectionRecord[]>(FieldAppEngine.getInspections());
  const [inspectionSuccessMsg, setInspectionSuccessMsg] = useState("");

  // Estado para Cobranza en Calle
  const [collectedAmountUSD, setCollectedAmountUSD] = useState(50);
  const [collectionMethod, setCollectionMethod] = useState<"CASH_USD" | "PAGO_MOVIL" | "BINANCE_USDT">("CASH_USD");
  const [collectionRef, setCollectionRef] = useState("REC-CAMPO-" + Date.now().toString().slice(-4));
  const [collectionSuccessMsg, setCollectionSuccessMsg] = useState("");

  // Estado para Retención Física
  const [currentKm, setCurrentKm] = useState(12450);
  const [keysRecovered, setKeysRecovered] = useState(true);
  const [repossessNotes, setRepossessNotes] = useState("Vehículo retenido sin resistencia. GPS activo. En custodia de patio central.");
  const [repossessSuccessMsg, setRepossessSuccessMsg] = useState("");

  const currentContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  // Filtrado de ruta de visitas
  const routeClients = contracts.filter(c => {
    if (searchFilter.trim()) {
      const term = searchFilter.toLowerCase();
      const match = 
        c.clientName.toLowerCase().includes(term) ||
        c.contractNumber.toLowerCase().includes(term) ||
        c.clientAddress.toLowerCase().includes(term);
      if (!match) return false;
    }
    return true;
  });

  const handleSaveInspection = () => {
    if (!currentContract) return;

    const newRecord = FieldAppEngine.recordInspection({
      contractNumber: currentContract.contractNumber,
      clientName: currentContract.clientName,
      inspectorName: officerName,
      visitDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      gpsCoordinates: { lat: 10.4806, lng: -66.9036 },
      housingType,
      housingCondition,
      guarantorVerified,
      incomeStabilityVerified: incomeVerified,
      capturedPhotosCount: 3,
      dictamen: inspectionDictamen,
      observations: inspectionNotes
    });

    setInspectionsList(FieldAppEngine.getInspections());
    const msg = "¡Inspección registrada con éxito! Sello: " + newRecord.sha256Seal;
    setInspectionSuccessMsg(msg);
    toast.success(msg);
    setTimeout(() => setInspectionSuccessMsg(""), 4000);
  };

  const handleSaveCollection = () => {
    if (!currentContract) return;

    const msgText = "¡Cobro en calle registrado con éxito por $" + collectedAmountUSD + " USD!";
    setCollectionSuccessMsg(msgText);
    toast.success(msgText);
    
    // Disparar WhatsApp de confirmación
    const msg = WhatsappNotificationEngine.generateMessage("PAYMENT_CONFIRMATION", currentContract, {
      amountUSD: collectedAmountUSD,
      receiptCode: collectionRef
    }, bcvRate);
    const waUrl = WhatsappNotificationEngine.getWhatsAppLink(currentContract.clientPhone, msg);
    window.open(waUrl, "_blank");

    setTimeout(() => setCollectionSuccessMsg(""), 4000);
  };

  const handleSaveRepossession = () => {
    if (!currentContract) return;

    const newRecord = FieldAppEngine.recordRepossession({
      contractNumber: currentContract.contractNumber,
      clientName: currentContract.clientName,
      officerName,
      executionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      gpsCoordinates: { lat: 10.4806, lng: -66.9036 },
      vehiclePlate: currentContract.vehicle?.plate || "EN TRAMITE",
      vinChassis: currentContract.vehicle?.vinChassis || "VIN-994820",
      currentKilometers: currentKm,
      keysRecovered,
      physicalCondition: repossessNotes,
      clientSignatureHash: "SIG_SHA256:88AF019C4A",
      witnessName: "Oficial Inspector en Sitio",
      witnessDocId: "V-18.992.301",
      status: "EJECUTADA_CONSIGNADA"
    });

    const msg = "¡Acta de Retención registrada exitosamente! Sello: " + newRecord.sha256Seal;
    setRepossessSuccessMsg(msg);
    toast.success(msg);
    setTimeout(() => setRepossessSuccessMsg(""), 4000);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans antialiased overflow-hidden max-w-md mx-auto border-x border-zinc-800 shadow-2xl">
      
      {/* HEADER SUPERIOR MÓVIL */}
      <header className="px-4 py-3 border-b border-zinc-850 bg-zinc-900/90 backdrop-blur-md flex items-center justify-between z-20">
        <button
          onClick={onBackToDashboard}
          className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-white hover:bg-zinc-800 transition flex items-center space-x-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-semibold">ERP</span>
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <h2 className="text-xs font-bold text-white tracking-tight">AutoLending Field PWA</h2>
          </div>
          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">{"📍 GPS Activo • Bs. " + bcvRate.toFixed(2)}</span>
        </div>

        <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
          HR
        </div>
      </header>

      {/* SUB-HEADER CON SELECTOR DE CLIENTE RÁPIDO */}
      <div className="px-4 py-2 border-b border-zinc-850 bg-zinc-900/50 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 truncate">
          <span className="text-zinc-400">Cliente:</span>
          <strong className="text-white font-semibold truncate max-w-[170px]">{currentContract?.clientName}</strong>
        </div>
        <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + (
          currentContract?.deliveryStatus === "POR_RECUPERAR" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
          currentContract?.deliveryStatus === "POR_VISITAR" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" :
          "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        )}>
          {"● " + (currentContract?.deliveryStatus || "ACTIVO")}
        </span>
      </div>

      {/* CONTENIDO PRINCIPAL SCROLLEABLE */}
      <main className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        
        {/* ========================================================================= */}
        {/* 1. PESTAÑA: RUTA DE VISITAS DEL DÍA                                       */}
        {/* ========================================================================= */}
        {activeTab === "ROUTE" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ruta Asignada del Día</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">{routeClients.length + " Puntos"}</span>
            </div>

            {/* Buscador */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Buscar cliente, contrato o sector..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none placeholder-zinc-500"
              />
            </div>

            {/* Tarjetas de Clientes en Ruta */}
            <div className="space-y-2.5">
              {routeClients.map(c => {
                const isSelected = c.id === selectedContractId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedContractId(c.id)}
                    className={"p-3.5 rounded-xl border transition cursor-pointer space-y-2 " + (
                      isSelected 
                        ? "bg-emerald-950/20 border-emerald-500/50 shadow-md" 
                        : "bg-zinc-900/60 border-zinc-850 hover:border-zinc-700"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-zinc-600 dark:text-zinc-400 text-[10px]">{"#" + c.contractNumber}</span>
                          <strong className="text-white font-bold">{c.clientName}</strong>
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-zinc-600 dark:text-zinc-400" />
                          <span>{c.clientAddress}</span>
                        </p>
                      </div>

                      <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + (
                        c.deliveryStatus === "POR_RECUPERAR" ? "bg-rose-500/20 text-rose-400" :
                        c.deliveryStatus === "POR_VISITAR" ? "bg-purple-500/20 text-purple-400" :
                        "bg-emerald-500/20 text-emerald-400"
                      )}>
                        {c.deliveryStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-850/80 font-mono">
                      <span className="text-zinc-600 dark:text-zinc-400">Deuda: <strong className="text-emerald-400">{"$" + c.totalOutstandingUSD + " USD"}</strong></span>
                      <span className="text-zinc-600 dark:text-zinc-400">Mora: <strong className="text-amber-400">{"$" + (c.lateFeesPendingUSD || 0) + " USD"}</strong></span>
                    </div>

                    {/* Botones de Acción Móvil */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={"https://maps.google.com/?q=" + encodeURIComponent(c.clientAddress + ", Caracas")}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-center flex items-center justify-center space-x-1 transition"
                      >
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>Abrir GPS / Waze</span>
                      </a>

                      <a
                        href={WhatsappNotificationEngine.getWhatsAppLink(c.clientPhone, "¡Hola, " + c.clientName + "! Le contacta el oficial de AutoLending en ruta.")}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-center flex items-center justify-center space-x-1 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. PESTAÑA: INSPECCIÓN DOMICILIARIA                                       */}
        {/* ========================================================================= */}
        {activeTab === "INSPECTION" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-100 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <FileCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Checklist de Inspección en Sitio</span>
              </span>
              <span className="text-[10px] text-emerald-300 font-mono">● Geoverificación</span>
            </div>

            {inspectionSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold">
                {inspectionSuccessMsg}
              </div>
            )}

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 space-y-3">
              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">1. Condición de Vivienda</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "PROPIA", label: "Propia" },
                    { id: "ALQUILADA", label: "Alquilada" },
                    { id: "FAMILIAR", label: "Familiar" }
                  ].map(h => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setHousingType(h.id as any)}
                      className={"p-2 rounded-lg border text-center transition font-semibold " + (
                        housingType === h.id ? "bg-purple-600 text-white border-purple-500" : "bg-zinc-950 border-zinc-800 text-zinc-400"
                      )}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">2. Estado Físico del Inmueble</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["EXCELENTE", "BUENA", "REGULAR"].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setHousingCondition(c as any)}
                      className={"p-2 rounded-lg border text-center transition font-semibold " + (
                        housingCondition === c ? "bg-purple-600 text-white border-purple-500" : "bg-zinc-950 border-zinc-800 text-zinc-400"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-1 border-t border-zinc-800">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={guarantorVerified}
                    onChange={e => setGuarantorVerified(e.target.checked)}
                    className="rounded border-zinc-700 text-purple-600 focus:ring-0"
                  />
                  <span className="text-zinc-100 font-medium">Fiador Solidario presente y con CI validada</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incomeVerified}
                    onChange={e => setIncomeVerified(e.target.checked)}
                    className="rounded border-zinc-700 text-purple-600 focus:ring-0"
                  />
                  <span className="text-zinc-100 font-medium">Actividad económica / ingresos comprobados</span>
                </label>
              </div>

              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">3. Dictamen Final del Inspector</label>
                <select
                  value={inspectionDictamen}
                  onChange={e => setInspectionDictamen(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white font-bold"
                >
                  <option value="APROBADO_ENTREGA">✅ APROBADO PARA ENTREGA DE VEHÍCULO</option>
                  <option value="REQUIERE_AVAL_EXTRA">⚠️ REQUIERE SEGUNDO FIADOR / REVISIÓN</option>
                  <option value="RECHAZADO">❌ RECHAZADO / RIESGO DE INCOBRABILIDAD</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">4. Observaciones en Sitio</label>
                <textarea
                  value={inspectionNotes}
                  onChange={e => setInspectionNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white font-sans text-xs"
                />
              </div>

              <button
                onClick={handleSaveInspection}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold p-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-purple-950/50 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Firmar & Consignar Inspección</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. PESTAÑA: COBRANZA EN CALLE                                             */}
        {/* ========================================================================= */}
        {activeTab === "COLLECTION" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-100 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Terminal Móvil de Recaudación</span>
              </span>
              <span className="text-[10px] text-emerald-300 font-mono">● Cobro Inmediato</span>
            </div>

            {collectionSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold">
                {collectionSuccessMsg}
              </div>
            )}

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 space-y-3">
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-850 font-mono text-xs space-y-1">
                <p className="text-white font-bold">{currentContract?.clientName}</p>
                <p className="text-zinc-600 dark:text-zinc-400">{"Contrato: #" + currentContract?.contractNumber + " • Deuda: $" + currentContract?.totalOutstandingUSD + " USD"}</p>
              </div>

              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Monto Recibido ($ USD)</label>
                <input
                  type="number"
                  value={collectedAmountUSD}
                  onChange={e => setCollectedAmountUSD(Number(e.target.value))}
                  className="w-full p-3 font-mono font-black text-lg rounded-xl border border-zinc-800 bg-zinc-950 text-emerald-400"
                />
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-1 block font-mono">
                  Equivalente en Tasa Activa: <strong className="text-white">{BcvEngine.formatVes(BcvEngine.convertUsdToVes(collectedAmountUSD, bcvRate))}</strong>
                </span>
              </div>

              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Método de Cobro</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "CASH_USD", label: "Efectivo $" },
                    { id: "PAGO_MOVIL", label: "Pago Móvil" },
                    { id: "BINANCE_USDT", label: "Binance" }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setCollectionMethod(m.id as any)}
                      className={"p-2 rounded-lg border text-center transition font-semibold " + (
                        collectionMethod === m.id ? "bg-emerald-600 text-white border-emerald-500" : "bg-zinc-950 border-zinc-800 text-zinc-400"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">N° Recibo / Referencia de Calle</label>
                <input
                  type="text"
                  value={collectionRef}
                  onChange={e => setCollectionRef(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white font-mono"
                />
              </div>

              <button
                onClick={handleSaveCollection}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Registrar Cobro & Enviar Recibo WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. PESTAÑA: RETENCIÓN FÍSICA EN CAMPO                                     */}
        {/* ========================================================================= */}
        {activeTab === "REPOSSESSION" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-100 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>Acta de Retención Física en Campo</span>
              </span>
              <span className="text-[10px] text-rose-300 font-mono">● Orden Legal</span>
            </div>

            {repossessSuccessMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold">
                {repossessSuccessMsg}
              </div>
            )}

            <div className="p-4 rounded-xl border border-rose-500/30 bg-zinc-900 space-y-3">
              <div className="p-3 bg-rose-950/20 rounded-lg border border-rose-500/20 font-mono text-xs space-y-1 text-rose-200">
                <p className="font-bold">{currentContract?.clientName + " (Mora > 2 Meses)"}</p>
                <p className="text-[11px]">{"Vehículo: " + (currentContract?.vehicle?.brand || "") + " " + (currentContract?.vehicle?.model || "") + " • Placa: " + (currentContract?.vehicle?.plate || "EN TRAMITE")}</p>
              </div>

              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Kilometraje al Momento de Retención</label>
                <input
                  type="number"
                  value={currentKm}
                  onChange={e => setCurrentKm(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white font-mono"
                />
              </div>

              <label className="flex items-center space-x-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={keysRecovered}
                  onChange={e => setKeysRecovered(e.target.checked)}
                  className="rounded border-zinc-700 text-rose-600 focus:ring-0"
                />
                <span className="text-zinc-100 font-semibold">Llaves originales entregadas al oficial</span>
              </label>

              <div>
                <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Detalle de Estado & Observaciones</label>
                <textarea
                  value={repossessNotes}
                  onChange={e => setRepossessNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white font-sans text-xs"
                />
              </div>

              <button
                onClick={handleSaveRepossession}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold p-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-rose-950/50 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>Ejecutar Acta de Retención & Custodia</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER BAR / NAVEGACIÓN TÁCTIL PWA GOOGLE M3 */}
      <nav className="border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-md grid grid-cols-4 p-2 z-20 pb-4">
        {[
          { id: "ROUTE", label: "Ruta GPS", icon: Navigation },
          { id: "INSPECTION", label: "Inspección", icon: FileCheck },
          { id: "COLLECTION", label: "Cobranza", icon: DollarSign },
          { id: "REPOSSESSION", label: "Retención", icon: ShieldAlert }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={"flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-2xl transition-all cursor-pointer " + (
                isActive 
                  ? "text-white font-semibold" 
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <div className={"w-12 h-7 rounded-full flex items-center justify-center transition-all " + (
                isActive ? "bg-google-blue-600/30 text-google-blue-400 shadow-xs" : "text-zinc-400"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
