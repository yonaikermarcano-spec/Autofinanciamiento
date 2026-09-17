"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Store,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  DollarSign,
  Wallet,
  PhoneCall,
  MapPin,
  Send,
  Building,
  RefreshCw,
  Search,
  Bike,
  Plus
} from "lucide-react";
import { DealersPayableEngine, DealerPartner, DealerOrderTracking, DealerUnitStatus } from "../../modules/dealers-payable";

interface DealersPayableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DealersPayableModal({
  isOpen,
  onClose
}: DealersPayableModalProps) {
  const [dealers, setDealers] = useState<DealerPartner[]>(DealersPayableEngine.getAllDealers());
  const [orders, setOrders] = useState<DealerOrderTracking[]>(DealersPayableEngine.getAllOrders());
  const [activeTab, setActiveTab] = useState<"TRACKING_RADAR" | "ACCOUNTS_PAYABLE" | "DEALER_DIRECTORY">("TRACKING_RADAR");
  
  // Liquidación Modal
  const [payingOrder, setPayingOrder] = useState<DealerOrderTracking | null>(null);
  const [paymentRefInput, setPaymentRefInput] = useState<string>("");
  const [paymentMethodInput, setPaymentMethodInput] = useState<string>("TRANSFERENCIA_BANESCO");
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

  const totalPayableAllUSD = dealers.reduce((acc, d) => acc + d.totalPayableUSD, 0);
  const totalPaidAllUSD = dealers.reduce((acc, d) => acc + d.totalPaidUSD, 0);

  const handleOpenWhatsApp = (order: DealerOrderTracking) => {
    const { phoneUrl } = DealersPayableEngine.generateDealerFollowupWhatsApp(order);
    window.open(phoneUrl, "_blank");
  };

  const handleUpdateStatus = (orderId: string, newStatus: DealerUnitStatus) => {
    DealersPayableEngine.updateUnitStatus(orderId, newStatus);
    setOrders(DealersPayableEngine.getAllOrders());
    setSuccessBanner("¡Estatus de preparación de unidad actualizado!");
    setTimeout(() => setSuccessBanner(""), 3000);
  };

  const handleConfirmPayment = () => {
    if (!payingOrder || !paymentRefInput.trim()) return;

    DealersPayableEngine.recordPaymentToDealer(payingOrder.id, paymentRefInput, paymentMethodInput);
    setOrders(DealersPayableEngine.getAllOrders());
    setDealers(DealersPayableEngine.getAllDealers());
    setSuccessBanner("¡Pago de $" + payingOrder.dealerPriceUSD + " USD registrado exitosamente a favor de " + payingOrder.dealerName + "!");
    setPayingOrder(null);
    setPaymentRefInput("");
    setTimeout(() => setSuccessBanner(""), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Gestor Interno de Concesionarios & Cuentas por Pagar</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.2 rounded-full font-mono">
                  PROVEEDORES B2B
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Radar de seguimiento a tiendas, presión por WhatsApp a vendedores y liquidaciones de flota
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
            { id: "TRACKING_RADAR", label: "Radar de Retiros & Seguimiento a Tiendas", icon: Bike, count: orders.length },
            { id: "ACCOUNTS_PAYABLE", label: "Cuentas por Pagar a Concesionarios", icon: Wallet, count: orders.filter(o => o.payableStatus === "PENDIENTE_PAGO").length },
            { id: "DEALER_DIRECTORY", label: "Directorio de Concesionarios Aliados", icon: Building, count: dealers.length }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={"px-4 py-2 font-semibold transition flex items-center space-x-2 border-b-2 cursor-pointer " + (
                  isActive 
                    ? "border-blue-500 text-blue-400" 
                    : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-200"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.count !== undefined && (
                  <span className="text-[10px] font-mono bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.2 rounded-full">
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
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

          {/* ========================================================================= */}
          {/* 1. RADAR DE SEGUIMIENTO A TIENDAS & WHATSAPP                              */}
          {/* ========================================================================= */}
          {activeTab === "TRACKING_RADAR" && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map(ord => {
                  const isReady = ord.status === "LISTA_PARA_RETIRO";
                  const isDone = ord.status === "RETIRADA_POR_CLIENTE";

                  return (
                    <div 
                      key={ord.id}
                      className={"p-5 rounded-2xl border transition space-y-3.5 " + (
                        isDone ? "bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" :
                        isReady ? "bg-emerald-950/20 border-emerald-500/40" :
                        "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                      )}
                    >
                      {/* Cabecera */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md font-mono">
                              {ord.dealerName}
                            </span>
                            <span className={"text-[10px] px-2 py-0.5 rounded-full font-bold uppercase " + (
                              isDone ? "bg-zinc-800 text-zinc-600 dark:text-zinc-400" :
                              isReady ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse" :
                              "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            )}>
                              ● {ord.status.replace(/_/g, " ")}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 pt-1.5">{ord.vehicleModel}</h4>
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                            {"Color: " + ord.vehicleColor + " • Costo Mayorista: $" + ord.dealerPriceUSD + " USD"}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 block">
                            {"#" + ord.contractNumber}
                          </span>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400">
                            {ord.daysWaiting > 0 ? (ord.daysWaiting + " días de espera") : "Al día"}
                          </span>
                        </div>
                      </div>

                      {/* Info del Cliente y Contacto del Concesionario */}
                      <div className="p-3 bg-white dark:bg-zinc-900/80 rounded-lg border border-zinc-200 dark:border-zinc-800/80 space-y-1 text-xs font-mono">
                        <p>Cliente: <strong className="text-zinc-900 dark:text-zinc-100 font-sans">{ord.clientName}</strong> ({ord.clientDocId})</p>
                        <p>Contacto Tienda: <span className="text-blue-400 font-sans">{ord.contactName}</span> ({ord.contactPhone})</p>
                        <p>Serial VIN: <span className="text-zinc-300">{ord.vinChassis || "Pendiente asignación"}</span></p>
                      </div>

                      {/* Acciones de Presión y Estado */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={() => handleOpenWhatsApp(ord)}
                          className="flex-1 p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                          title="Abrir chat de WhatsApp con mensaje prearmado para el vendedor del concesionario"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp a Vendedor</span>
                        </button>

                        <select
                          value={ord.status}
                          onChange={e => handleUpdateStatus(ord.id, e.target.value as DealerUnitStatus)}
                          className="p-2 rounded-lg bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer"
                        >
                          <option value="PENDIENTE_CONFIRMACION_VIN">1. Pendiente VIN</option>
                          <option value="EN_ALISTAMIENTO_TALLER">2. En Taller</option>
                          <option value="LISTA_PARA_RETIRO">3. Lista para Retiro</option>
                          <option value="RETIRADA_POR_CLIENTE">4. Retirada por Cliente</option>
                        </select>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. CUENTAS POR PAGAR A CONCESIONARIOS                                    */}
          {/* ========================================================================= */}
          {activeTab === "ACCOUNTS_PAYABLE" && (
            <div className="space-y-5">
              
              {/* Tarjetas de Resumen Financiero */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/10 space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase">TOTAL CUENTAS POR PAGAR (DEUDA A CONCESIONARIOS)</span>
                  <p className="text-2xl font-black font-mono text-amber-400">{"$" + totalPayableAllUSD.toLocaleString("es-VE") + " USD"}</p>
                  <p className="text-[10px] text-zinc-600 dark:text-zinc-400">Pendiente por transferir por unidades en proceso o retiradas</p>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">TOTAL HISTÓRICO LIQUIDADO A CONCESIONARIOS</span>
                  <p className="text-2xl font-black font-mono text-emerald-400">{"$" + totalPaidAllUSD.toLocaleString("es-VE") + " USD"}</p>
                  <p className="text-[10px] text-zinc-600 dark:text-zinc-400">Pagos completados satisfactoriamente</p>
                </div>
              </div>

              {/* Tabla de Órdenes y Liquidaciones */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold uppercase">
                    <tr>
                      <th className="p-3">Orden / Contrato</th>
                      <th className="p-3">Concesionario</th>
                      <th className="p-3">Vehículo & Cliente</th>
                      <th className="p-3">Costo Mayorista</th>
                      <th className="p-3">Estado Liquidación</th>
                      <th className="p-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850 font-mono text-[11px]">
                    {orders.map(ord => (
                      <tr key={ord.id} className="hover:bg-white dark:bg-zinc-900/40">
                        <td className="p-3">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{ord.id}</p>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400">#{ord.contractNumber}</span>
                        </td>
                        <td className="p-3 font-sans font-semibold text-zinc-200">
                          {ord.dealerName}
                        </td>
                        <td className="p-3 font-sans">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">{ord.vehicleModel}</p>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">{ord.clientName}</span>
                        </td>
                        <td className="p-3 font-bold text-emerald-400">
                          {"$" + ord.dealerPriceUSD.toFixed(2) + " USD"}
                        </td>
                        <td className="p-3">
                          <span className={"text-[10px] px-2 py-0.5 rounded-full font-bold " + (
                            ord.payableStatus === "LIQUIDADO_TOTAL" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          )}>
                            ● {ord.payableStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {ord.payableStatus !== "LIQUIDADO_TOTAL" ? (
                            <button
                              onClick={() => setPayingOrder(ord)}
                              className="p-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 text-xs font-bold transition cursor-pointer"
                            >
                              Liquidar Pago
                            </button>
                          ) : (
                            <span className="text-[10px] text-zinc-600 dark:text-zinc-400 truncate max-w-[120px] block">
                              {ord.paymentReference}
                            </span>
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
          {/* 3. DIRECTORIO DE CONCESIONARIOS ALIADOS                                   */}
          {/* ========================================================================= */}
          {activeTab === "DEALER_DIRECTORY" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dealers.map(d => (
                  <div key={d.id} className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
                    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{d.commercialName}</h4>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">{d.rif} • {d.city}</p>
                    </div>

                    <div className="space-y-1 text-xs font-mono text-zinc-300">
                      <p>Contacto: <strong className="text-zinc-900 dark:text-zinc-100 font-sans">{d.contactName}</strong> ({d.contactRole})</p>
                      <p>Teléfono: <span className="text-blue-400">{d.contactPhone}</span></p>
                      <p>Condición: <span className="text-zinc-600 dark:text-zinc-400">{d.paymentTerms}</span></p>
                      <p className="pt-1">Unidades Entregadas: <strong className="text-emerald-400">{d.totalUnitsDeliveredCount}</strong></p>
                      <p>Saldo Pendiente: <strong className="text-amber-400">{"$" + d.totalPayableUSD} USD</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* MODAL DE LIQUIDACIÓN DE PAGO */}
        {payingOrder && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs backdrop-blur-md animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] p-6 space-y-4 shadow-2xl text-zinc-900 dark:text-zinc-100 font-sans">
              
              <div className="flex items-center space-x-3 text-emerald-400">
                <div className="p-2.5 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Registrar Liquidación de Unidad</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Pago a favor del concesionario aliado</p>
                </div>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs font-mono">
                <p>Concesionario: <strong className="text-zinc-900 dark:text-zinc-100 font-sans">{payingOrder.dealerName}</strong></p>
                <p>Vehículo: <span className="text-zinc-300">{payingOrder.vehicleModel}</span></p>
                <p>Monto a Liquidar: <strong className="text-emerald-400 font-bold">{"$" + payingOrder.dealerPriceUSD + " USD"}</strong></p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Método de Pago</label>
                  <select
                    value={paymentMethodInput}
                    onChange={e => setPaymentMethodInput(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs"
                  >
                    <option value="TRANSFERENCIA_BANESCO">Transferencia Bancaria Banesco (Bs. BCV)</option>
                    <option value="TRANSFERENCIA_MERCANTIL">Transferencia Bancaria Mercantil</option>
                    <option value="EFECTIVO_DIVISAS_USD">Efectivo Divisas ($ USD)</option>
                    <option value="BINANCE_PAY_USDT">Binance Pay (USDT)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Número de Referencia / Comprobante</label>
                  <input
                    type="text"
                    placeholder="Ej: TRF-9948201 / REC-0824"
                    value={paymentRefInput}
                    onChange={e => setPaymentRefInput(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => setPayingOrder(null)}
                  className="flex-1 p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleConfirmPayment}
                  disabled={!paymentRefInput.trim()}
                  className={"flex-1 p-2.5 rounded-2xl font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer " + (
                    paymentRefInput.trim()
                      ? "bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 shadow-lg shadow-emerald-950/50"
                      : "bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-not-allowed"
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Liquidación</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
