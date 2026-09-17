"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Brain,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  Zap,
  TrendingUp,
  Sparkles,
  UserCheck,
  Clock,
  ChevronRight,
  HelpCircle,
  FileCheck,
  AlertCircle
} from "lucide-react";
import {
  CreditScoringEngine,
  ApplicantEvaluationInput,
  ScoringResult,
  EarlyWarningClient,
  EmploymentType,
  HousingType
} from "../../modules/credit-scoring";

interface CreditScoringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreditScoringModal({
  isOpen,
  onClose
}: CreditScoringModalProps) {
  const [activeTab, setActiveTab] = useState<"EVALUATOR" | "EARLY_WARNING">("EVALUATOR");

  // Formulario Evaluador
  const [fullName, setFullName] = useState("Luis Miguel Mendoza");
  const [docId, setDocId] = useState("V-22194820");
  const [phone, setPhone] = useState("0414-8892019");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("DELIVERY_APP");
  const [monthlyIncomeUSD, setMonthlyIncomeUSD] = useState<number>(380);
  const [housingType, setHousingType] = useState<HousingType>("FAMILIAR");
  const [yearsAtCurrentAddress, setYearsAtCurrentAddress] = useState<number>(4);
  const [hasGuarantor, setHasGuarantor] = useState<boolean>(true);
  const [guarantorHasIncome, setGuarantorHasIncome] = useState<boolean>(true);
  const [bikePriceUSD, setBikePriceUSD] = useState<number>(1200);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(35);
  const [termMonths, setTermMonths] = useState<number>(12);

  // Resultado
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(() => {
    return CreditScoringEngine.evaluateApplicant({
      fullName: "Luis Miguel Mendoza",
      docId: "V-22194820",
      phone: "0414-8892019",
      employmentType: "DELIVERY_APP",
      monthlyIncomeUSD: 380,
      housingType: "FAMILIAR",
      yearsAtCurrentAddress: 4,
      hasGuarantor: true,
      guarantorHasIncome: true,
      bikePriceUSD: 1200,
      downPaymentPercent: 35,
      termMonths: 12
    });
  });

  const earlyWarningList = CreditScoringEngine.getEarlyWarningPortfolio();

  
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

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = CreditScoringEngine.evaluateApplicant({
      fullName,
      docId,
      phone,
      employmentType,
      monthlyIncomeUSD,
      housingType,
      yearsAtCurrentAddress,
      hasGuarantor,
      guarantorHasIncome,
      bikePriceUSD,
      downPaymentPercent,
      termMonths
    });
    setScoringResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Motor de Scoring Crediticio IA & Radar de Riesgo</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.2 rounded-full font-mono">
                  SCORECARD VE (0 - 1000)
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Evaluación predictiva de riesgo adaptada a la economía venezolana y radar de mora temprana
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
            { id: "EVALUATOR", label: "Evaluador de Scoring Crediticio", icon: Sparkles },
            { id: "EARLY_WARNING", label: "Radar de Alerta Temprana de Mora", icon: AlertTriangle, count: earlyWarningList.length }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={"px-4 py-2 font-semibold transition flex items-center space-x-2 border-b-2 cursor-pointer " + (
                  isActive 
                    ? "border-indigo-500 text-indigo-400" 
                    : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-200"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.count !== undefined && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.2 rounded-full font-mono">
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
          {/* 1. EVALUADOR DE SCORING CREDITICIO                                        */}
          {/* ========================================================================= */}
          {activeTab === "EVALUATOR" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Formulario de Parámetros (Col 6) */}
              <div className="lg:col-span-6 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-4">
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Datos del Solicitante & Capacidad</h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Ingresa los factores sociodemográficos para el análisis de riesgo.</p>
                </div>

                <form onSubmit={handleEvaluate} className="space-y-3.5 text-xs">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Cédula / RIF</label>
                      <input
                        type="text"
                        required
                        value={docId}
                        onChange={e => setDocId(e.target.value)}
                        className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Actividad / Ocupación</label>
                      <select
                        value={employmentType}
                        onChange={e => setEmploymentType(e.target.value as any)}
                        className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs"
                      >
                        <option value="DELIVERY_APP">Delivery (Yummy / PedidosYa / Ridery)</option>
                        <option value="EMPLEADO_PRIVADO">Empleado Empresa Privada</option>
                        <option value="PROFESIONAL_INDEPENDIENTE">Profesional Independiente</option>
                        <option value="COMERCIANTE_INFORMAL">Comerciante Informal</option>
                        <option value="EMPLEADO_PUBLICO">Empleado Sector Público</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Ingreso Mensual Estimado ($ USD)</label>
                      <input
                        type="number"
                        required
                        min="100"
                        value={monthlyIncomeUSD}
                        onChange={e => setMonthlyIncomeUSD(parseFloat(e.target.value) || 0)}
                        className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-emerald-400 font-bold font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Tipo de Vivienda</label>
                      <select
                        value={housingType}
                        onChange={e => setHousingType(e.target.value as any)}
                        className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs"
                      >
                        <option value="PROPIA">Vivienda Propia</option>
                        <option value="FAMILIAR">Vivienda Familiar</option>
                        <option value="ALQUILADA">Alquilada</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Años en Domicilio</label>
                      <input
                        type="number"
                        min="0"
                        value={yearsAtCurrentAddress}
                        onChange={e => setYearsAtCurrentAddress(parseInt(e.target.value, 10) || 0)}
                        className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasGuarantor}
                        onChange={e => setHasGuarantor(e.target.checked)}
                        className="rounded text-indigo-500"
                      />
                      <span className="font-semibold text-zinc-200">Presenta Fiador Solidario</span>
                    </label>

                    {hasGuarantor && (
                      <label className="flex items-center space-x-2 pl-5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={guarantorHasIncome}
                          onChange={e => setGuarantorHasIncome(e.target.checked)}
                          className="rounded text-indigo-500"
                        />
                        <span className="text-zinc-600 dark:text-zinc-400">Fiador con ingresos independientes demostrables</span>
                      </label>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Precio Moto ($ USD)</label>
                      <input
                        type="number"
                        value={bikePriceUSD}
                        onChange={e => setBikePriceUSD(parseFloat(e.target.value) || 0)}
                        className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-700 dark:text-zinc-400 block mb-1">% Inicial Aportado ({downPaymentPercent}%)</label>
                      <input
                        type="range"
                        min="30"
                        max="70"
                        step="5"
                        value={downPaymentPercent}
                        onChange={e => setDownPaymentPercent(parseInt(e.target.value, 10))}
                        className="w-full accent-indigo-500 mt-2"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-indigo-950/50"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Calcular Scorecard & Dictamen IA</span>
                  </button>

                </form>
              </div>

              {/* Dictamen y Resultados IA (Col 6) */}
              <div className="lg:col-span-6 space-y-4">
                {scoringResult && (
                  <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-5">
                    
                    {/* Score Card Gauge Header */}
                    <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                      <div>
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-wider block">SCORE CREDITICIO IA</span>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl font-black font-mono text-zinc-900 dark:text-zinc-100">{scoringResult.score}</span>
                          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">/ 1000 pts</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={"text-xs font-bold px-3 py-1 rounded-full border inline-block " + (
                          scoringResult.riskTier === 'CLASE_A_BAJO_RIESGO' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                          scoringResult.riskTier === 'CLASE_B_RIESGO_MODERADO' ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                          "bg-red-500/10 text-red-400 border-red-500/30"
                        )}>
                          ● {scoringResult.riskTier.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block mt-1 font-mono">
                          {scoringResult.approvalStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Recomendaciones Clave */}
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block font-sans">Inicial Sugerida:</span>
                        <strong className="text-indigo-400 text-sm">{scoringResult.recommendedDownPaymentPercent}%</strong>
                      </div>

                      <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block font-sans">Hito de Entrega:</span>
                        <strong className="text-zinc-900 dark:text-zinc-100 text-xs">{scoringResult.recommendedDeliveryMilestone.replace(/_/g, ' ')}</strong>
                      </div>
                    </div>

                    {/* Nota del Dictamen */}
                    <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/30 rounded-2xl text-xs text-indigo-300">
                      <p className="font-semibold">{scoringResult.recommendationNote}</p>
                    </div>

                    {/* Fortalezas y Riesgos */}
                    <div className="space-y-3 text-xs">
                      {scoringResult.strengths.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Factores Favorables (+):</span>
                          <div className="space-y-1">
                            {scoringResult.strengths.map((s, idx) => (
                              <p key={idx} className="flex items-center space-x-1.5 text-zinc-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                <span>{s}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {scoringResult.riskFactors.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">Puntos de Atención / Riesgo (!):</span>
                          <div className="space-y-1">
                            {scoringResult.riskFactors.map((r, idx) => (
                              <p key={idx} className="flex items-center space-x-1.5 text-zinc-600 dark:text-zinc-400">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                <span>{r}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sello Criptográfico */}
                    <div className="p-2.5 bg-white dark:bg-zinc-900/80 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 truncate">
                      Sello de Evaluación: {scoringResult.sha256Seal}
                    </div>

                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. RADAR DE ALERTA TEMPRANA DE MORA (EARLY WARNING)                      */}
          {/* ========================================================================= */}
          {activeTab === "EARLY_WARNING" && (
            <div className="space-y-4">
              
              <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-amber-300 text-xs">
                <p className="font-bold flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Detección Preventiva de Conducta de Pago & Retrasos Iniciales</span>
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                  El algoritmo detecta patrones atípicos (pequeños retrasos de 3 a 7 días, abonos parciales o cambios de teléfono) antes de que el cliente caiga en morosidad grave de 30 días.
                </p>
              </div>

              <div className="space-y-3">
                {earlyWarningList.map(item => {
                  const cleanPhone = item.clientPhone.replace(/[^0-9]/g, '');
                  const waUrl = "https://wa.me/58" + cleanPhone.replace(/^0/, '') + "?text=" + encodeURIComponent(
                    "Hola " + item.clientName + ", te saludamos de AutoLending para recordarte la verificación de tu cuota pendiente del contrato #" + item.contractNumber + "."
                  );

                  return (
                    <div 
                      key={item.contractNumber}
                      className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-sans">{item.clientName}</span>
                          <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">#{item.contractNumber}</span>
                          <span className={"text-[9px] px-2 py-0.2 rounded font-bold " + (
                            item.riskLevel === "ALERTA_ROJA" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                            item.riskLevel === "ALERTA_NARANJA" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                            "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          )}>
                            ● {item.riskLevel.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-300">
                          Vehículo: <strong className="text-zinc-900 dark:text-zinc-100">{item.vehicleModel}</strong> • Promedio de Retraso: <strong className="text-amber-400 font-mono">{item.daysLateAverage} días</strong>
                        </p>

                        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                          ⚠️ <strong>Motivo de Alerta:</strong> {item.triggerReason}
                        </p>

                        <p className="text-xs text-indigo-400 font-sans">
                          💡 <strong>Acción Recomendada:</strong> {item.suggestedAction}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Contacto Preventivo WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
