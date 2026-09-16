"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  X, 
  Search,
  Filter,
  RotateCcw,
  AlertTriangle, 
  Bike, 
  Navigation, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  UserX, 
  PhoneCall, 
  FileText, 
  FileCheck,
  ArrowUpDown,
  SlidersHorizontal
} from "lucide-react";
import { LoanContract } from "../../types";
import { DocType } from "./PrintDocumentModal";

export type KpiCategory = 
  | "EXPIRADO"
  | "MOROSOS"
  | "ENTREGADAS"
  | "POR_ENTREGAR"
  | "POR_RECUPERAR"
  | "POR_VISITAR"
  | "POR_REEMBOLSAR"
  | "CUOTAS_X_COBRAR"
  | "MORAS_X_COBRAR"
  | "TOTAL_X_COBRAR";

export default function KpiDrillDownModal({
  isOpen,
  onClose,
  kpiType,
  contracts,
  onSelectContract,
  onNavigateToSection,
  onOpenPrintDoc
}: {
  isOpen: boolean;
  onClose: () => void;
  kpiType: KpiCategory | null;
  contracts: LoanContract[];
  onSelectContract: (contractId: string) => void;
  onNavigateToSection: (section: string) => void;
  onOpenPrintDoc?: (type: DocType, contractId: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("TODOS");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [overdueFilter, setOverdueFilter] = useState("TODOS");
  const [sortBy, setSortBy] = useState("DEFAULT");

  if (!isOpen || !kpiType) return null;

  // Filtrado de contratos según el KPI seleccionado
  let baseCategoryContracts: LoanContract[] = [];
  let title = "";
  let description = "";
  let icon = AlertTriangle;
  let themeColor = "amber";

  switch (kpiType) {
    case "EXPIRADO":
      baseCategoryContracts = contracts.filter(c => c.status === "EXPIRADO" || c.isExpiredPermanently);
      title = "Clientes con Contrato EXPIRADO (Suspensión Permanente)";
      description = "Clientes que NO tienen vehículo entregado y dejaron de pagar más de 3 meses continuos. Quedan suspendidos permanentemente sin derecho a retiro de los fondos aportados por incumplimiento contractual.";
      icon = UserX;
      themeColor = "red";
      break;

    case "MOROSOS":
      baseCategoryContracts = contracts.filter(c => (c.overdueMonthsCount && c.overdueMonthsCount > 0) || c.status === "IN_DEFAULT" || c.status === "POR_RECUPERAR");
      title = "Directorio de Clientes MOROSOS";
      description = "Clientes que presentan cuotas vencidas impagas y recargos por mora acumulados.";
      icon = AlertTriangle;
      themeColor = "amber";
      break;

    case "ENTREGADAS":
      baseCategoryContracts = contracts.filter(c => c.deliveryStatus === "ENTREGADO" || c.deliveryStatus === "POR_RECUPERAR");
      title = "Motos / Carros ENTREGADOS en Calle";
      description = "Unidades que ya fueron entregadas físicamente al cliente y se encuentran en posesión activa en la calle.";
      icon = Bike;
      themeColor = "emerald";
      break;

    case "POR_ENTREGAR":
      baseCategoryContracts = contracts.filter(c => c.deliveryStatus === "ACUMULANDO_CUOTAS" || c.deliveryStatus === "PENDIENTE_INICIAL" || c.deliveryStatus === "POR_VISITAR" || c.deliveryStatus === "LISTO_PARA_ENTREGA");
      title = "Motos / Carros POR ENTREGAR (En Proceso de Adjudicación)";
      description = "Clientes en fase de acumulación de cuotas o trámite administrativo previos al despacho del vehículo.";
      icon = Clock;
      themeColor = "blue";
      break;

    case "POR_RECUPERAR":
      baseCategoryContracts = contracts.filter(c => c.deliveryStatus === "POR_RECUPERAR" || c.status === "POR_RECUPERAR");
      title = "Vehículos POR RECUPERAR (Mora > 2 Meses con Moto Entregada)";
      description = "Clientes a los que SÍ se les entregó el vehículo y dejaron de pagar más de 2 meses. Pasan inmediatamente a la orden de visita e inspección para recuperación física en campo.";
      icon = Navigation;
      themeColor = "rose";
      break;

    case "POR_VISITAR":
      baseCategoryContracts = contracts.filter(c => c.deliveryStatus === "POR_VISITAR" || c.status === "POR_VISITAR");
      title = "Clientes POR VISITAR (Listos para Verificación Domiciliaria)";
      description = "Clientes que NO tienen vehículo entregado pero ya alcanzaron el monto y cuotas requeridas (ej. Inicial + 3 Cuotas). Pasan al estado de visita presencial a su vivienda y fiadores.";
      icon = MapPin;
      themeColor = "purple";
      break;

    case "POR_REEMBOLSAR":
      baseCategoryContracts = contracts.filter(c => c.refundStatus === "POR_REEMBOLSAR" || c.refundStatus === "APROBADO" || c.status === "POR_REEMBOLSAR");
      title = "Casos Especiales POR REEMBOLSAR (Aprobados por Gerencia)";
      description = "Clientes con justificación comprobada y aprobada por gerencia general. Regla de liquidación: la empresa retiene el 30% por gastos de funcionamiento y devuelve el 70% restante.";
      icon = DollarSign;
      themeColor = "cyan";
      break;

    case "CUOTAS_X_COBRAR":
      baseCategoryContracts = contracts.filter(c => c.quotasPendingCount > 0);
      title = "Detalle de Cuotas por Cobrar de la Cartera";
      description = "Desglose de contratos con cuotas pendientes de vencimiento o en periodo regular de amortización.";
      icon = DollarSign;
      themeColor = "emerald";
      break;

    case "MORAS_X_COBRAR":
      baseCategoryContracts = contracts.filter(c => (c.lateFeesPendingUSD || 0) > 0);
      title = "Detalle de Moras Acumuladas por Cobrar";
      description = "Relación de contratos con recargos por retraso de pago activos.";
      icon = AlertTriangle;
      themeColor = "amber";
      break;

    case "TOTAL_X_COBRAR":
      baseCategoryContracts = contracts.filter(c => c.totalOutstandingUSD > 0);
      title = "Total Consolidado por Cobrar (Cuotas + Moras + Impuestos)";
      description = "Vista general de toda la cartera viva pendiente de recaudación en la empresa.";
      icon = ShieldAlert;
      themeColor = "emerald";
      break;
  }

  // Obtener lista de marcas disponibles en los contratos de esta categoría
  const availableBrands = Array.from(new Set(baseCategoryContracts.map(c => c.vehicle?.brand).filter(Boolean)));

  // Aplicar buscador en tiempo real y filtros dinámicos
  const filteredAndSortedContracts = baseCategoryContracts.filter(c => {
    // 1. Buscador libre
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      const matchesClient = 
        c.clientName.toLowerCase().includes(term) ||
        c.clientDocId.toLowerCase().includes(term) ||
        c.contractNumber.toLowerCase().includes(term) ||
        c.clientPhone.toLowerCase().includes(term) ||
        c.clientAddress.toLowerCase().includes(term);

      const matchesGuarantor = 
        (c.guarantor?.name && c.guarantor.name.toLowerCase().includes(term)) ||
        (c.guarantor?.docId && c.guarantor.docId.toLowerCase().includes(term)) ||
        (c.guarantor?.phone && c.guarantor.phone.toLowerCase().includes(term));

      const matchesVehicle = 
        (c.vehicle?.brand && c.vehicle.brand.toLowerCase().includes(term)) ||
        (c.vehicle?.model && c.vehicle.model.toLowerCase().includes(term)) ||
        (c.vehicle?.vinChassis && c.vehicle.vinChassis.toLowerCase().includes(term)) ||
        (c.vehicle?.plate && c.vehicle.plate.toLowerCase().includes(term));

      if (!matchesClient && !matchesGuarantor && !matchesVehicle) {
        return false;
      }
    }

    // 2. Filtro por Marca
    if (brandFilter !== "TODOS") {
      if (c.vehicle?.brand !== brandFilter) return false;
    }

    // 3. Filtro por Estatus Operativo
    if (statusFilter !== "TODOS") {
      if (c.deliveryStatus !== statusFilter && c.status !== statusFilter) return false;
    }

    // 4. Filtro por Rango de Mora
    if (overdueFilter === "CON_MORA") {
      if ((c.lateFeesPendingUSD || 0) <= 0 && (!c.overdueMonthsCount || c.overdueMonthsCount === 0)) return false;
    } else if (overdueFilter === "SIN_MORA") {
      if ((c.lateFeesPendingUSD || 0) > 0 || (c.overdueMonthsCount && c.overdueMonthsCount > 0)) return false;
    } else if (overdueFilter === "MORA_2_MESES") {
      if (!c.overdueMonthsCount || c.overdueMonthsCount < 2) return false;
    } else if (overdueFilter === "MORA_3_MESES") {
      if (!c.overdueMonthsCount || c.overdueMonthsCount < 3) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === "OUTSTANDING_DESC") return b.totalOutstandingUSD - a.totalOutstandingUSD;
    if (sortBy === "LATE_FEES_DESC") return (b.lateFeesPendingUSD || 0) - (a.lateFeesPendingUSD || 0);
    if (sortBy === "PROGRESS_DESC") return b.overallProgressPercent - a.overallProgressPercent;
    if (sortBy === "NAME_ASC") return a.clientName.localeCompare(b.clientName);
    if (sortBy === "NAME_DESC") return b.clientName.localeCompare(a.clientName);
    return 0;
  });

  const isAnyFilterActive = Boolean(
    searchTerm.trim() || 
    brandFilter !== "TODOS" || 
    statusFilter !== "TODOS" || 
    overdueFilter !== "TODOS" || 
    sortBy !== "DEFAULT"
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setBrandFilter("TODOS");
    setStatusFilter("TODOS");
    setOverdueFilter("TODOS");
    setSortBy("DEFAULT");
  };

  const IconComponent = icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] w-full p-6 space-y-4 shadow-2xl my-8" onClick={(e) => e.stopPropagation()}>
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-2xl text-emerald-400 border border-slate-750">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">{title}</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 mt-0.5 max-w-3xl leading-relaxed">{description}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 p-1 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 hover:bg-slate-800 transition"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BARRA DE BÚSQUEDA Y FILTROS INTEGRADA */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-200 dark:border-zinc-800 space-y-3">
          
          {/* Input de Búsqueda Universal */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por Nombre, C.I., N° Contrato, Teléfono, Fiador, Marca de Moto, Placa o VIN..."
              className="w-full bg-white dark:bg-white dark:bg-zinc-900 border border-slate-750 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 p-1"
                title="Borrar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Fila de Filtros y Ordenamiento */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 text-[11px] font-semibold flex items-center space-x-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>Filtros:</span>
              </span>

              {/* Filtro Marca */}
              <select
                value={brandFilter}
                onChange={e => setBrandFilter(e.target.value)}
                className="bg-white dark:bg-white dark:bg-zinc-900 border border-slate-750 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="TODOS">Todas las Marcas</option>
                {availableBrands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              {/* Filtro Estatus Operativo */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-white dark:bg-white dark:bg-zinc-900 border border-slate-750 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="TODOS">Todos los Estatus</option>
                <option value="ENTREGADO">Entregado</option>
                <option value="ACUMULANDO_CUOTAS">Acumulando Cuotas</option>
                <option value="POR_VISITAR">Por Visitar</option>
                <option value="POR_RECUPERAR">Por Recuperar</option>
                <option value="EXPIRADO">Expirado</option>
                <option value="POR_REEMBOLSAR">Por Reembolsar</option>
              </select>

              {/* Filtro Rango Mora */}
              <select
                value={overdueFilter}
                onChange={e => setOverdueFilter(e.target.value)}
                className="bg-white dark:bg-white dark:bg-zinc-900 border border-slate-750 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="TODOS">Estado de Mora: Todos</option>
                <option value="SIN_MORA">Al Día (Sin Mora)</option>
                <option value="CON_MORA">Con Mora Activa</option>
                <option value="MORA_2_MESES">Mora &ge; 2 Meses</option>
                <option value="MORA_3_MESES">Mora &ge; 3 Meses</option>
              </select>
            </div>

            {/* Ordenamiento y Limpiar */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-white dark:bg-white dark:bg-zinc-900 border border-slate-750 rounded-lg px-2.5 py-1 text-xs">
                <ArrowUpDown className="w-3 h-3 text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="DEFAULT" className="bg-white dark:bg-white dark:bg-zinc-900">Ordenar por: Defecto</option>
                  <option value="OUTSTANDING_DESC" className="bg-white dark:bg-white dark:bg-zinc-900">Mayor Saldo Pendiente ($)</option>
                  <option value="LATE_FEES_DESC" className="bg-white dark:bg-white dark:bg-zinc-900">Mayor Mora por Cobrar ($)</option>
                  <option value="PROGRESS_DESC" className="bg-white dark:bg-white dark:bg-zinc-900">Mayor % de Progreso</option>
                  <option value="NAME_ASC" className="bg-white dark:bg-white dark:bg-zinc-900">Nombre (A - Z)</option>
                  <option value="NAME_DESC" className="bg-white dark:bg-white dark:bg-zinc-900">Nombre (Z - A)</option>
                </select>
              </div>

              {isAnyFilterActive && (
                <button
                  onClick={handleResetFilters}
                  className="bg-zinc-100/80 dark:bg-zinc-800/80 hover:bg-slate-800 text-amber-400 border border-amber-500/30 px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 transition"
                  title="Restablecer filtros de búsqueda"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpiar</span>
                </button>
              )}
            </div>

          </div>

          {/* Resumen de Conteo de Resultados */}
          <div className="flex justify-between items-center text-[11px] font-mono text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 border-t border-slate-900 pt-2">
            <span>
              Mostrando <strong className="text-zinc-900 dark:text-zinc-100 font-bold">{filteredAndSortedContracts.length}</strong> de <strong className="text-slate-300">{baseCategoryContracts.length}</strong> registros en esta categoría
            </span>
            {isAnyFilterActive && (
              <span className="text-amber-400/90 font-sans">
                Filtros aplicados ({searchTerm ? `Búsqueda: "${searchTerm}"` : ""})
              </span>
            )}
          </div>

        </div>

        {/* LISTA DETALLADA DE CONTRATOS FILTRADOS */}
        <div className="space-y-3 overflow-y-auto pr-1">
          {filteredAndSortedContracts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs bg-slate-950/60 rounded-2xl border border-slate-850 space-y-2">
              <p className="font-semibold text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">No se encontraron clientes que coincidan con los criterios de búsqueda.</p>
              {isAnyFilterActive && (
                <button
                  onClick={handleResetFilters}
                  className="text-emerald-400 hover:underline font-medium text-xs inline-flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restablecer filtros y ver todos los {baseCategoryContracts.length} registros</span>
                </button>
              )}
            </div>
          ) : (
            filteredAndSortedContracts.map(c => (
              <div 
                key={c.id} 
                className="bg-slate-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-200 dark:border-zinc-800 hover:border-zinc-200 dark:border-zinc-700 transition space-y-3 text-xs shadow-md"
              >
                {/* Cabecera del Cliente */}
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-850 pb-2.5">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] border border-emerald-500/30">
                        #{c.contractNumber}
                      </span>
                      <strong className="text-zinc-900 dark:text-zinc-100 text-sm">{c.clientName}</strong>
                      <span className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">CI: {c.clientDocId}</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 mt-1">
                      Tlf: <strong className="text-slate-300 font-mono">{c.clientPhone}</strong> • Dirección: <span className="text-slate-300">{c.clientAddress}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block text-[10px]">VEHÍCULO FINANCIADO:</span>
                    <strong className="text-slate-200">{c.vehicle?.brand} {c.vehicle?.model}</strong>
                    <span className="text-[10px] text-slate-500 block font-mono">VIN: {c.vehicle?.vinChassis}</span>
                  </div>
                </div>

                {/* Fiador y Datos Específicos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white dark:bg-white dark:bg-zinc-900/60 p-3 rounded-lg border border-slate-850 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold">FIADOR / AVAL SOLIDARIO:</span>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">{c.guarantor?.name || "Sin fiador"}</p>
                    <p className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-mono">CI: {c.guarantor?.docId || "N/A"} • Tlf: {c.guarantor?.phone || "N/A"}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold">ESTADO DE CUENTA:</span>
                    <p className="font-mono text-emerald-400 font-bold">
                      {c.quotasPaidCount}/{c.totalQuotas} Pagadas ({c.quotasPaidPercent}%)
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-mono">Saldo: ${c.totalOutstandingUSD} USD • Mora: ${c.lateFeesPendingUSD || 0} USD</p>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold">ESTATUS OPERATIVO:</span>
                    <p className="font-mono text-amber-400 font-semibold">{c.deliveryStatus}</p>
                    <p className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">Progreso General: <strong className="text-zinc-900 dark:text-zinc-100">{c.overallProgressPercent}%</strong></p>
                  </div>
                </div>

                {/* Banner de Condición Especial para Casos Expirados / Reembolso / Recuperación */}
                {c.isExpiredPermanently && (
                  <div className="bg-red-950/30 border border-red-500/40 p-2.5 rounded-lg text-red-300 text-[11px] flex items-center justify-between">
                    <span>⚠️ Contrato suspendido permanente (&gt;3 meses en mora sin moto). Fondos aportados retenidos.</span>
                    <strong className="font-mono">Capital Retenido: ${c.totalPaidUSD} USD</strong>
                  </div>
                )}

                {c.refundDetails && (
                  <div className="bg-cyan-950/30 border border-cyan-500/40 p-2.5 rounded-lg text-cyan-300 text-[11px] flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-bold">Liquidación 70% / 30% Aprobada por Gerencia:</p>
                      <p className="text-[10px] text-cyan-200/80">{c.refundDetails.reason}</p>
                    </div>
                    <div className="font-mono text-right text-xs">
                      <p className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">Total Pagado: ${c.refundDetails.totalPaidUSD} USD</p>
                      <p className="text-amber-400 font-semibold">Retención Empresa (30%): ${c.refundDetails.companyRetention30PercentUSD} USD</p>
                      <p className="text-emerald-400 font-bold text-sm">Devolución Cliente (70%): ${c.refundDetails.clientRefund70PercentUSD} USD</p>
                    </div>
                  </div>
                )}

                {c.deliveryStatus === "POR_RECUPERAR" && (
                  <div className="bg-rose-950/30 border border-rose-500/40 p-2.5 rounded-lg text-rose-300 text-[11px] flex items-center justify-between">
                    <span>🚨 Orden de retención presencial activa. Acumula {c.overdueMonthsCount || 2} cuotas vencidas con moto entregada.</span>
                    <span className="font-bold text-rose-400">Asignar a Oficial de Calle</span>
                  </div>
                )}

                {c.deliveryStatus === "POR_VISITAR" && (
                  <div className="bg-purple-950/30 border border-purple-500/40 p-2.5 rounded-lg text-purple-300 text-[11px] flex items-center justify-between">
                    <span>📍 Listo para visita presencial domiciliaria para verificar vivienda e inspeccionar avales.</span>
                    <span className="font-bold text-purple-400">Ruta de Campo Aprobada</span>
                  </div>
                )}

                {/* Botones de Acción */}
                <div className="flex flex-wrap justify-end items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      const doc: DocType = c.status === "EXPIRADO" 
                        ? "EXPIRATION_ACT" 
                        : c.refundStatus === "POR_REEMBOLSAR" 
                        ? "REFUND_ACT" 
                        : c.deliveryStatus === "POR_RECUPERAR" 
                        ? "REPOSSESSION_ACT" 
                        : "CONTRACT";
                      onOpenPrintDoc?.(doc, c.id);
                    }}
                    className="bg-zinc-100/80 dark:bg-zinc-800/80 hover:bg-slate-800 text-slate-200 border border-zinc-200 dark:border-zinc-200 dark:border-zinc-700 font-semibold text-[11px] px-2.5 py-1.5 rounded-lg transition flex items-center space-x-1"
                    title="Generar Documento Notarial en PDF"
                  >
                    <FileText className="w-3 h-3 text-emerald-400" />
                    <span>Documento PDF</span>
                  </button>

                  <a 
                    href={`https://wa.me/${c.clientPhone?.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-700 hover:bg-emerald-600 text-zinc-900 dark:text-zinc-100 font-semibold text-[11px] px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      onSelectContract(c.id);
                      onNavigateToSection("loan_servicing");
                      onClose();
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-zinc-900 dark:text-zinc-100 font-semibold text-[11px] px-3 py-1.5 rounded-lg transition"
                  >
                    Ver Plan de Abono →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}