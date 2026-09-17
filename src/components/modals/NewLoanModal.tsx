"use client";

import React, { useState, useEffect } from "react";
import { FileSignature, X } from "lucide-react";
import { LocalDB } from "../../modules/local-db";
import { FinancialCore } from "../../modules/financial-core";
import { LoanContract } from "../../types";
import { toast } from "../common/GoogleSnackbar";

export default function NewLoanModal({
  isOpen,
  onClose,
  onLoanCreated
}: {
  isOpen: boolean;
  onClose: () => void;
  onLoanCreated: (contract: LoanContract) => void;
}) {
  const contracts = LocalDB.getAllContracts();
  const vehicles = LocalDB.getAllVehicles();

  const [clientId, setClientId] = useState(contracts[0]?.clientId || "");
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || "");
  const [downPercent, setDownPercent] = useState(30);
  const [quotasCount, setQuotasCount] = useState(12);
  const [deliveryType, setDeliveryType] = useState<"IMMEDIATE" | "ACCUMULATED_QUOTAS">("ACCUMULATED_QUOTAS");

  
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find(v => v.id === vehicleId) || vehicles[0];
    const client = contracts.find(c => c.clientId === clientId) || contracts[0];

    const initialCosts = FinancialCore.calculateInitialCosts({
      vehiclePriceUSD: veh.retailPriceUSD,
      downPaymentPercent: Number(downPercent)
    });

    const financed = veh.retailPriceUSD - initialCosts.vehicleDownPaymentUSD;
    const schedule = FinancialCore.generatePaymentSchedule({
      financedAmountUSD: financed,
      annualInterestRatePercent: 18,
      totalQuotas: Number(quotasCount),
      frequency: "MONTHLY"
    });

    const isDelivered = deliveryType === "IMMEDIATE";
    const newContract: LoanContract = {
      id: `ctr-${Date.now()}`,
      tenantId: "tenant-autolending",
      contractNumber: `CTR-VEH-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientId: client.clientId,
      clientName: client.clientName,
      clientDocId: client.clientDocId,
      clientPhone: client.clientPhone,
      clientAddress: client.clientAddress,
      guarantor: client.guarantor || {
        name: "Elena Mendoza",
        docId: "V-20.192.481",
        phone: "+58 414-990-1289",
        address: "Caracas"
      },
      vehicle: { ...veh, status: isDelivered ? "DELIVERED" : "ASSIGNED" },
      concessionairePriceUSD: veh.dealerPriceUSD,
      isDealerPriceFrozen: isDelivered,
      companyPriceUSD: veh.retailPriceUSD,
      lateFeesPendingUSD: 0,
      lateFeesPaidUSD: 0,
      ivaPendingUSD: Number(((financed * 0.18 * 0.16)).toFixed(2)),
      ivaPaidUSD: 0,
      igtfPendingUSD: 0,
      igtfPaidUSD: 0,
      quotasPendingCount: Number(quotasCount),
      quotasPendingAmountUSD: financed,
      quotasPaidCount: 0,
      quotasPaidAmountUSD: 0,
      quotasPaidPercent: 0,
      deliveryStatus: isDelivered ? "ENTREGADO" : "ACUMULANDO_CUOTAS",
      refundStatus: "SIN_REEMBOLSO",
      documentsStatus: "EXPEDIENTE_COMPLETO",
      physicalInvoiceStatus: "PENDIENTE_EMISION",
      vehicleRegistrationStatus: "TRAMITE_INTT_EN_CURSO",
      overallProgressPercent: isDelivered ? 50.0 : 25.0,
      initialCosts,
      financedAmountUSD: financed,
      interestRateAnnual: 18,
      frequency: "MONTHLY",
      totalQuotas: Number(quotasCount),
      deliveryMilestone: {
        type: deliveryType,
        requiredQuotasToDeliver: deliveryType === "ACCUMULATED_QUOTAS" ? 3 : 0,
        isDelivered
      },
      schedule,
      totalPaidUSD: 0,
      totalOutstandingUSD: financed,
      status: "ACTIVE",
      creationDate: new Date().toISOString().split("T")[0]
    };

    LocalDB.addContract(newContract);
    onLoanCreated(newContract);
    onClose();
    toast.success(`Financiamiento emitido: Contrato #${newContract.contractNumber} activado con éxito.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans"
      >
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/70 dark:bg-zinc-950/70">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base flex items-center space-x-2">
            <FileSignature className="w-5 h-5 text-google-green-600 dark:text-google-green-500" />
            <span>Emitir Nuevo Crédito Vehicular</span>
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Seleccionar Cliente</label>
              <select 
                value={clientId} 
                onChange={e => setClientId(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-google-blue-500 transition"
              >
                {contracts.map(c => (
                  <option key={c.id} value={c.clientId}>{c.clientName} ({c.clientDocId})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Seleccionar Unidad del Inventario</label>
              <select 
                value={vehicleId} 
                onChange={e => setVehicleId(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-google-blue-500 transition"
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.brand} {v.model} - ${v.retailPriceUSD} USD ({v.color})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">% Inicial</label>
                <input 
                  type="number" 
                  value={downPercent} 
                  onChange={e => setDownPercent(Number(e.target.value))}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-zinc-100 font-bold focus:outline-none focus:border-google-blue-500 transition" 
                />
              </div>
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Plazo (Meses)</label>
                <select 
                  value={quotasCount} 
                  onChange={e => setQuotasCount(Number(e.target.value))}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-google-blue-500 transition"
                >
                  <option value={6}>6 Meses</option>
                  <option value={12}>12 Meses</option>
                  <option value={18}>18 Meses</option>
                  <option value={24}>24 Meses</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Hito de Entrega del Vehículo</label>
              <select 
                value={deliveryType} 
                onChange={e => setDeliveryType(e.target.value as any)}
                className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-google-blue-500 transition"
              >
                <option value="ACCUMULATED_QUOTAS">Entrega por Cuotas Acumuladas (Inicial + 3 Cuotas)</option>
                <option value="IMMEDIATE">Entrega Inmediata tras pago de Inicial</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-google-green-600 hover:bg-google-green-500 text-white font-bold py-3 rounded-xl transition mt-3 shadow-md shadow-google-green-900/30 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Generar Contrato & Activar Plan de Abonos</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}