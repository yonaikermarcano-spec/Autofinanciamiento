"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Radio,
  Power,
  ShieldAlert,
  BatteryCharging,
  MapPin,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  ShieldCheck,
  History,
  FileCheck,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Zap,
  Activity,
  Signal
} from "lucide-react";
import { TelematicsEngine, GpsDevice, RcvPolicy, TelematicsLog } from "../../modules/telematics-gps";

interface TelematicsGpsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsapp?: (contractNumber: string, template: any) => void;
}

export default function TelematicsGpsModal({
  isOpen,
  onClose,
  onOpenWhatsapp
}: TelematicsGpsModalProps) {
  const [activeTab, setActiveTab] = useState<"DEVICES" | "RCV_POLICIES" | "AUDIT_LOGS">("DEVICES");
  const [devices, setDevices] = useState<GpsDevice[]>(TelematicsEngine.getAllDevices());
  const [rcvPolicies, setRcvPolicies] = useState<RcvPolicy[]>(TelematicsEngine.getAllRcvPolicies());
  const [logs, setLogs] = useState<TelematicsLog[]>(TelematicsEngine.getLogs());

  // Confirmación de Corte
  const [confirmDevice, setConfirmDevice] = useState<GpsDevice | null>(null);
  const [confirmAction, setConfirmAction] = useState<"CUT_OFF" | "RESTORE">("CUT_OFF");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
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

  const handleExecuteEngineCommand = () => {
    if (!confirmDevice) return;

    setIsExecuting(true);
    setTimeout(() => {
      TelematicsEngine.executeEngineCommand(
        confirmDevice.imei,
        confirmAction,
        "Yon Aiker (Gerente General)"
      );

      setDevices(TelematicsEngine.getAllDevices());
      setLogs(TelematicsEngine.getLogs());
      setIsExecuting(false);
      
      const msg = confirmAction === "CUT_OFF"
        ? "¡Comando de Corte de Corriente ejecutado exitosamente para la unidad " + confirmDevice.vehicleVin + "!"
        : "¡Encendido de motor restaurado exitosamente para la unidad " + confirmDevice.vehicleVin + "!";
      
      setSuccessBanner(msg);
      setConfirmDevice(null);
      setTimeout(() => setSuccessBanner(""), 4000);
    }, 800);
  };

  const handleRenewRcv = (policyId: string) => {
    TelematicsEngine.renewRcvPolicy(policyId, "2027-08-24");
    setRcvPolicies(TelematicsEngine.getAllRcvPolicies());
    setSuccessBanner("¡Póliza RCV renovada por 1 año de cobertura hasta 2027!");
    setTimeout(() => setSuccessBanner(""), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Centro Telemático GPS & Gestor de Pólizas RCV</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.2 rounded-full font-mono">
                  KILL-SWITCH READY
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Monitoreo satelital en vivo, alerta de desconexión de batería 12V y control de vencimiento RCV
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

        {/* Pestañas */}
        <div className="flex items-center space-x-1 px-6 pt-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-xs">
          {[
            { id: "DEVICES", label: "Dispositivos GPS en Vivo & Inmovilizador", icon: Radio, count: devices.length },
            { id: "RCV_POLICIES", label: "Pólizas de Seguro RCV", icon: FileCheck, count: rcvPolicies.length },
            { id: "AUDIT_LOGS", label: "Bitácora de Comandos Satelitales (SHA-256)", icon: History, count: logs.length }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={"px-4 py-2 font-semibold transition flex items-center space-x-2 border-b-2 cursor-pointer " + (
                  isActive 
                    ? "border-rose-500 text-rose-400" 
                    : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-200"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.2 rounded-full">
                  {t.count}
                </span>
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
          {/* 1. DISPOSITIVOS GPS EN VIVO & CORTE DE MOTOR                              */}
          {/* ========================================================================= */}
          {activeTab === "DEVICES" && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {devices.map(dev => {
                  const isTampered = dev.status === "BATTERY_TAMPER";
                  const isLocked = dev.isEngineLocked;

                  return (
                    <div 
                      key={dev.imei}
                      className={"p-5 rounded-2xl border transition space-y-3 relative overflow-hidden " + (
                        isTampered
                          ? "bg-amber-950/20 border-amber-500/40"
                          : isLocked
                          ? "bg-rose-950/20 border-rose-500/40"
                          : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                      )}
                    >
                      {/* Estado Superior */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={"text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center space-x-1 " + (
                              isTampered
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                                : isLocked
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            )}>
                              <Activity className="w-3 h-3" />
                              <span>{dev.status.replace("_", " ")}</span>
                            </span>

                            <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono bg-zinc-100/80 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md">
                              {dev.carrier} • {dev.simCardNumber}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 pt-1">{dev.clientName}</h4>
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                            {"VIN: " + dev.vehicleVin + " • #" + dev.contractNumber}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 block">
                            {dev.speedKmh > 0 ? (dev.speedKmh + " km/h") : "Detenido"}
                          </span>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">{dev.lastPingTime}</span>
                        </div>
                      </div>

                      {/* Datos de Telemetría */}
                      <div className="p-3 rounded-lg bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs font-mono">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-600 dark:text-zinc-400 flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" />
                            <span className="font-sans text-[11px] text-zinc-300">{dev.locationName}</span>
                          </span>
                          <span className="text-zinc-600 dark:text-zinc-400 text-[10px]">
                            {dev.latitude.toFixed(4)}, {dev.longitude.toFixed(4)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-zinc-200 dark:border-zinc-800/60">
                          <span className="text-zinc-600 dark:text-zinc-400 flex items-center space-x-1">
                            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Batería: <strong>{dev.batteryVoltage}V</strong></span>
                          </span>

                          <span className={"text-[10px] " + (dev.isOutsideGeofence ? "text-amber-400 font-bold" : "text-zinc-600 dark:text-zinc-400")}>
                            {dev.isOutsideGeofence ? "⚠️ Fuera de Geocerca" : "✓ Dentro de Geocerca"}
                          </span>
                        </div>
                      </div>

                      {/* Botón Kill-Switch */}
                      <div className="pt-1 flex items-center space-x-2">
                        {isLocked ? (
                          <button
                            onClick={() => { setConfirmDevice(dev); setConfirmAction("RESTORE"); }}
                            className="flex-1 p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Restaurar Encendido de Motor</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => { setConfirmDevice(dev); setConfirmAction("CUT_OFF"); }}
                            className="flex-1 p-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span>Ejecutar Corte de Corriente (Kill-Switch)</span>
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. PÓLIZAS DE SEGURO RCV                                                  */}
          {/* ========================================================================= */}
          {activeTab === "RCV_POLICIES" && (
            <div className="space-y-4">
              
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold uppercase">
                    <tr>
                      <th className="p-3">N° Póliza / Aseguradora</th>
                      <th className="p-3">Cliente & Contrato</th>
                      <th className="p-3">Vigencia & Vencimiento</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850 font-mono text-[11px]">
                    {rcvPolicies.map(rcv => (
                      <tr key={rcv.id} className="hover:bg-white dark:bg-zinc-900/40">
                        <td className="p-3">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{rcv.policyNumber}</p>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans">{rcv.insurer.replace("_", " ")}</span>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-zinc-200 font-sans">{rcv.clientName}</p>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400">#{rcv.contractNumber} • VIN: {rcv.vehicleVin}</span>
                        </td>
                        <td className="p-3">
                          <p className="text-zinc-200">{rcv.startDate} al {rcv.expirationDate}</p>
                          <span className={"text-[10px] " + (
                            rcv.daysToExpiration < 0 ? "text-rose-400 font-bold" :
                            rcv.daysToExpiration <= 30 ? "text-amber-400 font-bold" : "text-emerald-400"
                          )}>
                            {rcv.daysToExpiration < 0 ? ("Vencida hace " + Math.abs(rcv.daysToExpiration) + " días") : ("Quedan " + rcv.daysToExpiration + " días")}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={"text-[10px] px-2.5 py-0.5 rounded-full font-bold " + (
                            rcv.status === "VIGENTE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            rcv.status === "POR_VENCER" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse" :
                            "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          )}>
                            ● {rcv.status}
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleRenewRcv(rcv.id)}
                            className="p-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition cursor-pointer"
                          >
                            Renovar Póliza
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. BITÁCORA DE COMANDOS SATELITALES (SHA-256)                             */}
          {/* ========================================================================= */}
          {activeTab === "AUDIT_LOGS" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold uppercase">
                    <tr>
                      <th className="p-3">ID / Fecha</th>
                      <th className="p-3">Operador</th>
                      <th className="p-3">Acción Ejecutada</th>
                      <th className="p-3">IMEI / Contrato</th>
                      <th className="p-3 text-right">Sello SHA-256</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850 font-mono text-[11px]">
                    {logs.map(l => (
                      <tr key={l.id} className="hover:bg-white dark:bg-zinc-900/40">
                        <td className="p-3">
                          <p className="text-zinc-900 dark:text-zinc-100 font-bold">{l.id}</p>
                          <span className="text-[10px] text-zinc-600 dark:text-zinc-400">{l.timestamp}</span>
                        </td>
                        <td className="p-3 font-sans text-zinc-300 font-medium">
                          {l.operatorName}
                        </td>
                        <td className="p-3">
                          <span className={"text-[10px] px-2 py-0.5 rounded-full font-bold " + (
                            l.action === "ENGINE_CUT_OFF" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          )}>
                            {l.action}
                          </span>
                        </td>
                        <td className="p-3 text-zinc-600 dark:text-zinc-400">
                          {l.targetImei} (#{l.contractNumber})
                        </td>
                        <td className="p-3 text-right text-[10px] text-zinc-600 dark:text-zinc-400">
                          {l.sha256Seal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* MODAL DE CONFIRMACIÓN DE CORTE / RESTAURACIÓN */}
        {confirmDevice && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs backdrop-blur-md animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] p-6 space-y-4 shadow-2xl text-zinc-900 dark:text-zinc-100 font-sans">
              
              <div className="flex items-center space-x-3 text-rose-400">
                <div className="p-2.5 bg-rose-500/20 rounded-2xl border border-rose-500/30">
                  <Power className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    {confirmAction === "CUT_OFF" ? "¿Confirmar Corte de Corriente?" : "¿Restaurar Encendido de Motor?"}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Comando satelital telemático directo al relé</p>
                </div>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs font-mono">
                <p>Cliente: <strong className="text-zinc-900 dark:text-zinc-100 font-sans">{confirmDevice.clientName}</strong></p>
                <p>Contrato: <strong className="text-zinc-300">{confirmDevice.contractNumber}</strong></p>
                <p>VIN Chasis: <strong className="text-zinc-300">{confirmDevice.vehicleVin}</strong></p>
                <p>IMEI GPS: <strong className="text-emerald-400">{confirmDevice.imei}</strong></p>
                <p>Ubicación: <span className="text-zinc-600 dark:text-zinc-400 font-sans">{confirmDevice.locationName}</span></p>
              </div>

              {confirmAction === "CUT_OFF" && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[11px] text-amber-300 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>
                    El corte inmoviliza la bomba de gasolina o CDI. Verifique que la unidad no se encuentre en autopista de alta velocidad.
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => setConfirmDevice(null)}
                  disabled={isExecuting}
                  className="flex-1 p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleExecuteEngineCommand}
                  disabled={isExecuting}
                  className={"flex-1 p-2.5 rounded-2xl font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer " + (
                    confirmAction === "CUT_OFF"
                      ? "bg-rose-600 hover:bg-rose-500 text-zinc-900 dark:text-zinc-100 shadow-lg shadow-rose-950/50"
                      : "bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 shadow-lg shadow-emerald-950/50"
                  )}
                >
                  {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  <span>{confirmAction === "CUT_OFF" ? "Ejecutar Inmovilización" : "Restaurar Encendido"}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
