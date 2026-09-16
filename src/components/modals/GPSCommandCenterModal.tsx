"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Radio,
  Power,
  MapPin,
  ShieldAlert,
  Battery,
  Gauge,
  Navigation,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  History,
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  Bike
} from "lucide-react";
import { GPSTelemetryEngine, GPSDeviceTracker } from "../../modules/gps-telemetry";

interface GPSCommandCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GPSCommandCenterModal({
  isOpen,
  onClose
}: GPSCommandCenterModalProps) {
  const [devices, setDevices] = useState<GPSDeviceTracker[]>(GPSTelemetryEngine.getAllDevices());
  const [activeTab, setActiveTab] = useState<"LIVE_RADAR" | "GEOFENCE_ALERTS" | "LOGS">("LIVE_RADAR");

  // Modal de Confirmación de Kill-Switch
  const [targetDeviceForCut, setTargetDeviceForCut] = useState<GPSDeviceTracker | null>(null);
  const [cutActionType, setCutActionType] = useState<"CUT" | "RESTORE">("CUT");
  const [cutReason, setCutReason] = useState<string>("Mora mayor a 60 días sin acuerdo de pago");
  const [securityPin, setSecurityPin] = useState<string>("");
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

  const immobilizedCount = devices.filter(d => d.isEngineCut).length;
  const geofenceBreachedCount = devices.filter(d => d.isGeofenceBreached).length;

  const handleExecuteEngineAction = () => {
    if (!targetDeviceForCut) return;

    if (cutActionType === "CUT") {
      GPSTelemetryEngine.executeKillSwitch(targetDeviceForCut.id, cutReason, "Gerente de Seguridad");
      setSuccessBanner("¡Comando Satelital de Inmovilización ejecutado! El motor de la moto " + targetDeviceForCut.plate + " ha sido bloqueado.");
    } else {
      GPSTelemetryEngine.restoreEngine(targetDeviceForCut.id, "Gerente de Seguridad");
      setSuccessBanner("¡Encendido restablecido exitosamente para la moto " + targetDeviceForCut.plate + "!");
    }

    setDevices(GPSTelemetryEngine.getAllDevices());
    setTargetDeviceForCut(null);
    setSecurityPin("");
    setTimeout(() => setSuccessBanner(""), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Centro de Comando GPS & Kill-Switch Satelital</span>
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.2 rounded-full font-mono">
                  TELEMETRÍA EN VIVO
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">
                Monitoreo satelital de flota, geocercas y corte remoto de motor con respaldo criptográfico
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

        {/* Pestañas Superiores */}
        <div className="flex items-center space-x-1 px-6 pt-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-xs">
          {[
            { id: "LIVE_RADAR", label: "Radar de Flota & Telemetría", icon: Radio, count: devices.length },
            { id: "GEOFENCE_ALERTS", label: "Alertas de Geocerca", icon: ShieldAlert, count: geofenceBreachedCount },
            { id: "LOGS", label: "Bitácora Criptográfica de Cortes", icon: History }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={"px-4 py-2 font-semibold transition flex items-center space-x-2 border-b-2 cursor-pointer " + (
                  isActive 
                    ? "border-red-500 text-red-400" 
                    : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-200"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.count !== undefined && (
                  <span className={"text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full " + (
                    t.id === "GEOFENCE_ALERTS" && geofenceBreachedCount > 0
                      ? "bg-red-500/20 text-red-400 animate-pulse"
                      : "bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  )}>
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
          {/* 1. RADAR EN VIVO & TELEMETRÍA                                             */}
          {/* ========================================================================= */}
          {activeTab === "LIVE_RADAR" && (
            <div className="space-y-4">
              
              {/* Tarjetas de Resumen */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-1">
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-bold uppercase">UNIDADES EN LÍNEA</span>
                  <p className="text-2xl font-black font-mono text-emerald-400">{devices.filter(d => !d.isEngineCut).length} / {devices.length}</p>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Telemetría activa</span>
                </div>

                <div className="p-4 rounded-2xl border border-red-500/30 bg-red-950/10 space-y-1">
                  <span className="text-[10px] text-red-400 font-bold uppercase">MOTORES INMOVILIZADOS</span>
                  <p className="text-2xl font-black font-mono text-red-400">{immobilizedCount}</p>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">Kill-Switch activado</span>
                </div>

                <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/10 space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase">ALERTAS DE GEOCERCA</span>
                  <p className="text-2xl font-black font-mono text-amber-400">{geofenceBreachedCount}</p>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">Fuera de perímetro</span>
                </div>
              </div>

              {/* Lista de Dispositivos GPS */}
              <div className="space-y-3">
                {devices.map(device => {
                  const nav = GPSTelemetryEngine.generateNavigationUrl(device.latitude, device.longitude);

                  return (
                    <div 
                      key={device.id}
                      className={"p-5 rounded-3xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 " + (
                        device.isEngineCut
                          ? "bg-red-950/20 border-red-500/40"
                          : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                      )}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-sans">{device.clientName}</span>
                          <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">#{device.contractNumber}</span>
                          <span className={"text-[9px] px-2 py-0.2 rounded font-bold " + (
                            device.isEngineCut ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse" :
                            device.status === "ONLINE_MOVING" ? "bg-emerald-500/20 text-emerald-400" :
                            "bg-blue-500/20 text-blue-400"
                          )}>
                            ● {device.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300 font-mono">
                          <p>Vehículo: <strong className="text-zinc-900 dark:text-zinc-100">{device.vehicleModel}</strong> (Placa: {device.plate})</p>
                          <p>Velocidad: <strong className="text-indigo-400">{device.currentSpeedKmH} km/h</strong></p>
                          <p className="flex items-center space-x-1">
                            <Battery className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Batería: {device.batteryLevelPercent}%</span>
                          </p>
                        </div>

                        <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-sans flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                          <span>{device.locationAddress} • Zona: <strong className="text-zinc-200">{device.geofenceZone.replace(/_/g, ' ')}</strong></span>
                        </p>

                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono block">
                          IMEI: {device.imei} • Ping: {device.lastPingTime}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                        {/* Botón Abrir en Google Maps / Waze */}
                        <a
                          href={nav.googleMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition flex items-center space-x-1.5"
                        >
                          <Navigation className="w-3.5 h-3.5 text-blue-400" />
                          <span>Google Maps</span>
                        </a>

                        {/* Botón Kill-Switch */}
                        {!device.isEngineCut ? (
                          <button
                            onClick={() => {
                              setTargetDeviceForCut(device);
                              setCutActionType("CUT");
                            }}
                            className="p-2 px-3.5 rounded-lg bg-red-600 hover:bg-red-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-red-950/50"
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span>Inmovilizar Motor</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setTargetDeviceForCut(device);
                              setCutActionType("RESTORE");
                            }}
                            className="p-2 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-950/50"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Restablecer Encendido</span>
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
          {/* 2. ALERTAS DE GEOCERCA                                                    */}
          {/* ========================================================================= */}
          {activeTab === "GEOFENCE_ALERTS" && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-amber-300 text-xs">
                <p className="font-bold flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Monitoreo de Geocercas y Perímetros Autorizados</span>
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 mt-1">
                  Si un vehículo sale de su zona metropolitana autorizada (ej: Gran Caracas hacia zonas fronterizas), el sistema genera una alerta inmediata para evaluación de inmovilización preventiva.
                </p>
              </div>

              <div className="space-y-3">
                {devices.filter(d => d.isGeofenceBreached).map(dev => (
                  <div key={dev.id} className="p-4 bg-red-950/30 border border-red-500/40 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{dev.clientName} ({dev.vehicleModel})</span>
                      <p className="text-red-300 text-[11px] font-mono mt-0.5">⚠️ Ubicación Atípica: {dev.locationAddress}</p>
                    </div>
                    <button
                      onClick={() => {
                        setTargetDeviceForCut(dev);
                        setCutActionType("CUT");
                      }}
                      className="p-1.5 px-3 rounded-lg bg-red-600 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition cursor-pointer"
                    >
                      Inmovilizar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. BITÁCORA CRIPTOGRÁFICA                                                 */}
          {/* ========================================================================= */}
          {activeTab === "LOGS" && (
            <div className="space-y-3">
              {devices.flatMap(d => d.historyLogs).map((log, idx) => (
                <div key={idx} className="p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">{log.action}</span>
                    <span className="text-zinc-600 dark:text-zinc-400 text-[10px]">{log.timestamp}</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-sans text-[11px]">Operador: {log.operator}</p>
                  <p className="text-[10px] text-zinc-600 truncate">Sello Criptográfico: {log.sha256Seal}</p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* MODAL DE CONFIRMACIÓN DE CORTE DE MOTOR */}
        {targetDeviceForCut && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs backdrop-blur-md animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] p-6 space-y-4 shadow-2xl text-zinc-900 dark:text-zinc-100 font-sans">
              
              <div className="flex items-center space-x-3 text-red-400">
                <div className="p-2.5 bg-red-500/20 rounded-2xl border border-red-500/30">
                  {cutActionType === "CUT" ? <Power className="w-6 h-6" /> : <Unlock className="w-6 h-6 text-emerald-400" />}
                </div>
                <div>
                  <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    {cutActionType === "CUT" ? "Inmovilización Remota de Motor" : "Restablecer Encendido de Motor"}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">{targetDeviceForCut.vehicleModel} (Placa: {targetDeviceForCut.plate})</p>
                </div>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs font-mono">
                <p>Cliente: <strong className="text-zinc-900 dark:text-zinc-100 font-sans">{targetDeviceForCut.clientName}</strong></p>
                <p>Ubicación Actual: <span className="text-zinc-300 font-sans">{targetDeviceForCut.locationAddress}</span></p>
                <p>IMEI GPS: <span className="text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">{targetDeviceForCut.imei}</span></p>
              </div>

              {cutActionType === "CUT" && (
                <div className="space-y-1 text-xs">
                  <label className="text-zinc-700 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 block font-semibold">Motivo Legal / Operativo del Corte:</label>
                  <select
                    value={cutReason}
                    onChange={e => setCutReason(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs"
                  >
                    <option value="Mora mayor a 60 días sin acuerdo de pago">Mora mayor a 60 días sin acuerdo de pago</option>
                    <option value="Salida de geocerca no autorizada / Riesgo de extravío">Salida de geocerca no autorizada / Riesgo de extravío</option>
                    <option value="Orden judicial de secuestro preventivo (CPC Art. 640)">Orden judicial de secuestro preventivo (CPC Art. 640)</option>
                    <option value="Reporte de hurto por el propio cliente">Reporte de hurto por el propio cliente</option>
                  </select>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => setTargetDeviceForCut(null)}
                  className="flex-1 p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleExecuteEngineAction}
                  className={"flex-1 p-2.5 rounded-2xl font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg " + (
                    cutActionType === "CUT"
                      ? "bg-red-600 hover:bg-red-500 text-zinc-900 dark:text-zinc-100 shadow-red-950/50"
                      : "bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 shadow-emerald-950/50"
                  )}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{cutActionType === "CUT" ? "Ejecutar Corte Satelital" : "Confirmar Desbloqueo"}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
