"use client";

import React, { useState, useEffect } from "react";
import { Users, X } from "lucide-react";
import { LocalDB } from "../../modules/local-db";
import { FinancialCore } from "../../modules/financial-core";
import { LoanContract } from "../../types";
import { toast } from "../common/GoogleSnackbar";

export default function NewClientModal({
  isOpen,
  onClose,
  onClientCreated
}: {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (contract: LoanContract) => void;
}) {
  const [name, setName] = useState("");
  const [docId, setDocId] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [guarantorName, setGuarantorName] = useState("");
  const [guarantorDocId, setGuarantorDocId] = useState("");
  const [guarantorPhone, setGuarantorPhone] = useState("");

  
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
    if (!name || !docId) {
      toast.error("Por favor ingresa nombre y cédula del cliente.");
      return;
    }

    const defaultVeh = LocalDB.getAllVehicles()[0] || {
      id: "veh-001",
      type: "MOTO",
      brand: "Bera",
      model: "SBR 150cc",
      year: 2026,
      color: "Negro",
      vinChassis: "8B8BERA" + Date.now(),
      engineSerial: "162FMJ" + Date.now(),
      dealerPriceUSD: 1100,
      dealerPriceOriginalUSD: 1100,
      isDealerPriceFrozen: false,
      retailPriceUSD: 1450,
      isPriceLocked: false,
      status: "ASSIGNED"
    };

    const initialCosts = FinancialCore.calculateInitialCosts({
      vehiclePriceUSD: defaultVeh.retailPriceUSD,
      downPaymentPercent: 30
    });

    const financed = defaultVeh.retailPriceUSD - initialCosts.vehicleDownPaymentUSD;
    const schedule = FinancialCore.generatePaymentSchedule({
      financedAmountUSD: financed,
      annualInterestRatePercent: 18,
      totalQuotas: 12,
      frequency: "MONTHLY"
    });

    const newContract: LoanContract = {
      id: `ctr-${Date.now()}`,
      tenantId: "tenant-autolending",
      contractNumber: `CTR-VEH-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientId: `cli-${Date.now()}`,
      clientName: name,
      clientDocId: docId,
      clientPhone: phone || "+58 412-000-0000",
      clientAddress: address || "Caracas, Venezuela",
      guarantor: {
        name: guarantorName || "Elena Mendoza",
        docId: guarantorDocId || "V-20.192.481",
        phone: guarantorPhone || "+58 414-990-1289",
        address: "Caracas"
      },
      vehicle: defaultVeh,
      concessionairePriceUSD: defaultVeh.dealerPriceUSD,
      isDealerPriceFrozen: false,
      companyPriceUSD: defaultVeh.retailPriceUSD,
      lateFeesPendingUSD: 0,
      lateFeesPaidUSD: 0,
      ivaPendingUSD: 24.50,
      ivaPaidUSD: 0,
      igtfPendingUSD: 0,
      igtfPaidUSD: 0,
      quotasPendingCount: 12,
      quotasPendingAmountUSD: financed,
      quotasPaidCount: 0,
      quotasPaidAmountUSD: 0,
      quotasPaidPercent: 0,
      deliveryStatus: "ACUMULANDO_CUOTAS",
      refundStatus: "SIN_REEMBOLSO",
      documentsStatus: "EN_REVISION",
      physicalInvoiceStatus: "PENDIENTE_EMISION",
      vehicleRegistrationStatus: "TRAMITE_INTT_EN_CURSO",
      overallProgressPercent: 23.0,
      initialCosts,
      financedAmountUSD: financed,
      interestRateAnnual: 18,
      frequency: "MONTHLY",
      totalQuotas: 12,
      deliveryMilestone: {
        type: "ACCUMULATED_QUOTAS",
        requiredQuotasToDeliver: 3,
        isDelivered: false
      },
      schedule,
      totalPaidUSD: 0,
      totalOutstandingUSD: financed,
      status: "ACTIVE",
      creationDate: new Date().toISOString().split("T")[0]
    };

    LocalDB.addContract(newContract);
    onClientCreated(newContract);
    onClose();
    toast.success(`Cliente ${name} registrado y activado en CRM.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans"
      >
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-950/50">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base flex items-center space-x-2">
            <Users className="w-5 h-5 text-google-green-600 dark:text-google-green-400" />
            <span>Registrar Nuevo Cliente & Fiador</span>
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">Nombre y Apellido del Cliente</label>
              <input 
                type="text" 
                required 
                placeholder="Ej. Juan Pérez" 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-2xl p-2.5 text-zinc-900 dark:text-zinc-100 mt-1 focus:outline-none focus:ring-2 focus:ring-google-blue-500/30" 
              />
            </div>
            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">Cédula de Identidad (CI)</label>
              <input 
                type="text" 
                required 
                placeholder="Ej. V-20.123.456" 
                value={docId} 
                onChange={e => setDocId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-2xl p-2.5 text-zinc-900 dark:text-zinc-100 mt-1 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-google-blue-500/30" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">Teléfono (WhatsApp)</label>
              <input 
                type="text" 
                placeholder="+58 412-000-0000" 
                value={phone} 
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-2xl p-2.5 text-zinc-900 dark:text-zinc-100 mt-1 focus:outline-none focus:ring-2 focus:ring-google-blue-500/30" 
              />
            </div>
            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">Dirección Domiciliaria</label>
              <input 
                type="text" 
                placeholder="Sector, Calle, Casa" 
                value={address} 
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-2xl p-2.5 text-zinc-900 dark:text-zinc-100 mt-1 focus:outline-none focus:ring-2 focus:ring-google-blue-500/30" 
              />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-zinc-800 pt-3">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">Datos del Fiador / Aval Solidario:</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Nombre Fiador</label>
                <input 
                  type="text" 
                  placeholder="Ej. Pedro Pérez" 
                  value={guarantorName} 
                  onChange={e => setGuarantorName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-2xl p-2 text-zinc-900 dark:text-zinc-100 mt-1 focus:outline-none" 
                />
              </div>
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">CI Fiador</label>
                <input 
                  type="text" 
                  placeholder="V-19.882.100" 
                  value={guarantorDocId} 
                  onChange={e => setGuarantorDocId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-2xl p-2 text-zinc-900 dark:text-zinc-100 mt-1 font-mono uppercase focus:outline-none" 
                />
              </div>
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Teléfono Fiador</label>
                <input 
                  type="text" 
                  placeholder="+58 414-000-0000" 
                  value={guarantorPhone} 
                  onChange={e => setGuarantorPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-2xl p-2 text-zinc-900 dark:text-zinc-100 mt-1 focus:outline-none" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-google-green-600 hover:bg-google-green-700 text-white font-semibold py-3 rounded-full transition mt-2 shadow-sm active:scale-95 cursor-pointer"
          >
            Guardar Cliente & Activar en CRM
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}