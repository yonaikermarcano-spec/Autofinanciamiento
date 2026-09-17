"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Layers,
  Send,
  ExternalLink,
  ShieldCheck,
  Coins,
  DollarSign
} from "lucide-react";
import {
  CryptoReconciliationEngine,
  CryptoDepositRecord,
  CryptoProvider
} from "../../modules/crypto-reconciliation";
import { LoanContract } from "../../types";

interface CryptoReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  contracts: LoanContract[];
  bcvRate: number;
}

export default function CryptoReconciliationModal({
  isOpen,
  onClose,
  contracts,
  bcvRate
}: CryptoReconciliationModalProps) {
  const [deposits, setDeposits] = useState<CryptoDepositRecord[]>(CryptoReconciliationEngine.getAllDeposits());
  
  // Formulario Nuevo Depósito
  const [selectedContractNumber, setSelectedContractNumber] = useState<string>(contracts[0]?.contractNumber || "CTR-2026-001");
  const [provider, setProvider] = useState<CryptoProvider>("TRON_TRC20_WALLET");
  const [txHashOrPayId, setTxHashOrPayId] = useState<string>("");
  const [amountUSDT, setAmountUSDT] = useState<number>(35);
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

  const currentContract = contracts.find(c => c.contractNumber === selectedContractNumber) || contracts[0];

  const handleVerifyTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHashOrPayId.trim()) return;

    const record = CryptoReconciliationEngine.verifyAndRecordPayment({
      txHashOrPayId: txHashOrPayId.trim(),
      provider,
      contractNumber: currentContract.contractNumber,
      clientName: currentContract.clientName,
      amountUSDT
    });

    setDeposits(CryptoReconciliationEngine.getAllDeposits());
    setTxHashOrPayId("");
    setSuccessBanner("¡Abono Cripto USDT conciliado exitosamente! Recibo #" + record.id + " con sello " + record.sha256Receipt.slice(0, 16) + "...");
    setTimeout(() => setSuccessBanner(""), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-2xl border border-amber-500/20">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Conciliador Cripto USDT (Binance Pay / Red TRC-20)</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.2 rounded-full font-mono">
                  BLOCKCHAIN AUDITOR
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Validación de transferencias USDT en la red Tron y Binance Pay ID con recibo SHA-256
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

        {/* CONTENIDO MODAL */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Banner de Éxito */}
          {successBanner && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
              <span>{successBanner}</span>
            </div>
          )}

          {/* Bóvedas Corporativas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 space-y-1">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase block font-sans">🟡 BINANCE PAY ID CORPORATIVO:</span>
              <p className="text-zinc-900 dark:text-zinc-100 text-sm font-bold">{CryptoReconciliationEngine.CORPORATE_WALLETS.binancePayId}</p>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans">Abono directo sin comisiones de red</span>
            </div>

            <div className="p-4 rounded-2xl border border-red-500/30 bg-red-950/20 space-y-1">
              <span className="text-[10px] text-red-400 font-bold uppercase block font-sans">🔴 WALLET TRON TRC-20 (USDT):</span>
              <p className="text-zinc-900 dark:text-zinc-100 text-xs truncate font-bold">{CryptoReconciliationEngine.CORPORATE_WALLETS.tronTrc20Address}</p>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans">Confirmación en 19 bloques de red</span>
            </div>
          </div>

          {/* Formulario Conciliación */}
          <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Conciliar Nuevo Depósito USDT</h4>
            
            <form onSubmit={handleVerifyTx} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">Cliente / Contrato</label>
                <select
                  value={selectedContractNumber}
                  onChange={e => setSelectedContractNumber(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs"
                >
                  {contracts.map(c => (
                    <option key={c.contractNumber} value={c.contractNumber}>
                      {c.clientName} (#{c.contractNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">Método Cripto</label>
                <select
                  value={provider}
                  onChange={e => setProvider(e.target.value as any)}
                  className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs"
                >
                  <option value="TRON_TRC20_WALLET">Tron TRC-20 (TXID Hash)</option>
                  <option value="BINANCE_PAY">Binance Pay ID</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">Monto USDT ($)</label>
                <input
                  type="number"
                  required
                  value={amountUSDT}
                  onChange={e => setAmountUSDT(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 font-bold font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-400 block mb-1 font-semibold">TXID o Pay ID</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    placeholder="Ej: 4f8a29b01c..."
                    value={txHashOrPayId}
                    onChange={e => setTxHashOrPayId(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                  />
                  <button
                    type="submit"
                    className="p-2.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs transition cursor-pointer shadow-md flex-shrink-0"
                  >
                    Conciliar
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Historial de Transacciones Cripto */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Historial de Transacciones Cripto Validadas</h4>

            <div className="space-y-2.5">
              {deposits.map(dep => (
                <div 
                  key={dep.id}
                  className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 font-sans">{dep.clientName}</span>
                      <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">#{dep.contractNumber}</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.2 rounded font-mono font-bold">
                        ● {dep.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 font-mono text-slate-700 dark:text-zinc-300">
                      <p>Monto: <strong className="text-emerald-700 dark:text-emerald-400">{dep.amountUSDT} USDT</strong></p>
                      <p>Red: <strong className="text-amber-700 dark:text-amber-400">{dep.provider}</strong></p>
                      <p>Confirmaciones: <strong className="text-zinc-900 dark:text-zinc-100">{dep.networkConfirmations}</strong></p>
                    </div>

                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono block truncate">
                      Hash/PayID: {dep.txHashOrPayId} • Sello: {dep.sha256Receipt}
                    </span>
                  </div>

                  <div className="flex-shrink-0">
                    <span className="text-[10px] bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 px-2.5 py-1 rounded font-mono border border-zinc-200 dark:border-zinc-800">
                      {dep.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
