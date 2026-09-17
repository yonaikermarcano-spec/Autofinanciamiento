"use client";

import React, { useState, useEffect } from "react";
import { Bike, X } from "lucide-react";
import { LocalDB } from "../../modules/local-db";
import { VehicleSpec } from "../../types";
import { toast } from "../common/GoogleSnackbar";

export default function NewVehicleModal({
  isOpen,
  onClose,
  onVehicleCreated
}: {
  isOpen: boolean;
  onClose: () => void;
  onVehicleCreated: (vehicle: VehicleSpec) => void;
}) {
  const [type, setType] = useState<"MOTO" | "CARRO">("MOTO");
  const [brand, setBrand] = useState("Bera");
  const [model, setModel] = useState("SBR 150cc");
  const [color, setColor] = useState("Negro Brillante");
  const [vin, setVin] = useState("8B8BERA2026VIN" + Math.floor(1000 + Math.random() * 9000));
  const [engine, setEngine] = useState("162FMJ-" + Math.floor(100000 + Math.random() * 900000));
  const [dealerPrice, setDealerPrice] = useState(1100);
  const [retailPrice, setRetailPrice] = useState(1450);

  
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

    const newVeh: VehicleSpec = {
      id: `veh-${Date.now()}`,
      type,
      brand,
      model,
      year: 2026,
      color,
      vinChassis: vin,
      engineSerial: engine,
      plate: "EN TRÁMITE",
      dealerPriceUSD: Number(dealerPrice),
      dealerPriceOriginalUSD: Number(dealerPrice),
      isDealerPriceFrozen: false,
      retailPriceUSD: Number(retailPrice),
      isPriceLocked: false,
      status: "IN_STOCK"
    };

    LocalDB.addVehicle(newVeh);
    onVehicleCreated(newVeh);
    onClose();
    toast.success(`Unidad ${newVeh.brand} ${newVeh.model} registrada en inventario.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl shadow-zinc-900/15 overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans"
      >
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-950/50">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base flex items-center space-x-2">
            <Bike className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <span>Registrar Unidad al Inventario</span>
          </h3>
          <button onClick={onClose} className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300 dark:text-zinc-400">Tipo de Vehículo</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value as any)}
                className="w-full bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-200 dark:border-zinc-700 rounded-2xl p-2.5 text-zinc-900 dark:text-zinc-100 mt-1"
              >
                <option value="MOTO">Moto (150cc / 200cc)</option>
                <option value="CARRO">Carro / Sedán</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300 dark:text-zinc-400">Marca</label>
              <input 
                type="text" 
                value={brand} 
                onChange={e => setBrand(e.target.value)}
                className="w-full bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-200 dark:border-zinc-700 rounded-2xl p-2.5 text-zinc-900 dark:text-zinc-100 mt-1" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300 dark:text-zinc-400">Modelo</label>
              <input 
                type="text" 
                value={model} 
                onChange={e => setModel(e.target.value)}
                className="w-full bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-200 dark:border-zinc-700 rounded-2xl p-2.5 text-zinc-900 dark:text-zinc-100 mt-1" 
              />
            </div>
            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300 dark:text-zinc-400">Color</label>
              <input 
                type="text" 
                value={color} 
                onChange={e => setColor(e.target.value)}
                className="w-full bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-200 dark:border-zinc-700 rounded-2xl p-2.5 text-zinc-900 dark:text-zinc-100 mt-1" 
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-zinc-700 dark:text-zinc-300">Serial de Carrocería (VIN)</label>
            <input 
              type="text" 
              value={vin} 
              onChange={e => setVin(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-2xl p-2.5 text-zinc-900 dark:text-zinc-100 mt-1 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-google-blue-500/30" 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">Costo Ensambladora ($)</label>
              <input 
                type="number" 
                value={dealerPrice} 
                onChange={e => setDealerPrice(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-2xl p-2.5 text-zinc-900 dark:text-zinc-100 mt-1 font-bold focus:outline-none focus:ring-2 focus:ring-google-blue-500/30" 
              />
            </div>
            <div>
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">Precio Venta Retail ($)</label>
              <input 
                type="number" 
                value={retailPrice} 
                onChange={e => setRetailPrice(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-2xl p-2.5 text-zinc-900 dark:text-zinc-100 mt-1 font-bold text-google-green-600 dark:text-google-green-400 focus:outline-none focus:ring-2 focus:ring-google-blue-500/30" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-google-green-600 hover:bg-google-green-700 text-white font-semibold py-3 rounded-full transition mt-2 shadow-sm active:scale-95 cursor-pointer"
          >
            Guardar en Inventario
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}