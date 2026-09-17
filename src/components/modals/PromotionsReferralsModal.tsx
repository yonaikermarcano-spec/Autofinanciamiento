"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Ticket,
  Users,
  CheckCircle2,
  AlertTriangle,
  Gift,
  Copy,
  Check,
  DollarSign,
  Calendar,
  Sparkles,
  Share2
} from "lucide-react";
import {
  PromotionsReferralsEngine,
  PromoCoupon,
  ReferralRecord
} from "../../modules/promotions-referrals";

interface PromotionsReferralsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bcvRate: number;
}

export default function PromotionsReferralsModal({
  isOpen,
  onClose,
  bcvRate
}: PromotionsReferralsModalProps) {
  const [coupons, setCoupons] = useState<PromoCoupon[]>(PromotionsReferralsEngine.getAllCoupons());
  const [referrals, setReferrals] = useState<ReferralRecord[]>(PromotionsReferralsEngine.getAllReferrals());
  const [activeTab, setActiveTab] = useState<"COUPONS" | "REFERRALS">("COUPONS");

  // Nuevo Referido
  const [referrerClientName, setReferrerClientName] = useState("José Gregorio Castillo");
  const [referrerContractNumber, setReferrerContractNumber] = useState("CTR-2026-001");
  const [referredFriendName, setReferredFriendName] = useState("");
  const [referredPhone, setReferredPhone] = useState("");
  const [successBanner, setSuccessBanner] = useState("");

  
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

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referredFriendName || !referredPhone) return;

    const newRef = PromotionsReferralsEngine.registerReferral({
      referrerClientName,
      referrerContractNumber,
      referredFriendName,
      referredPhone
    });

    setReferrals(PromotionsReferralsEngine.getAllReferrals());
    setReferredFriendName("");
    setReferredPhone("");
    setSuccessBanner("¡Referido registrado exitosamente! Al retirar su moto se le abonarán $20 USD a la cuota del titular con sello " + newRef.sha256Seal.slice(0, 16) + "...");
    setTimeout(() => setSuccessBanner(""), 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-500/10 text-pink-400 rounded-2xl border border-pink-500/20">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Campañas Promocionales, Cupones & Programa de Referidos</span>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.2 rounded-full font-mono">
                  GROWTH ENGINE
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Gestión de cupones de descuento y recompensas automáticas por clientes referidos
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
          <button
            onClick={() => setActiveTab("COUPONS")}
            className={"px-4 py-2 font-semibold transition flex items-center space-x-2 border-b-2 cursor-pointer " + (
              activeTab === "COUPONS" 
                ? "border-pink-500 text-pink-400" 
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Cupones de Descuento Activos</span>
            <span className="text-[10px] bg-pink-500/20 text-pink-300 font-mono px-1.5 py-0.2 rounded-full font-bold">
              {coupons.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("REFERRALS")}
            className={"px-4 py-2 font-semibold transition flex items-center space-x-2 border-b-2 cursor-pointer " + (
              activeTab === "REFERRALS" 
                ? "border-pink-500 text-pink-400" 
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Programa de Referidos (\"Gana con tu Moto\")</span>
            <span className="text-[10px] bg-pink-500/20 text-pink-300 font-mono px-1.5 py-0.2 rounded-full font-bold">
              {referrals.length}
            </span>
          </button>
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

          {/* 1. PESTAÑA DE CUPONES */}
          {activeTab === "COUPONS" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coupons.map(cp => (
                  <div 
                    key={cp.code}
                    className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-pink-400 font-mono tracking-wider bg-pink-500/10 px-2.5 py-1 rounded-lg border border-pink-500/20">
                        {cp.code}
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold font-mono">
                        ● ACTIVO
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 font-sans">{cp.description}</p>

                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block">Descuento:</span>
                        <strong className="text-emerald-400 text-sm">{"$" + cp.discountUSD} USD</strong>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block">Usos:</span>
                        <strong className="text-zinc-900 dark:text-zinc-100">{cp.currentUses} / {cp.maxUses}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. PESTAÑA DE REFERIDOS */}
          {activeTab === "REFERRALS" && (
            <div className="space-y-6">
              
              {/* Formulario Referir */}
              <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
                <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-pink-400" />
                  <span>Registrar Amigo Referido por Cliente Activo ($20 USD de Bono)</span>
                </h4>

                <form onSubmit={handleCreateReferral} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">Cliente Referidor</label>
                    <input
                      type="text"
                      value={referrerClientName}
                      onChange={e => setReferrerClientName(e.target.value)}
                      className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">N° Contrato Referidor</label>
                    <input
                      type="text"
                      value={referrerContractNumber}
                      onChange={e => setReferrerContractNumber(e.target.value)}
                      className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">Nombre del Amigo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Daniel Castillo"
                      value={referredFriendName}
                      onChange={e => setReferredFriendName(e.target.value)}
                      className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">Teléfono del Amigo</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        required
                        placeholder="0414-XXXXXXX"
                        value={referredPhone}
                        onChange={e => setReferredPhone(e.target.value)}
                        className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                      />
                      <button
                        type="submit"
                        className="p-2.5 px-4 rounded-2xl bg-pink-600 hover:bg-pink-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition cursor-pointer shadow-md flex-shrink-0"
                      >
                        Registrar
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Historial de Referidos */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Historial de Recompensas por Referidos</h4>

                <div className="space-y-2.5">
                  {referrals.map(ref => (
                    <div 
                      key={ref.id}
                      className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 font-sans">Amigo: {ref.referredFriendName}</span>
                          <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">({ref.referredPhone})</span>
                          <span className={"text-[9px] px-1.5 py-0.2 rounded font-mono font-bold " + (
                            ref.status === "DELIVERED_REWARD_CREDITED"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/20 text-amber-300"
                          )}>
                            ● {ref.status === "DELIVERED_REWARD_CREDITED" ? "BONO ABONADO" : "EN ESPERA DE ENTREGA"}
                          </span>
                        </div>

                        <p className="text-zinc-300 font-sans text-xs">
                          Referido por: <strong className="text-zinc-900 dark:text-zinc-100">{ref.referrerClientName}</strong> (#{ref.referrerContractNumber}) • Bono: <strong className="text-emerald-400">{"$" + ref.rewardAmountUSD} USD</strong>
                        </p>

                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono block">
                          Fecha: {ref.createdAt} • Sello: {ref.sha256Seal}
                        </span>
                      </div>

                      <div className="flex-shrink-0">
                        <span className="text-[10px] bg-white dark:bg-zinc-900 text-pink-400 px-2.5 py-1 rounded font-mono border border-zinc-200 dark:border-zinc-800">
                          {ref.rewardAmountUSD} USD a Cuota
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
