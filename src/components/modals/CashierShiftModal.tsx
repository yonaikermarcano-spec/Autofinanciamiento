"use client";

import React, { useState, useEffect } from "react";
import { Wallet, X, Check, AlertCircle, ShieldCheck, DollarSign, Coins } from "lucide-react";
import { toast } from "../common/GoogleSnackbar";

export default function CashierShiftModal({
  isOpen,
  onClose,
  onAuditCompleted
}: {
  isOpen: boolean;
  onClose: () => void;
  onAuditCompleted: (auditResult: any) => void;
}) {
  const [declaredUSD, setDeclaredUSD] = useState<number>(520);
  const [declaredVES, setDeclaredVES] = useState<number>(24360);

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

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedUSD = 520;
    const diffUSD = Number(declaredUSD) - expectedUSD;
    const isBalanced = Math.abs(diffUSD) < 0.05;

    const result = {
      closedAt: new Date().toLocaleTimeString("es-VE"),
      expectedUSD,
      declaredUSD: Number(declaredUSD),
      diffUSD,
      isBalanced,
      statusMessage: isBalanced 
        ? "✅ Arqueo Conforme: Efectivo físico coincide exactamente con los cobros del día ($520.00 USD)."
        : `⚠️ Discrepancia detectada: Diferencia de $${diffUSD.toFixed(2)} USD en caja.`
    };

    onAuditCompleted(result);
    onClose();
    if (isBalanced) {
      toast.success(result.statusMessage);
    } else {
      toast.warning(result.statusMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl w-full max-w-lg p-6 sm:p-7 flex flex-col shadow-2xl shadow-zinc-900/15 text-zinc-900 dark:text-zinc-100 font-sans space-y-5 animate-in zoom-in-95 duration-150"
      >
        
        {/* Header Resend Style */}
        <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
                Arqueo Ciego & Cierre de Turno
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Declaración física de efectivo y conciliación de gaveta
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guía Explicativa */}
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex items-start space-x-2.5 text-xs text-zinc-600 dark:text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-zinc-800 dark:text-zinc-200">Protocolo de Arqueo Ciego:</strong> El cajero declara el monto físico exacto contado en gaveta para que el sistema valide posibles faltantes o sobrantes sin exponer el saldo teórico previo.
          </p>
        </div>

        {/* Formulario de Conteo Físico */}
        <form onSubmit={handleAudit} className="space-y-4 text-xs">
          
          {/* Campo USD */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                <span>Efectivo Físico Contado en Dólares ($ USD)</span>
              </span>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Billetes en gaveta</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 font-bold font-mono text-zinc-600 dark:text-zinc-400 text-sm">$</span>
              <input 
                type="number" 
                step="any"
                required
                value={declaredUSD} 
                onChange={e => setDeclaredUSD(Number(e.target.value))}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-8 pr-4 py-3 text-zinc-900 dark:text-zinc-100 font-mono font-bold text-base focus:outline-none focus:border-emerald-500 transition shadow-inner" 
                placeholder="0.00"
              />
              <span className="absolute right-3.5 font-mono text-xs text-zinc-600 dark:text-zinc-400 font-bold">USD</span>
            </div>
          </div>

          {/* Campo Bolívares */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Coins className="w-3.5 h-3.5 text-blue-500" />
                <span>Efectivo Físico en Bolívares (Bs.)</span>
              </span>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Efectivo local en caja</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 font-bold font-mono text-zinc-600 dark:text-zinc-400 text-sm">Bs.</span>
              <input 
                type="number" 
                step="any"
                required
                value={declaredVES} 
                onChange={e => setDeclaredVES(Number(e.target.value))}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-zinc-900 dark:text-zinc-100 font-mono font-bold text-base focus:outline-none focus:border-blue-500 transition shadow-inner" 
                placeholder="0.00"
              />
              <span className="absolute right-3.5 font-mono text-xs text-zinc-600 dark:text-zinc-400 font-bold">VES</span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-zinc-300 font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-emerald-950/30 cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Validar & Emitir Acta</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
