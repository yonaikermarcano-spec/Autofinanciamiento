"use client";

import React, { useState } from "react";
import Dashboard from "@/components/Dashboard";
import ClientPortal from "@/components/ClientPortal";
import { Building2, Smartphone } from "lucide-react";

export default function Home() {
  const [viewMode, setViewMode] = useState<"ADMIN" | "CLIENT">("ADMIN");

  return (
    <div className="relative">
      {/* Selector Flotante de Modo Dual */}
      <div className="fixed bottom-4 right-4 z-50 bg-slate-900/90 backdrop-blur border border-slate-700 p-1.5 rounded-2xl shadow-2xl flex items-center space-x-1">
        <button
          onClick={() => setViewMode("ADMIN")}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            viewMode === "ADMIN" 
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/50" 
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Vista Financiadora</span>
        </button>

        <button
          onClick={() => setViewMode("CLIENT")}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            viewMode === "CLIENT" 
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/50" 
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Vista Portal Cliente</span>
        </button>
      </div>

      {viewMode === "ADMIN" ? (
        <Dashboard />
      ) : (
        <ClientPortal onSwitchToAdmin={() => setViewMode("ADMIN")} />
      )}
    </div>
  );
}