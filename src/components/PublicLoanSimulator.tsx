"use client";

import React, { useState, useEffect } from "react";
import {
  Bike,
  Car,
  Calculator,
  CheckCircle2,
  Sparkles,
  Send,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Calendar,
  Layers,
  ChevronRight,
  Coins,
  PhoneCall,
  UserCheck,
  Building,
  Check,
  ArrowLeft,
  Sun,
  Moon
} from "lucide-react";
import { PublicSimulatorEngine, SimulatorVehicleOption, SimulationResult, LeadApplicationData, PreApprovalScoreResult } from "../modules/public-simulator";
import { BcvEngine } from "../modules/bcv-engine";
import { toast } from "./common/GoogleSnackbar";

interface PublicLoanSimulatorProps {
  onBackToDashboard?: () => void;
  bcvRate?: number;
}

export default function PublicLoanSimulator({
  onBackToDashboard,
  bcvRate = 46.85
}: PublicLoanSimulatorProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedVehicle, setSelectedVehicle] = useState<SimulatorVehicleOption>(PublicSimulatorEngine.AVAILABLE_VEHICLES[0]);
  const [downPercent, setDownPercent] = useState<number>(30);
  const [termMonths, setTermMonths] = useState<number>(12);
  const [frequency, setFrequency] = useState<"WEEKLY" | "BIWEEKLY" | "MONTHLY">("WEEKLY");

  useEffect(() => {
    const saved = localStorage.getItem("autolending_theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      if (saved === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    }
    const handleSync = (e: any) => {
      if (e.detail && (e.detail === "light" || e.detail === "dark")) {
        setTheme(e.detail);
      }
    };
    window.addEventListener("autolending_theme_sync", handleSync);
    return () => window.removeEventListener("autolending_theme_sync", handleSync);
  }, []);

  const handleSetTheme = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    localStorage.setItem("autolending_theme", newTheme);
    if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    window.dispatchEvent(new CustomEvent("autolending_theme_sync", { detail: newTheme }));
  };

  // Formulario de Solicitud Pre-Aprobada
  const [step, setStep] = useState<"SIMULATOR" | "APPLY_FORM" | "PRE_APPROVED_RESULT">("SIMULATOR");
  const [clientName, setClientName] = useState("");
  const [clientDocId, setClientDocId] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCity, setClientCity] = useState("Caracas");
  const [employmentType, setEmploymentType] = useState<any>("DELIVERY_RIDERS");
  const [monthlyIncomeUSD, setMonthlyIncomeUSD] = useState<number>(350);
  const [guarantorName, setGuarantorName] = useState("");
  const [guarantorPhone, setGuarantorPhone] = useState("");
  const [guarantorDocId, setGuarantorDocId] = useState("");

  const [preApprovalResult, setPreApprovalResult] = useState<PreApprovalScoreResult | null>(null);

  const simulation: SimulationResult = PublicSimulatorEngine.calculateSimulation({
    vehicle: selectedVehicle,
    downPaymentPercent: downPercent,
    termMonths,
    frequency,
    bcvRate
  });

  const handleEvaluateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      toast.error("Por favor completa los campos obligatorios para calcular tu pre-aprobación.");
      return;
    }

    const application: LeadApplicationData = {
      clientName,
      clientDocId: clientDocId || "V-00000000",
      clientPhone,
      clientCity,
      employmentType,
      monthlyIncomeUSD,
      guarantorName: guarantorName || "Fiador por consignar",
      guarantorPhone: guarantorPhone || clientPhone,
      guarantorDocId: guarantorDocId || "V-00000000",
      simulation
    };

    const res = PublicSimulatorEngine.evaluatePreApproval(application, "584143329011");
    setPreApprovalResult(res);
    setStep("PRE_APPROVED_RESULT");
    toast.success("¡Análisis de Pre-Aprobación generado con éxito!");
  };

  const isDark = theme === "dark";

  return (
    <div className={(isDark ? "dark bg-zinc-950 text-zinc-100" : "bg-slate-50 text-slate-900") + " min-h-screen font-sans antialiased selection:bg-google-green-500 selection:text-white transition-colors"}>
      
      {/* HEADER PÚBLICO */}
      <header className={"h-16 border-b sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between backdrop-blur-md " + (
        isDark ? "border-zinc-800/80 bg-zinc-950/80" : "border-slate-200/90 bg-white/80"
      )}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-google-green-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight flex items-center space-x-1.5">
              <span>AutoLending</span>
              <span className="text-[10px] bg-google-green-500/20 text-google-green-600 dark:text-google-green-400 px-2 py-0.2 rounded-full font-mono">
                VE FINTECH
              </span>
            </h1>
            <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Tasa Oficial BCV: Bs. {bcvRate.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Toggle Light / Dark */}
          <div className="flex items-center bg-slate-100 dark:bg-zinc-850 p-0.5 rounded-full border border-slate-200 dark:border-zinc-750">
            <button
              onClick={() => handleSetTheme("light")}
              className={"p-1.5 rounded-full transition-all " + (!isDark ? "bg-white text-google-blue-600 shadow-xs" : "text-zinc-400 hover:text-white")}
              title="Modo Claro"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleSetTheme("dark")}
              className={"p-1.5 rounded-full transition-all " + (isDark ? "bg-zinc-900 text-google-blue-400 shadow-xs" : "text-zinc-600 hover:text-zinc-900")}
              title="Modo Oscuro"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Volver a ERP</span>
            </button>
          )}

          <a
            href="https://wa.me/584143329011?text=Hola%20AutoLending%2C%20deseo%20informaci%C3%B3n%20sobre%20el%20financiamiento%20de%20motos"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-full bg-google-green-600 hover:bg-google-green-700 text-white font-medium text-xs transition flex items-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Asesor WhatsApp</span>
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto pt-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Financiamiento Directo en Venezuela • Sin Trámites Bancarios</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Calcula tu Cuota y Estrena tu <span className="text-emerald-400">Moto 0km</span>
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Escoge tu modelo favorito (Bera, Toro, Empire Keeway), ajusta tu inicial y solicita tu pre-aprobación en línea en menos de 2 minutos.
          </p>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        {step === "SIMULATOR" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMNA IZQUIERDA: CONTROLES INTERACTIVOS */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Selector de Vehículo */}
              <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-4">
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
                  1. Selecciona tu Vehículo
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PublicSimulatorEngine.AVAILABLE_VEHICLES.map(v => {
                    const isSelected = selectedVehicle.id === v.id;

                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVehicle(v)}
                        className={"p-4 rounded-xl border transition cursor-pointer space-y-2 " + (
                          isSelected
                            ? "bg-emerald-950/20 border-emerald-500/50 shadow-md shadow-emerald-950/20"
                            : "bg-zinc-950 border-zinc-850 hover:border-zinc-700"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-lg bg-zinc-900 text-zinc-300">
                            {v.type === "MOTO" ? <Bike className="w-4 h-4 text-emerald-400" /> : <Car className="w-4 h-4 text-blue-400" />}
                          </div>
                          {v.popularBadge && (
                            <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                              {v.popularBadge}
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-white">{v.brand} {v.model}</h4>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">Año {v.year} • {v.engineCc}</p>
                        </div>

                        <div className="pt-1 flex items-baseline justify-between">
                          <span className="text-sm font-black font-mono text-emerald-400">
                            {"$" + v.retailPriceUSD + " USD"}
                          </span>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">
                            ≈ Bs. {BcvEngine.formatVes(v.retailPriceUSD * bcvRate)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Sliders de Inicial & Plazo */}
              <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-6">
                
                {/* Inicial */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                      2. Porcentaje de Inicial
                    </span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {downPercent}% ({"$" + simulation.downPaymentUSD + " USD"})
                    </span>
                  </div>

                  <input
                    type="range"
                    min={selectedVehicle.minDownPaymentPercent}
                    max={70}
                    step={5}
                    value={downPercent}
                    onChange={e => setDownPercent(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                  />

                  <div className="flex justify-between text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">
                    <span>Mínimo: {selectedVehicle.minDownPaymentPercent}%</span>
                    <span>50%</span>
                    <span>70%</span>
                  </div>
                </div>

                {/* Plazo en Meses */}
                <div className="space-y-2">
                  <span className="font-bold text-xs text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
                    3. Plazo de Financiamiento
                  </span>

                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {[6, 12, 18, 24].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTermMonths(m)}
                        className={"p-2.5 rounded-xl font-bold transition cursor-pointer border " + (
                          termMonths === m
                            ? "bg-emerald-600 border-emerald-500 text-white shadow-sm"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                        )}
                      >
                        {m} Meses
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frecuencia de Pago */}
                <div className="space-y-2">
                  <span className="font-bold text-xs text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
                    4. Frecuencia de Pago Deseada
                  </span>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: "WEEKLY", label: "Semanal (Más Popular)", desc: "Ideal Delivery" },
                      { id: "BIWEEKLY", label: "Quincenal", desc: "Día 15 y 30" },
                      { id: "MONTHLY", label: "Mensual", desc: "Cada 30 días" }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFrequency(f.id as any)}
                        className={"p-2.5 rounded-xl text-center transition cursor-pointer border " + (
                          frequency === f.id
                            ? "bg-zinc-800 border-emerald-500/50 text-white"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                        )}
                      >
                        <p className="font-bold text-xs">{f.label}</p>
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* COLUMNA DERECHA: RESUMEN DE COTIZACIÓN */}
            <div className="lg:col-span-5 space-y-4 sticky top-24">
              
              <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-5 shadow-2xl">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Resumen de tu Plan de Financiamiento
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </h3>
                </div>

                {/* Gran Cuota Calculada */}
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-emerald-500/30 text-center space-y-1">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 uppercase font-semibold">
                    Tu Cuota {frequency === "WEEKLY" ? "Semanal" : frequency === "BIWEEKLY" ? "Quincenal" : "Mensual"} Estimada:
                  </span>
                  <p className="text-4xl font-black font-mono text-emerald-400">
                    {"$" + simulation.quotaAmountUSD + " USD"}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                    ≈ Bs. {BcvEngine.formatVes(simulation.quotaAmountVES)} (Tasa BCV)
                  </p>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono block pt-1">
                    {simulation.totalQuotasCount} cuotas en {simulation.termMonths} meses
                  </span>
                </div>

                {/* Desglose de Gastos Iniciales */}
                <div className="space-y-2 text-xs font-mono border-t border-zinc-800/80 pt-4">
                  <div className="flex justify-between text-zinc-300">
                    <span>Inicial del Vehículo ({simulation.downPaymentPercent}%):</span>
                    <span>{"$" + simulation.downPaymentUSD} USD</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Dispositivo & Instalación GPS:</span>
                    <span>{"$" + simulation.gpsFeeUSD} USD</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Trámite INTT, Placas & Experticia:</span>
                    <span>{"$" + simulation.inttFeeUSD} USD</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Gastos Administrativos & RCV:</span>
                    <span>{"$" + (simulation.adminFeeUSD + simulation.rcvFeeUSD)} USD</span>
                  </div>

                  <div className="flex justify-between text-white font-bold pt-2 border-t border-zinc-800 text-sm">
                    <span>TOTAL REQUERIDO PARA INICIAR:</span>
                    <span className="text-emerald-400">{"$" + simulation.totalInitialRequiredUSD + " USD"}</span>
                  </div>
                  <div className="text-right text-[11px] text-zinc-600 dark:text-zinc-400">
                    (Equivalente en Bs. BCV: Bs. {simulation.totalInitialRequiredVES.toLocaleString("es-VE")})
                  </div>
                </div>

                {/* Botón de Pase a Pre-Aprobación */}
                <button
                  onClick={() => setStep("APPLY_FORM")}
                  className="w-full p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
                >
                  <span>Solicitar Pre-Aprobación en Línea</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* PASO 2: FORMULARIO RÁPIDO DE PRE-APROBACIÓN */}
        {step === "APPLY_FORM" && (
          <div className="max-w-2xl mx-auto p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="font-bold text-lg text-white">Formulario de Pre-Aprobación Rápida</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Sin papeleos complejos. Verificamos tu capacidad de pago en segundos.</p>
              </div>
              <button
                onClick={() => setStep("SIMULATOR")}
                className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-white"
              >
                ← Volver a la Calculadora
              </button>
            </div>

            <form onSubmit={handleEvaluateApplication} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Nombre y Apellido *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: José Gregorio Castillo"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white"
                  />
                </div>

                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Cédula de Identidad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: V-18492019"
                    value={clientDocId}
                    onChange={e => setClientDocId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Teléfono Celular (WhatsApp) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 0414-3329011"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Ciudad / Estado *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Caracas / Maracay / Valencia"
                    value={clientCity}
                    onChange={e => setClientCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Actividad Económica *</label>
                  <select
                    value={employmentType}
                    onChange={e => setEmploymentType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-xs"
                  >
                    <option value="DELIVERY_RIDERS">Delivery / Mototaxista / Rider</option>
                    <option value="COMERCIO_INDEPENDIENTE">Comercio Independiente / Emprendedor</option>
                    <option value="EMPLEADO_EMPRESA">Empleado de Empresa Privada / Pública</option>
                    <option value="TRANSPORTE">Transporte / Particular</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Ingresos Mensuales Estimados ($ USD) *</label>
                  <input
                    type="number"
                    min={100}
                    required
                    value={monthlyIncomeUSD}
                    onChange={e => setMonthlyIncomeUSD(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white font-mono font-bold"
                  />
                </div>
              </div>

              {/* Fiador Solidario */}
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850 space-y-3">
                <span className="font-bold text-xs text-zinc-300 block">Datos del Fiador Solidario (Aval)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nombre del Fiador"
                    value={guarantorName}
                    onChange={e => setGuarantorName(e.target.value)}
                    className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Teléfono del Fiador (WhatsApp)"
                    value={guarantorPhone}
                    onChange={e => setGuarantorPhone(e.target.value)}
                    className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition cursor-pointer shadow-lg shadow-emerald-950/50"
              >
                Evaluar mi Solicitud & Obtener Pre-Aprobación
              </button>
            </form>
          </div>
        )}

        {/* PASO 3: DICTAMEN DE PRE-APROBACIÓN & BOTÓN WHATSAPP */}
        {step === "PRE_APPROVED_RESULT" && preApprovalResult && (
          <div className="max-w-2xl mx-auto p-8 rounded-2xl border border-emerald-500/40 bg-emerald-950/10 space-y-6 text-center shadow-2xl animate-in zoom-in-95">
            
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold">
                CÓDIGO DE PRE-APROBACIÓN: #{preApprovalResult.leadId}
              </span>
              <h3 className="text-3xl font-extrabold text-white">
                ¡Felicidades, {clientName}! Tu solicitud ha sido <span className="text-emerald-400">Pre-Aprobada</span>
              </h3>
              <p className="text-xs text-zinc-300 max-w-md mx-auto">
                {preApprovalResult.recommendation}
              </p>
            </div>

            {/* Resumen Final */}
            <div className="p-4 bg-zinc-950/80 rounded-xl border border-zinc-800 text-left text-xs font-mono space-y-1.5">
              <p>Vehículo: <strong className="text-white font-sans">{simulation.vehicle.brand} {simulation.vehicle.model}</strong></p>
              <p>Inicial Requerida: <strong className="text-emerald-400 font-bold">{"$" + simulation.totalInitialRequiredUSD + " USD"}</strong> (Bs. {simulation.totalInitialRequiredVES.toLocaleString("es-VE")})</p>
              <p>Cuota {simulation.frequency === "WEEKLY" ? "Semanal" : simulation.frequency === "BIWEEKLY" ? "Quincenal" : "Mensual"}: <strong className="text-white">{"$" + simulation.quotaAmountUSD + " USD"}</strong></p>
              <p>Fiador Registrado: <span className="text-zinc-600 dark:text-zinc-400">{guarantorName || "Por verificar"}</span></p>
            </div>

            {/* Botón WhatsApp */}
            <div className="space-y-2">
              <a
                href={preApprovalResult.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full p-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition flex items-center justify-center space-x-2 shadow-xl shadow-emerald-950/60 cursor-pointer block"
              >
                <Send className="w-4 h-4" />
                <span>🟢 Enviar Solicitud Pre-Aprobada por WhatsApp a un Asesor</span>
              </a>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                Se abrirá tu WhatsApp con el expediente listo para que nuestro equipo reserve tu moto de inmediato.
              </p>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
