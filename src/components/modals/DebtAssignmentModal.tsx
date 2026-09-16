"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  UserCheck,
  FileSignature,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Printer,
  Sparkles,
  Bike
} from "lucide-react";
import { DebtAssignmentEngine, DebtAssignmentResult } from "../../modules/debt-assignment";
import { LoanContract } from "../../types";

interface DebtAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contracts: LoanContract[];
  bcvRate: number;
}

export default function DebtAssignmentModal({
  isOpen,
  onClose,
  contracts,
  bcvRate
}: DebtAssignmentModalProps) {
  const [selectedContractNumber, setSelectedContractNumber] = useState<string>(contracts[0]?.contractNumber || "CTR-2026-001");
  const [transferFeeUSD, setTransferFeeUSD] = useState<number>(50);
  const [reason, setReason] = useState<string>("Cesión voluntaria por viaje / imposibilidad de pago.");

  // Nuevo Titular
  const [newName, setNewName] = useState<string>("Alejandro José Rivas");
  const [newDocId, setNewDocId] = useState<string>("V-22.918.402");
  const [newPhone, setNewPhone] = useState<string>("0414-2291048");
  const [newAddress, setNewAddress] = useState<string>("Av. Sucre, Catia, Caracas");
  const [guarantorName, setGuarantorName] = useState<string>("María Elena Rivas");
  const [guarantorDocId, setGuarantorDocId] = useState<string>("V-14.829.102");
  const [guarantorPhone, setGuarantorPhone] = useState<string>("0416-8819201");

  const [successMessage, setSuccessMessage] = useState<string>("");

  
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

  const transferResult: DebtAssignmentResult = DebtAssignmentEngine.calculateAndPrepareTransfer(
    currentContract,
    {
      originalContractNumber: selectedContractNumber,
      transferFeeUSD,
      newClient: {
        name: newName,
        docId: newDocId,
        phone: newPhone,
        address: newAddress,
        guarantorName,
        guarantorDocId,
        guarantorPhone
      },
      reason
    },
    bcvRate
  );

  const handleExecuteTransfer = () => {
    DebtAssignmentEngine.executeTransfer(transferResult, {
      originalContractNumber: selectedContractNumber,
      transferFeeUSD,
      newClient: {
        name: newName,
        docId: newDocId,
        phone: newPhone,
        address: newAddress,
        guarantorName,
        guarantorDocId,
        guarantorPhone
      },
      reason
    });

    setSuccessMessage("¡Traspaso de deuda formalizado con éxito! Se emitió el Contrato Tripartito #" + transferResult.tripartiteAgreementCode + " y el nuevo Pagaré #" + transferResult.newPromissoryNoteId + " con sello " + transferResult.sha256Seal.slice(0, 16) + "...");
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Cesión de Deuda & Traspaso de Crédito entre Clientes</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.2 rounded-full font-mono">
                  ACUERDO TRIPARTITO
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">
                Sustitución de titular, cesión de reserva de dominio, nuevo pagaré y finiquito al cedente
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

        {/* CONTENIDO MODAL */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Banner de Éxito */}
          {successMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Formulario Traspaso */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Columna Izquierda: Datos del Nuevo Titular (Col 6) */}
            <div className="lg:col-span-6 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase text-[11px] flex items-center space-x-1.5">
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  <span>1. Datos del Nuevo Titular (Cesionario)</span>
                </span>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Contrato a Traspasar (Cedente Actual):</label>
                <select
                  value={selectedContractNumber}
                  onChange={e => setSelectedContractNumber(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                >
                  {contracts.map(c => (
                    <option key={c.contractNumber} value={c.contractNumber}>
                      {c.clientName} (#{c.contractNumber} - Saldo: ${c.totalOutstandingUSD})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Nombre y Apellido</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs"
                  />
                </div>

                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Cédula de Identidad</label>
                  <input
                    type="text"
                    value={newDocId}
                    onChange={e => setNewDocId(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Teléfono</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Tasa Traspaso ($ USD)</label>
                  <input
                    type="number"
                    value={transferFeeUSD}
                    onChange={e => setTransferFeeUSD(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-emerald-400 font-bold font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Dirección Domiciliaria</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={e => setNewAddress(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs"
                />
              </div>

              {/* Fiador del Nuevo Titular */}
              <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <span className="font-semibold text-zinc-300 block text-[11px]">Fiador / Aval Solidario del Nuevo Titular:</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={guarantorName}
                    onChange={e => setGuarantorName(e.target.value)}
                    className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="C.I."
                    value={guarantorDocId}
                    onChange={e => setGuarantorDocId(e.target.value)}
                    className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Teléfono"
                    value={guarantorPhone}
                    onChange={e => setGuarantorPhone(e.target.value)}
                    className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Columna Derecha: Resumen Legal y Ejecución (Col 6) */}
            <div className="lg:col-span-6 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-4">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">2. CONDICIONES Y DOCUMENTOS DEL TRASPASO</span>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-sans block">Titular Saliente (Cedente):</span>
                  <strong className="text-zinc-300">{transferResult.outgoingClientName}</strong>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block">CI: {transferResult.outgoingClientDocId}</span>
                </div>

                <div className="p-3.5 bg-indigo-950/20 rounded-2xl border border-indigo-500/30">
                  <span className="text-[10px] text-indigo-400 font-sans block">Nuevo Titular (Cesionario):</span>
                  <strong className="text-zinc-900 dark:text-zinc-100">{transferResult.newClientName}</strong>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block">CI: {transferResult.newClientDocId}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-sans block">Deuda Asumida:</span>
                  <strong className="text-emerald-400">{"$" + transferResult.transferredOutstandingUSD} USD</strong>
                </div>

                <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-sans block">Cuotas Restantes:</span>
                  <strong className="text-zinc-900 dark:text-zinc-100">{transferResult.remainingQuotasCount} Cuotas</strong>
                </div>

                <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-sans block">Tasa Administrativa:</span>
                  <strong className="text-amber-400">{"$" + transferResult.transferFeeUSD} USD</strong>
                </div>
              </div>

              {/* Ficha Legal */}
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-1.5">
                    <FileSignature className="w-4 h-4 text-indigo-400" />
                    <span>Documentos Generados Automáticamente</span>
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.2 rounded font-mono">
                    3 TÍTULOS LEGALES
                  </span>
                </div>

                <p className="text-zinc-300 font-mono text-[11px]">
                  1. Contrato Tripartito: <strong className="text-zinc-900 dark:text-zinc-100">{transferResult.tripartiteAgreementCode}</strong>
                </p>
                <p className="text-zinc-300 font-mono text-[11px]">
                  2. Nuevo Pagaré Mercantil: <strong className="text-zinc-900 dark:text-zinc-100">{transferResult.newPromissoryNoteId}</strong>
                </p>
                <p className="text-zinc-300 font-mono text-[11px]">
                  3. Finiquito al Cedente: <strong className="text-zinc-900 dark:text-zinc-100">{transferResult.outgoingReleaseReceiptId}</strong>
                </p>
                <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono truncate">
                  Sello Criptográfico: {transferResult.sha256Seal}
                </p>
              </div>

              {/* Botón Ejecutar */}
              <div className="pt-2">
                <button
                  onClick={handleExecuteTransfer}
                  className="w-full p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-indigo-950/50"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Formalizar Traspaso & Generar Títulos Tripartitos</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
