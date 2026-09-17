"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Wrench,
  Bike,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  Send,
  Download,
  ShieldCheck,
  Check,
  FileCheck,
  UserCheck,
  Search,
  ExternalLink,
  Plus
} from "lucide-react";
import {
  MaintenanceWarrantyEngine,
  WorkshopAppointment,
  MaintenanceMilestone
} from "../../modules/maintenance-warranty";

interface MaintenanceWarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MaintenanceWarrantyModal({
  isOpen,
  onClose
}: MaintenanceWarrantyModalProps) {
  const [appointments, setAppointments] = useState<WorkshopAppointment[]>(MaintenanceWarrantyEngine.getAllAppointments());
  const [activeTab, setActiveTab] = useState<"RADAR" | "NEW_APPOINTMENT" | "MILESTONES_GUIDE">("RADAR");

  // Formulario Nueva Cita
  const [clientName, setClientName] = useState("José Gregorio Castillo");
  const [clientPhone, setClientPhone] = useState("0414-3329011");
  const [contractNumber, setContractNumber] = useState("CTR-2026-001");
  const [vehicleModel, setVehicleModel] = useState("Bera SBR 150cc");
  const [plateOrVin, setPlateOrVin] = useState("AI8X92M");
  const [serviceMilestoneKm, setServiceMilestoneKm] = useState<number>(500);
  const [currentOdometerKm, setCurrentOdometerKm] = useState<number>(480);
  const [appointmentDate, setAppointmentDate] = useState("2026-08-28 09:00");
  const [workshopName, setWorkshopName] = useState("Taller Central AutoLending Catia");
  const [mechanicName, setMechanicName] = useState("Maestro Juan Bermúdez");
  const [totalCostUSD, setTotalCostUSD] = useState<number>(15);

  // Modal Checklist de Inspección
  const [completingApp, setCompletingApp] = useState<WorkshopAppointment | null>(null);
  const [checklist, setChecklist] = useState({
    oilChanged: true,
    oilType: "20W-50 Mineral 4T",
    chainAdjusted: true,
    valvesCalibrated: true,
    brakesChecked: true,
    electricalChecked: true
  });
  const [mechanicNotes, setMechanicNotes] = useState("Servicio completado satisfactoriamente. Motor y frenos en perfecto estado.");
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

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const created = MaintenanceWarrantyEngine.scheduleAppointment({
      contractNumber,
      clientName,
      clientPhone,
      vehicleModel,
      plateOrVin,
      serviceMilestoneKm,
      currentOdometerKm,
      appointmentDate,
      workshopName,
      mechanicName,
      totalCostUSD
    });

    setAppointments(MaintenanceWarrantyEngine.getAllAppointments());
    setActiveTab("RADAR");
    setSuccessBanner("¡Cita de mantenimiento agendada exitosamente para " + created.clientName + " (" + created.serviceMilestoneKm + " km)!");
    setTimeout(() => setSuccessBanner(""), 3500);
  };

  const handleCompleteService = () => {
    if (!completingApp) return;

    const completed = MaintenanceWarrantyEngine.completeService(completingApp.id, checklist, mechanicNotes);
    setAppointments(MaintenanceWarrantyEngine.getAllAppointments());
    setCompletingApp(null);
    setSuccessBanner("¡Certificado digital de mantenimiento emitido con sello: " + completed.certificateSha256?.slice(0, 18) + "...!");
    setTimeout(() => setSuccessBanner(""), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Taller Mecánico, Mantenimientos & Garantías Post-Venta</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.2 rounded-full font-mono">
                  500 KM / 1.500 KM / 3.000 KM
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Control de servicios obligatorios para blindar la garantía de las motos y proteger el activo financiado
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
            { id: "RADAR", label: "Radar de Servicios & Garantías", icon: Bike, count: appointments.length },
            { id: "NEW_APPOINTMENT", label: "+ Agendar Cita de Taller", icon: Calendar },
            { id: "MILESTONES_GUIDE", label: "Manual de Servicios Obligatorios", icon: ShieldCheck }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={"px-4 py-2 font-semibold transition flex items-center space-x-2 border-b-2 cursor-pointer " + (
                  isActive 
                    ? "border-purple-500 text-purple-400" 
                    : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-200"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
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
          {/* 1. RADAR DE SERVICIOS Y GARANTÍAS DE LA FLOTA                            */}
          {/* ========================================================================= */}
          {activeTab === "RADAR" && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 gap-3">
                {appointments.map(app => {
                  const health = MaintenanceWarrantyEngine.evaluateWarrantyHealth(
                    app.currentOdometerKm,
                    app.status === "COMPLETED" ? app.serviceMilestoneKm : 0
                  );

                  const waUrl = MaintenanceWarrantyEngine.generateServiceWhatsAppUrl(
                    app.clientPhone,
                    app.clientName,
                    app.vehicleModel,
                    app.serviceMilestoneKm
                  );

                  return (
                    <div 
                      key={app.id}
                      className={"p-5 rounded-3xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 " + (
                        app.status === "COMPLETED"
                          ? "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                          : "bg-purple-950/20 border-purple-500/30"
                      )}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-sans">{app.clientName}</span>
                          <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">#{app.contractNumber}</span>
                          <span className={"text-[9px] px-2 py-0.2 rounded font-bold border " + health.badgeColor}>
                            ● {health.label}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 text-xs text-zinc-300 font-mono">
                          <p>Vehículo: <strong className="text-zinc-900 dark:text-zinc-100">{app.vehicleModel}</strong> (Placa: {app.plateOrVin})</p>
                          <p>Hito: <strong className="text-purple-400">{app.serviceMilestoneKm} km</strong></p>
                          <p>Odómetro Actual: <span className="text-zinc-200">{app.currentOdometerKm} km</span></p>
                        </div>

                        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                          📍 {app.workshopName} • Mecánico: <strong>{app.mechanicName}</strong> • Cita: {app.appointmentDate}
                        </p>

                        {app.certificateSha256 && (
                          <span className="text-[10px] text-emerald-400 font-mono block">
                            ✓ Certificado Digital: {app.certificateSha256}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                        {/* Botón WhatsApp de Recordatorio */}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
                        >
                          <Send className="w-3 h-3" />
                          <span>WhatsApp Recordatorio</span>
                        </a>

                        {/* Botón Completar Inspección */}
                        {app.status !== "COMPLETED" ? (
                          <button
                            onClick={() => {
                              setCompletingApp(app);
                              setChecklist(app.checklist);
                            }}
                            className="p-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md"
                          >
                            <Wrench className="w-3 h-3" />
                            <span>Completar Inspección</span>
                          </button>
                        ) : (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                            ✓ SERVICIO COMPLETADO
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. AGENDAR NUEVA CITA DE TALLER                                          */}
          {/* ========================================================================= */}
          {activeTab === "NEW_APPOINTMENT" && (
            <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-5 max-w-2xl mx-auto">
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Agendar Cita de Mantenimiento Preventivo</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Registra una cita en el taller central o taller autorizado aliado.</p>
              </div>

              <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Nombre del Cliente</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Teléfono WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={clientPhone}
                      onChange={e => setClientPhone(e.target.value)}
                      className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Modelo de Moto</label>
                    <input
                      type="text"
                      required
                      value={vehicleModel}
                      onChange={e => setVehicleModel(e.target.value)}
                      className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Hito de Servicio</label>
                    <select
                      value={serviceMilestoneKm}
                      onChange={e => setServiceMilestoneKm(parseInt(e.target.value, 10))}
                      className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-mono"
                    >
                      <option value={500}>500 km (1er Asentamiento)</option>
                      <option value={1500}>1.500 km (2do Preventivo)</option>
                      <option value={3000}>3.000 km (3er Servicio Mayor)</option>
                      <option value={5000}>5.000 km (4to Integral)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Odómetro Actual (km)</label>
                    <input
                      type="number"
                      required
                      value={currentOdometerKm}
                      onChange={e => setCurrentOdometerKm(parseInt(e.target.value, 10) || 0)}
                      className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-purple-400 font-bold font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Taller Asignado</label>
                    <input
                      type="text"
                      required
                      value={workshopName}
                      onChange={e => setWorkshopName(e.target.value)}
                      className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Mecánico Responsable</label>
                    <input
                      type="text"
                      required
                      value={mechanicName}
                      onChange={e => setMechanicName(e.target.value)}
                      className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Fecha y Hora de la Cita</label>
                  <input
                    type="text"
                    required
                    placeholder="2026-08-28 09:00"
                    value={appointmentDate}
                    onChange={e => setAppointmentDate(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-purple-950/50"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Confirmar & Agendar Cita</span>
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. MANUAL DE SERVICIOS OBLIGATORIOS (500 KM A 5000 KM)                    */}
          {/* ========================================================================= */}
          {activeTab === "MILESTONES_GUIDE" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MaintenanceWarrantyEngine.STANDARD_MILESTONES.map(m => (
                <div key={m.serviceNumber} className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{m.description}</h4>
                    <span className="text-xs font-mono font-black text-purple-400">
                      {"$" + m.recommendedCostUSD} USD
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-300">
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold block">TAREAS OBLIGATORIAS:</span>
                    {m.mandatoryTasks.map((t, idx) => (
                      <p key={idx} className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{t}</span>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* MODAL DE COMPLETAR INSPECCIÓN MECÁNICA */}
        {completingApp && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs backdrop-blur-md animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] p-6 space-y-4 shadow-2xl text-zinc-900 dark:text-zinc-100 font-sans">
              
              <div className="flex items-center space-x-3 text-purple-400">
                <div className="p-2.5 bg-purple-500/20 rounded-2xl border border-purple-500/30">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Inspección de Taller & Garantía</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{completingApp.clientName} ({completingApp.serviceMilestoneKm} km)</p>
                </div>
              </div>

              {/* Checklist Interactivo */}
              <div className="space-y-2.5 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs">
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold uppercase block mb-1">CHECKLIST OBLIGATORIO:</span>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.oilChanged}
                    onChange={e => setChecklist({ ...checklist, oilChanged: e.target.checked })}
                    className="rounded text-purple-500"
                  />
                  <span>Cambio de Aceite 20W-50 4T Realizado</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.chainAdjusted}
                    onChange={e => setChecklist({ ...checklist, chainAdjusted: e.target.checked })}
                    className="rounded text-purple-500"
                  />
                  <span>Cadena Tensionada y Lubricada</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.valvesCalibrated}
                    onChange={e => setChecklist({ ...checklist, valvesCalibrated: e.target.checked })}
                    className="rounded text-purple-500"
                  />
                  <span>Calibración de Válvulas según Fabricante</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.brakesChecked}
                    onChange={e => setChecklist({ ...checklist, brakesChecked: e.target.checked })}
                    className="rounded text-purple-500"
                  />
                  <span>Frenos y Pastillas Inspeccionados</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.electricalChecked}
                    onChange={e => setChecklist({ ...checklist, electricalChecked: e.target.checked })}
                    className="rounded text-purple-500"
                  />
                  <span>Sistema Eléctrico y Luces en Orden</span>
                </label>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-400 block mb-1 text-xs">Observaciones del Mecánico:</label>
                <input
                  type="text"
                  value={mechanicNotes}
                  onChange={e => setMechanicNotes(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  onClick={() => setCompletingApp(null)}
                  className="flex-1 p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleCompleteService}
                  className="flex-1 p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-purple-950/50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Emitir Certificado SHA-256</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
