"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Database,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Check,
  AlertCircle
} from "lucide-react";
import { BulkDataEngine, BulkImportPreviewResult, ValidationIssue, ParsedClientRow } from "../../modules/bulk-data";

interface BulkDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataImported: () => void;
}

export default function BulkDataModal({
  isOpen,
  onClose,
  onDataImported
}: BulkDataModalProps) {
  const [activeTab, setActiveTab] = useState<"IMPORT_CLIENTS" | "IMPORT_VEHICLES" | "BACKUP_EXPORT">("IMPORT_CLIENTS");
  const [rawCsvInput, setRawCsvInput] = useState<string>("");
  const [previewResult, setPreviewResult] = useState<BulkImportPreviewResult<ParsedClientRow> | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);
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

    const handleDownloadTemplate = (type: "CLIENTS" | "VEHICLES", format: "EXCEL_SEMICOLON" | "STANDARD_COMMA" = "EXCEL_SEMICOLON") => {
    const delimiter = format === "EXCEL_SEMICOLON" ? ";" : ",";
    const csv = type === "CLIENTS" ? BulkDataEngine.getClientsTemplateCSV(delimiter) : BulkDataEngine.getVehiclesTemplateCSV(delimiter);
    const prefix = format === "EXCEL_SEMICOLON" ? "plantilla_excel_" : "plantilla_estandar_";
    const filename = type === "CLIENTS" ? (prefix + "clientes_autolending.csv") : (prefix + "inventario_vehiculos.csv");
    
    // Incluir BOM UTF-8 (\uFEFF) para que Excel abra sin caracteres extraños y con columnas perfectas
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadDemoData = () => {
    const demoCsv = BulkDataEngine.getClientsTemplateCSV();
    setRawCsvInput(demoCsv);
    const result = BulkDataEngine.previewClientsImport(demoCsv);
    setPreviewResult(result);
  };

  const handleAnalyzeCsv = (text: string) => {
    setRawCsvInput(text);
    if (!text.trim()) {
      setPreviewResult(null);
      return;
    }
    const result = BulkDataEngine.previewClientsImport(text);
    setPreviewResult(result);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      handleAnalyzeCsv(text);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (!previewResult || previewResult.parsedRecords.length === 0) return;

    setIsImporting(true);
    setTimeout(() => {
      const count = BulkDataEngine.commitClientsImport(previewResult.parsedRecords);
      setIsImporting(false);
      setSuccessMessage("¡Se han importado " + count + " contratos y clientes exitosamente al sistema!");
      onDataImported();
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 2000);
    }, 600);
  };

  const handleDownloadBackup = () => {
    const backup = BulkDataEngine.generateFullSystemBackup();
    const blob = new Blob([backup.jsonContent], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = backup.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado Modal */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
                <span>Centro de Migración, Importación & Respaldo Masivo</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.2 rounded-full font-mono">
                  CSV / EXCEL / JSON
                </span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">
                Carga masiva de carteras, validación sintáctica de cédulas VE y copias de seguridad con SHA-256
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
            { id: "IMPORT_CLIENTS", label: "Importar Clientes & Contratos (.CSV)", icon: FileSpreadsheet },
            { id: "IMPORT_VEHICLES", label: "Importar Inventario de Vehículos", icon: UploadCloud },
            { id: "BACKUP_EXPORT", label: "Copias de Respaldo & Backup Global", icon: Database }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={"px-4 py-2 font-semibold transition flex items-center space-x-2 border-b-2 " + (
                  isActive 
                    ? "border-blue-500 text-blue-400" 
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
          
          {/* Mensaje de Éxito */}
          {successMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PESTAÑA 1: IMPORTAR CLIENTES & CONTRATOS                                  */}
          {/* ========================================================================= */}
          {activeTab === "IMPORT_CLIENTS" && (
            <div className="space-y-5">
              
              {/* Acciones de Plantilla y Carga Rápida */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">¿Primera vez importando?</h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 mt-0.5">
                    Descarga la plantilla oficial con el formato exacto de columnas y encabezados.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownloadTemplate("CLIENTS", "EXCEL_SEMICOLON")}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>Descargar Plantilla CSV</span>
                  </button>

                  <button
                    onClick={handleLoadDemoData}
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-zinc-900 dark:text-zinc-100 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Cargar 3 Clientes Demo</span>
                  </button>
                </div>
              </div>

              {/* Zona de Drop & Pegado de Texto */}
              <div className="space-y-2 text-xs">
                <label className="text-zinc-700 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-semibold block">
                  Pegar contenido CSV o Seleccionar archivo desde tu equipo:
                </label>

                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-900 dark:text-zinc-100 hover:file:bg-zinc-700 cursor-pointer"
                  />
                </div>

                <textarea
                  value={rawCsvInput}
                  onChange={e => handleAnalyzeCsv(e.target.value)}
                  placeholder="nombre_completo,cedula_rif,telefono,direccion,marca_vehiculo,modelo_vehiculo,precio_empresa_usd,inicial_usd,numero_cuotas..."
                  rows={4}
                  className="w-full p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-[11px] focus:outline-none focus:border-blue-500/50"
                />
              </div>

              {/* Tabla de Vista Previa y Diagnóstico */}
              {previewResult && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                      Diagnóstico de Filas Detectadas
                    </span>

                    <div className="flex items-center space-x-3 text-xs font-mono">
                      <span className="text-emerald-400 font-bold">{"✓ " + previewResult.validCount + " Válidas"}</span>
                      <span className="text-amber-400 font-bold">{"⚠️ " + previewResult.warningCount + " Advertencias"}</span>
                      <span className="text-rose-400 font-bold">{"❌ " + previewResult.errorCount + " Errores"}</span>
                    </div>
                  </div>

                  {/* Advertencias / Errores */}
                  {previewResult.issues.length > 0 && (
                    <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                      {previewResult.issues.map((issue, idx) => (
                        <div 
                          key={idx}
                          className={"p-2 rounded-lg text-[11px] flex items-center space-x-2 " + (
                            issue.type === "ERROR" ? "bg-rose-500/10 text-rose-300 border border-rose-500/20" : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                          )}
                        >
                          {issue.type === "ERROR" ? <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                          <span><strong>{"Fila " + issue.row + " (" + issue.field + "):"}</strong> {issue.message}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tabla Preview */}
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-xs max-h-48 overflow-y-auto">
                    <table className="w-full text-left">
                      <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 font-semibold uppercase">
                        <tr>
                          <th className="p-2.5">Cliente</th>
                          <th className="p-2.5">Cédula / RIF</th>
                          <th className="p-2.5">Teléfono</th>
                          <th className="p-2.5">Vehículo</th>
                          <th className="p-2.5">Precio ($)</th>
                          <th className="p-2.5">Inicial ($)</th>
                          <th className="p-2.5">Cuotas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-850 font-mono text-[11px]">
                        {previewResult.parsedRecords.map((r, idx) => (
                          <tr key={idx} className="hover:bg-white dark:bg-zinc-900/40">
                            <td className="p-2.5 font-sans font-semibold text-zinc-900 dark:text-zinc-100">{r.clientName}</td>
                            <td className="p-2.5 text-zinc-300">{r.clientDocId}</td>
                            <td className="p-2.5 text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400">{r.clientPhone}</td>
                            <td className="p-2.5 text-emerald-400">{(r.vehicle?.brand || "") + " " + (r.vehicle?.model || "")}</td>
                            <td className="p-2.5 text-zinc-200">{"$" + r.companyPriceUSD}</td>
                            <td className="p-2.5 text-zinc-200">{"$" + r.initialDownPaymentUSD}</td>
                            <td className="p-2.5 text-zinc-200">{r.totalQuotas + " Meses"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Botón de Confirmación */}
                  <div className="pt-2">
                    <button
                      onClick={handleExecuteImport}
                      disabled={previewResult.validCount === 0 || isImporting}
                      className={"w-full p-3 rounded-2xl font-bold transition flex items-center justify-center space-x-2 text-xs cursor-pointer " + (
                        previewResult.validCount > 0
                          ? "bg-blue-600 hover:bg-blue-500 text-zinc-900 dark:text-zinc-100 shadow-lg shadow-blue-950/50"
                          : "bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-not-allowed"
                      )}
                    >
                      {isImporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      <span>{"Importar " + previewResult.validCount + " Clientes al Sistema"}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* PESTAÑA 2: IMPORTAR VEHÍCULOS                                             */}
          {/* ========================================================================= */}
          {activeTab === "IMPORT_VEHICLES" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-50 dark:bg-zinc-950/50">
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Importación de Flota e Inventario</h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 mt-0.5">
                    Carga lotes de motos y carros ingresados desde ensambladoras o concesionarios.
                  </p>
                </div>

                <button
                  onClick={() => handleDownloadTemplate("VEHICLES", "EXCEL_SEMICOLON")}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Descargar Plantilla Vehículos CSV</span>
                </button>
              </div>

              <div className="p-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50 dark:bg-zinc-950/40 text-center space-y-2">
                <FileSpreadsheet className="w-8 h-8 text-zinc-600 dark:text-zinc-400 mx-auto" />
                <p className="text-xs font-semibold text-zinc-300">Arrastra tu archivo CSV de unidades aquí</p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Valida seriales VIN de 17 dígitos, serial de motor y precios de concesionario.</p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PESTAÑA 3: BACKUP HUB & EXPORTACIÓN GLOBAL                                */}
          {/* ========================================================================= */}
          {activeTab === "BACKUP_EXPORT" && (
            <div className="space-y-5">
              
              <div className="p-5 rounded-3xl border border-emerald-500/30 bg-emerald-950/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Respaldo Integral del Sistema (Full Snapshot JSON)</h4>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">Firma SHA-256</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Genera una copia de seguridad descargable con el 100% de los expedientes de clientes, fiadores, cronogramas de pago, inventario de vehículos y tasas activas.
                </p>

                <button
                  onClick={handleDownloadBackup}
                  className="bg-emerald-600 hover:bg-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold p-3 rounded-2xl transition flex items-center justify-center space-x-2 text-xs shadow-lg shadow-emerald-950/50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Backup Seguro (.JSON)</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
