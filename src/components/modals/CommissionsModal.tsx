"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Award,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  Check,
  Send,
  Download,
  Settings,
  Sparkles,
  UserCheck,
  Building,
  Edit2,
  Save
} from "lucide-react";
import { CommissionsEngine, StaffCommissionSummary, CommissionRule } from "../../modules/commissions";

interface CommissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bcvRate: number;
}

export default function CommissionsModal({
  isOpen,
  onClose,
  bcvRate
}: CommissionsModalProps) {
  const [staffList, setStaffList] = useState<StaffCommissionSummary[]>(CommissionsEngine.getAllStaffSummaries());
  const [rules, setRules] = useState<CommissionRule[]>(CommissionsEngine.getAllRules());
  const [activeTab, setActiveTab] = useState<"SUMMARY" | "RULES">("SUMMARY");

  const [payingStaff, setPayingStaff] = useState<StaffCommissionSummary | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("PAGO_MOVIL_BCV");
  const [paymentReference, setPaymentReference] = useState<string>("");
  const [successBanner, setSuccessBanner] = useState<string>("");

  // Estado de edición de reglas configurables
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [tempFixedUSD, setTempFixedUSD] = useState<number>(25);
  const [tempPercentage, setTempPercentage] = useState<number>(8);
  const [tempThreshold, setTempThreshold] = useState<number>(10);
  const [tempBonusUSD, setTempBonusUSD] = useState<number>(100);

  
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

  const totalCommissionsUSD = staffList.reduce((acc, s) => acc + s.totalCommissionToPayUSD, 0);
  const totalSettledUSD = staffList.filter(s => s.isSettled).reduce((acc, s) => acc + s.totalCommissionToPayUSD, 0);
  const totalPendingUSD = totalCommissionsUSD - totalSettledUSD;

  const handleStartEditRule = (r: CommissionRule) => {
    setEditingRuleId(r.id);
    setTempFixedUSD(r.fixedAmountUSD || 25);
    setTempPercentage(r.percentageRate || 8);
    setTempThreshold(r.thresholdTarget || 10);
    setTempBonusUSD(r.bonusAmountUSD || 100);
  };

  const handleSaveRule = (r: CommissionRule) => {
    const updated: CommissionRule = {
      ...r,
      fixedAmountUSD: r.type === "FIXED_PER_CONTRACT" ? tempFixedUSD : r.fixedAmountUSD,
      percentageRate: r.type === "PERCENTAGE_ON_COLLECTION" ? tempPercentage : r.percentageRate,
      thresholdTarget: r.type === "TIER_BONUS" ? tempThreshold : r.thresholdTarget,
      bonusAmountUSD: r.type === "TIER_BONUS" ? tempBonusUSD : r.bonusAmountUSD
    };

    const newRules = CommissionsEngine.updateRule(updated, bcvRate);
    setRules(newRules);
    setStaffList(CommissionsEngine.getAllStaffSummaries());
    setEditingRuleId(null);
    setSuccessBanner("¡Regla de comisión '" + r.ruleName + "' actualizada y recalculada para todo el equipo!");
    setTimeout(() => setSuccessBanner(""), 3500);
  };

  const handleConfirmSettlement = () => {
    if (!payingStaff || !paymentReference.trim()) return;

    CommissionsEngine.settleCommission(payingStaff.staffId, paymentMethod, paymentReference.trim());
    setStaffList(CommissionsEngine.getAllStaffSummaries());
    setSuccessBanner("¡Comisión de $" + payingStaff.totalCommissionToPayUSD + " USD liquidada exitosamente a " + payingStaff.name + "!");
    setPayingStaff(null);
    setPaymentReference("");
    setTimeout(() => setSuccessBanner(""), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-2xl border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Liquidación de Comisiones & Bonos Comerciales</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.2 rounded-full font-mono">
                  100% CONFIGURABLE
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Ajusta los montos de comisión, bonos de meta y porcentajes de cobranza en cualquier momento
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
            { id: "SUMMARY", label: "Nómina de Comisiones del Mes", icon: DollarSign, count: staffList.length },
            { id: "RULES", label: "⚙️ Configuración de Montos & Bonos", icon: Settings, count: rules.length }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={"px-4 py-2 font-semibold transition flex items-center space-x-2 border-b-2 cursor-pointer " + (
                  isActive 
                    ? "border-amber-500 text-amber-700 dark:text-amber-400" 
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

          {/* ========================================================================= */}
          {/* 1. NÓMINA DE COMISIONES DEL MES                                          */}
          {/* ========================================================================= */}
          {activeTab === "SUMMARY" && (
            <div className="space-y-5">
              
              {/* Tarjetas KPI de Resumen */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-1">
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold uppercase">TOTAL COMISIONES DEL MES</span>
                  <p className="text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100">{"$" + totalCommissionsUSD.toFixed(2)} USD</p>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">≈ Bs. {(totalCommissionsUSD * bcvRate).toLocaleString("es-VE")}</span>
                </div>

                <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/10 space-y-1">
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase">PENDIENTE POR LIQUIDAR</span>
                  <p className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400">{"$" + totalPendingUSD.toFixed(2)} USD</p>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400">En espera de transferencia</span>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-1">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">TOTAL PAGADO / LIQUIDADO</span>
                  <p className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">{"$" + totalSettledUSD.toFixed(2)} USD</p>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400">Comprobantes emitidos</span>
                </div>
              </div>

              {/* Tabla de Colaboradores */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold uppercase">
                    <tr>
                      <th className="p-3">Colaborador / Rol</th>
                      <th className="p-3">Rendimiento Mes</th>
                      <th className="p-3">Comisión Base</th>
                      <th className="p-3">Bono de Meta</th>
                      <th className="p-3">Total Liquidación</th>
                      <th className="p-3 text-right">Estado / Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850 font-mono text-[11px]">
                    {staffList.map(s => (
                      <tr key={s.staffId} className="hover:bg-white dark:bg-zinc-900/40">
                        <td className="p-3">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 font-sans">{s.name}</p>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400">{s.docId} • {s.role.replace(/_/g, ' ')}</span>
                        </td>
                        <td className="p-3 font-sans">
                          {s.role === "ASESOR_VENTAS" ? (
                            <div>
                              <strong className="text-emerald-700 dark:text-emerald-400">{s.contractsClosedCount}</strong> de {s.monthlyTargetUnits} motos
                              {s.contractsClosedCount >= s.monthlyTargetUnits && (
                                <span className="ml-1 text-[9px] bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-1 py-0.2 rounded font-bold">META SUPERADA</span>
                              )}
                            </div>
                          ) : (
                            <div>
                              <span className="text-slate-700 dark:text-zinc-300">Recaudado: </span>
                              <strong className="text-emerald-700 dark:text-emerald-400">{"$" + s.totalCollectedInFieldUSD} USD</strong>
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-slate-800 dark:text-zinc-200">
                          {"$" + s.baseCommissionsUSD.toFixed(2)} USD
                        </td>
                        <td className="p-3 text-amber-700 dark:text-amber-400 font-bold">
                          {s.targetBonusUSD > 0 ? ("+$" + s.targetBonusUSD.toFixed(2) + " USD") : "—"}
                        </td>
                        <td className="p-3">
                          <p className="font-black text-emerald-700 dark:text-emerald-400 font-mono text-xs">{"$" + s.totalCommissionToPayUSD.toFixed(2)} USD</p>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Bs. {s.totalCommissionToPayVES.toLocaleString("es-VE")}</span>
                        </td>
                        <td className="p-3 text-right">
                          {s.isSettled ? (
                            <div className="space-y-0.5">
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                                ✓ LIQUIDADO
                              </span>
                              <span className="text-[9px] text-zinc-600 dark:text-zinc-400 block truncate max-w-[120px]">
                                {s.paymentReference}
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setPayingStaff(s)}
                              className="p-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs transition cursor-pointer"
                            >
                              Liquidar Comisión
                            </button>
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
          {/* 2. REGLAS DE COMISIÓN 100% EDITABLES & CONFIGURABLES                     */}
          {/* ========================================================================= */}
          {activeTab === "RULES" && (
            <div className="space-y-4">
              
              <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-amber-800 dark:text-amber-300 text-xs">
                <p className="font-bold flex items-center space-x-1.5">
                  <Settings className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>Configuración de Parámetros Comerciales por la Financiadora</span>
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                  Todos los montos, porcentajes y metas son 100% personalizables. Al cambiar un valor, el sistema recalcula automáticamente los totales de la nómina en tiempo real.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rules.map(r => {
                  const isEditing = editingRuleId === r.id;

                  return (
                    <div key={r.id} className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <div>
                          <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{r.ruleName}</h4>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400">{r.role.replace(/_/g, ' ')}</span>
                        </div>

                        {!isEditing ? (
                          <button
                            onClick={() => handleStartEditRule(r)}
                            className="p-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                            <span>Modificar</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSaveRule(r)}
                            className="p-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer shadow-md"
                          >
                            <Save className="w-3 h-3" />
                            <span>Guardar</span>
                          </button>
                        )}
                      </div>

                      {/* Vista de Modo Lectura */}
                      {!isEditing ? (
                        <div className="space-y-1.5 text-xs text-slate-700 dark:text-zinc-300 font-mono">
                          {r.type === "FIXED_PER_CONTRACT" && (
                            <p>Monto Fijo por Venta: <strong className="text-emerald-700 dark:text-emerald-400 text-sm font-bold">{"$" + r.fixedAmountUSD} USD</strong></p>
                          )}
                          {r.type === "PERCENTAGE_ON_COLLECTION" && (
                            <p>Comisión de Cobranza: <strong className="text-emerald-700 dark:text-emerald-400 text-sm font-bold">{r.percentageRate}% del monto recuperado</strong></p>
                          )}
                          {r.type === "TIER_BONUS" && (
                            <>
                              <p>Meta Mínima para Calificar: <strong className="text-zinc-900 dark:text-zinc-100">{r.thresholdTarget} {r.role === "ASESOR_VENTAS" ? "motos" : "USD cobrados"}</strong></p>
                              <p>Monto del Bono Extra: <strong className="text-amber-700 dark:text-amber-400 text-sm font-bold">{"$" + r.bonusAmountUSD} USD</strong></p>
                            </>
                          )}
                        </div>
                      ) : (
                        /* Vista de Modo Edición */
                        <div className="space-y-3 pt-1 text-xs">
                          {r.type === "FIXED_PER_CONTRACT" && (
                            <div>
                              <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Monto de Comisión por Moto ($ USD):</label>
                              <input
                                type="number"
                                min="0"
                                step="5"
                                value={tempFixedUSD}
                                onChange={e => setTempFixedUSD(parseFloat(e.target.value) || 0)}
                                className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 font-bold font-mono text-sm"
                              />
                            </div>
                          )}

                          {r.type === "PERCENTAGE_ON_COLLECTION" && (
                            <div>
                              <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Porcentaje de Comisión sobre Cobro en Calle (%):</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.5"
                                value={tempPercentage}
                                onChange={e => setTempPercentage(parseFloat(e.target.value) || 0)}
                                className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 font-bold font-mono text-sm"
                              />
                            </div>
                          )}

                          {r.type === "TIER_BONUS" && (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Meta Mínima ({r.role === "ASESOR_VENTAS" ? "Unidades" : "USD"}):</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={tempThreshold}
                                  onChange={e => setTempThreshold(parseInt(e.target.value, 10) || 1)}
                                  className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold font-mono text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Bono Extra ($ USD):</label>
                                <input
                                  type="number"
                                  min="0"
                                  step="10"
                                  value={tempBonusUSD}
                                  onChange={e => setTempBonusUSD(parseFloat(e.target.value) || 0)}
                                  className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-amber-700 dark:text-amber-400 font-bold font-mono text-sm"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* MODAL DE LIQUIDACIÓN DE PAGO */}
        {payingStaff && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs backdrop-blur-md animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] p-6 space-y-4 shadow-2xl text-zinc-900 dark:text-zinc-100 font-sans">
              
              <div className="flex items-center space-x-3 text-amber-700 dark:text-amber-400">
                <div className="p-2.5 bg-amber-500/20 rounded-2xl border border-amber-500/30">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Liquidar Comisión a Colaborador</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{payingStaff.name} ({payingStaff.role.replace(/_/g, ' ')})</p>
                </div>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs font-mono">
                <p>Monto en Divisas: <strong className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">{"$" + payingStaff.totalCommissionToPayUSD.toFixed(2) + " USD"}</strong></p>
                <p>Equivalente en Bolívares (BCV): <strong className="text-zinc-900 dark:text-zinc-100">Bs. {payingStaff.totalCommissionToPayVES.toLocaleString("es-VE")}</strong></p>
                <p className="text-slate-700 dark:text-zinc-300">Teléfono / Pago Móvil: <strong className="text-slate-900 dark:text-zinc-100">{payingStaff.phone}</strong></p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Método de Desembolso</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs"
                  >
                    <option value="PAGO_MOVIL_BCV">Pago Móvil Bancario (Bs. BCV)</option>
                    <option value="EFECTIVO_DIVISAS_USD">Efectivo Divisas ($ USD)</option>
                    <option value="BINANCE_PAY_USDT">Binance Pay (USDT)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Número de Referencia / Comprobante</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: PM-8849201 / REC-NOM-0825"
                    value={paymentReference}
                    onChange={e => setPaymentReference(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => setPayingStaff(null)}
                  className="flex-1 p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleConfirmSettlement}
                  disabled={!paymentReference.trim()}
                  className={"flex-1 p-2.5 rounded-2xl font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer " + (
                    paymentReference.trim()
                      ? "bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 shadow-lg shadow-emerald-950/50"
                      : "bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-not-allowed"
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Desembolso</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
