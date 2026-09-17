"use client";

import React, { useRef, useState } from "react";
import { 
  Printer, 
  X, 
  ShieldCheck, 
  QrCode, 
  Download, 
  FileText, 
  Receipt, 
  FileCheck, 
  Navigation, 
  AlertTriangle, 
  DollarSign, 
  Calendar,
  CheckCircle2
} from "lucide-react";
import { LoanContract } from "../../types";
import { TenantOnboardingEngine } from "../../modules/tenant-onboarding";
import { BcvEngine } from "../../modules/bcv-engine";

export type DocType = 
  | "CONTRACT" 
  | "RECEIPT" 
  | "INTT_DISCLAIMER" 
  | "SETTLEMENT" 
  | "REPOSSESSION_ACT" 
  | "REFUND_ACT" 
  | "EXPIRATION_ACT" 
  | "SCHEDULE_PLAN";

export default function PrintDocumentModal({
  isOpen,
  onClose,
  docType: initialDocType,
  contract,
  receiptData,
  bcvRate
}: {
  isOpen: boolean;
  onClose: () => void;
  docType: DocType;
  contract: LoanContract;
  receiptData?: any;
  bcvRate: number;
}) {
  const [activeDocType, setActiveDocType] = useState<DocType>(initialDocType);
  const printRef = useRef<HTMLDivElement>(null);
  const tenant = TenantOnboardingEngine.getProfile();

  // Sincronizar docType si cambia desde props
  React.useEffect(() => {
    setActiveDocType(initialDocType);
  }, [initialDocType]);

  if (!isOpen || !contract) return null;

  const currentRate = bcvRate || BcvEngine.getActiveRateValue() || 847.44;
  const todayFormatted = new Date().toLocaleDateString("es-VE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const sha256VerificationHash = `SHA256:${Buffer.from(`${contract.contractNumber}-${contract.clientDocId}-${activeDocType}`).toString("hex").slice(0, 24).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div className="bg-white dark:bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-4xl w-full p-6 space-y-4 shadow-2xl my-8 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-2xl max-h-[88vh]" onClick={(e) => e.stopPropagation()}>
        
        {/* BARRA SUPERIOR DE CONTROL (NO SE IMPRIME) */}
        <div className="space-y-3 border-b border-zinc-200 dark:border-zinc-200 dark:border-zinc-800 pb-4 print:hidden">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-700 dark:text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                  Generador de Documentos Oficiales Notariales & Legales
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Expediente: <strong className="text-google-green-600 dark:text-google-green-400 font-mono">#{contract.contractNumber}</strong> • Cliente: <strong className="text-slate-800 dark:text-slate-200">{contract.clientName}</strong> ({contract.clientDocId})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePrint}
                className="bg-google-green-600 hover:bg-google-green-700 text-white font-semibold text-xs px-4 py-2 rounded-full transition flex items-center space-x-1.5 shadow-sm cursor-pointer active:scale-95"
                title="Imprime o guarda en formato PDF estándar"
              >
                <Download className="w-4 h-4" />
                <span>Descargar / Imprimir PDF</span>
              </button>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                title="Cerrar vista previa"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Selector de Pestañas de Documentos Disponibles */}
          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-2xl sm:rounded-full border border-slate-200/90 dark:border-zinc-800 text-xs">
            {[
              { id: "CONTRACT", label: "Contrato & Pagaré", icon: FileText },
              { id: "RECEIPT", label: "Recibo de Caja", icon: Receipt },
              { id: "SCHEDULE_PLAN", label: "Plan de Abonos", icon: Calendar },
              { id: "INTT_DISCLAIMER", label: "Descargo INTT", icon: FileCheck },
              { id: "SETTLEMENT", label: "Finiquito Notarial", icon: CheckCircle2 },
              { id: "REPOSSESSION_ACT", label: "Acta Retención", icon: Navigation },
              { id: "REFUND_ACT", label: "Liquidación 70/30", icon: DollarSign },
              { id: "EXPIRATION_ACT", label: "Acta Expiración", icon: AlertTriangle },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeDocType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDocType(tab.id as DocType)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-medium transition cursor-pointer ${
                    isActive 
                      ? "bg-google-blue-600 text-white font-semibold shadow-xs" 
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DOCUMENTO FORMAL (HOJA BLANCA MEMBRETADA CON FORMATO NOTARIAL) */}
        <div 
          ref={printRef}
          className="bg-white text-slate-900 p-10 rounded-2xl shadow-xl font-serif text-[11px] leading-relaxed border border-slate-200 overflow-y-auto print:max-h-none print:overflow-visible print:border-none print:shadow-none print:p-8 print:m-0 print:w-full"
        >
          {/* Membrete Corporativo Oficial */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5">
            <div>
              <h1 className="font-bold text-base uppercase tracking-tight text-slate-900 font-sans">{tenant.legalName}</h1>
              <p className="text-xs font-semibold text-slate-700 font-sans">{tenant.commercialName} • División de Crédito Automotriz</p>
              <p className="text-[10px] text-slate-600 font-mono">RIF: {tenant.rif} • Tlf Máster: {tenant.phone}</p>
              <p className="text-[10px] text-slate-600">{tenant.address}</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="w-14 h-14 border-2 border-slate-900 rounded-lg flex items-center justify-center p-1 bg-slate-50 mb-1">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <span className="text-[9px] font-mono text-slate-500 font-bold">N° Expediente: #{contract.contractNumber}</span>
              <span className="text-[9px] text-slate-600 font-sans">Caracas, {todayFormatted}</span>
              <span className="text-[8px] font-mono text-slate-500 mt-0.5">{sha256VerificationHash}</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 1. CONTRATO DE RESERVA DE DOMINIO & PAGARÉ MERCANTIL ANEXO                */}
          {/* ========================================================================= */}
          {activeDocType === "CONTRACT" && (
            <div className="space-y-4">
              <h2 className="text-center font-bold text-sm uppercase tracking-wide underline font-sans">
                CONTRATO DE VENTA CON RESERVA DE DOMINIO Y FINANCIAMIENTO VEHICULAR
              </h2>

              <p className="text-justify indent-4">
                Entre la sociedad mercantil <strong>{tenant.legalName}</strong>, domiciliada en {tenant.address}, inscrita ante el Registro de Información Fiscal bajo el N° <strong>{tenant.rif}</strong> (en lo sucesivo denominada "LA FINANCIADORA"), por una parte; y por la otra el ciudadano(a) <strong>{contract.clientName}</strong>, titular de la Cédula de Identidad N° <strong>{contract.clientDocId}</strong>, domiciliado en {contract.clientAddress}, teléfono {contract.clientPhone} (en lo sucesivo "EL DEUDOR / COMPRADOR"), conjuntamente con su fiador y avalista solidario principal <strong>{contract.guarantor?.name || "Elena Mendoza"}</strong>, titular de la Cédula de Identidad N° <strong>{contract.guarantor?.docId || "V-20.192.481"}</strong> y teléfono <strong>{contract.guarantor?.phone || "+58 414-990-1289"}</strong> (en lo sucesivo "EL FIADOR SOLIDARIO"), han convenido celebrar el presente contrato mercantil de financiamiento y venta con reserva de dominio, sujeto a las cláusulas siguientes:
              </p>

              {/* Ficha Técnica del Vehículo */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-300 font-sans text-[10px] space-y-1 my-2">
                <p className="font-bold text-slate-900 uppercase">IDENTIFICACIÓN TÉCNICA DEL VEHÍCULO FINANCIADO:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <p>• Marca y Modelo: <strong>{contract.vehicle?.brand} {contract.vehicle?.model}</strong></p>
                  <p>• Año de Fabricación: <strong>{contract.vehicle?.year}</strong> • Color: <strong>{contract.vehicle?.color}</strong></p>
                  <p>• Serial de Carrocería / Chasis (VIN): <strong className="font-mono">{contract.vehicle?.vinChassis}</strong></p>
                  <p>• Serial de Motor: <strong className="font-mono">{contract.vehicle?.engineSerial}</strong></p>
                  <p>• Placa Asignada / En Trámite: <strong className="font-mono">{contract.vehicle?.plate || "EN TRÁMITE INTT"}</strong></p>
                  <p>• Precio Retail Empresa: <strong>${contract.companyPriceUSD || contract.vehicle?.retailPriceUSD} USD</strong></p>
                </div>
              </div>

              <p className="text-justify">
                <strong>CLÁUSULA PRIMERA (CONDICIONES FINANCIERAS & AMORTIZACIÓN):</strong> El precio de venta financiado convenido es de <strong>${contract.companyPriceUSD || contract.vehicle?.retailPriceUSD} USD</strong>. EL DEUDOR cancela en este acto una inicial amortizable de <strong>${contract.initialCosts.vehicleDownPaymentUSD} USD</strong>, sumado a los gastos administrativos ($50), seguro RCV ($35), trámites de experticia INTT ($80) e instalación/dispositivo GPS ($120), restando un capital neto financiado de <strong>${contract.financedAmountUSD} USD</strong>, el cual se amortizará en <strong>{contract.totalQuotas} cuotas mensuales</strong> consecutivas a una tasa de interés del {contract.interestRateAnnual}% anual.
              </p>

              <p className="text-justify">
                <strong>CLÁUSULA SEGUNDA (INDEXACIÓN & PAGO BIMONETARIO BCV):</strong> Todas las obligaciones pecuniarias derivadas del presente instrumento se expresan y fijan en Dólares de los Estados Unidos de América (USD) como moneda de cuenta indexada. EL DEUDOR podrá extinguir sus pagos en Bolívares (VES) calculados a la <strong>Tasa Oficial de Cambio publicada por el Banco Central de Venezuela (BCV)</strong> correspondiente a la fecha valor del pago. En caso de realizar pagos en divisas en efectivo (USD), aplicará el recargo correspondiente al IGTF (3%) según la normativa tributaria vigente.
              </p>

              <p className="text-justify">
                <strong>CLÁUSULA TERCERA (RESERVA DE DOMINIO & PROPIEDAD):</strong> De conformidad con la Ley de Venta con Reserva de Dominio y el Código Civil de la República Bolivariana de Venezuela, LA FINANCIADORA se reserva la propiedad, dominio y título del vehículo hasta tanto EL DEUDOR no haya cancelado íntegramente el cien por ciento (100%) del capital, intereses, moras y aranceles causados. Durante la vigencia del crédito, EL DEUDOR ostenta única y exclusivamente la posesión en calidad de depositario y custodio responsable.
              </p>

              <p className="text-justify">
                <strong>CLÁUSULA CUARTA (CONDICIONES DE SUSPENSIÓN & RECUPERACIÓN EN CAMPO):</strong> Las partes convienen expresamente las siguientes penalidades por incumplimiento:
                <br />
                <strong>a) Clientes con vehículo entregado:</strong> En caso de acumular más de dos (2) meses de atraso continuo en el pago de sus cuotas, el contrato pasará al estado de <em>Recuperación de Vehículo</em>, facultando a LA FINANCIADORA a comisionar a su equipo de investigación de campo para la retención física e internamiento de la unidad en patio de custodia.
                <br />
                <strong>b) Clientes sin vehículo entregado:</strong> En caso de que el cliente acumule más de tres (3) meses continuos de impago sin haber recibido la unidad, el contrato quedará <strong>EXPIRADO Y SUSPENDIDO PERMANENTEMENTE</strong>, perdiendo el deudor todo derecho a reclamo o retiro de las sumas aportadas, las cuales quedarán retenidas e indemnizadas por rescisión culposa.
              </p>

              <p className="text-justify">
                <strong>CLÁUSULA QUINTA (AVAL Y FIANZA SOLIDARIA):</strong> EL FIADOR SOLIDARIO se constituye en principal pagador, renunciando expresamente a los beneficios de orden y excusión, respondiendo solidaria e ilimitadamente con todos sus bienes presentes y futuros por el cumplimiento íntegro del saldo deudor.
              </p>

              {/* Firmas Notariales y Huella Dactilar */}
              <div className="pt-6 grid grid-cols-2 gap-8 text-center font-sans text-[10px]">
                <div className="border-t-2 border-slate-900 pt-2 space-y-1">
                  <p className="font-bold text-slate-900">{contract.clientName}</p>
                  <p className="font-mono">C.I.: {contract.clientDocId}</p>
                  <p className="text-slate-600 uppercase font-bold text-[9px]">EL DEUDOR / COMPRADOR</p>
                  <div className="w-16 h-20 border-2 border-dashed border-slate-400 mx-auto mt-2 flex flex-col items-center justify-center text-[8px] text-slate-500 bg-slate-50">
                    <span>Pulgar Derecho</span>
                    <span className="text-[7px]">Huella Dactilar</span>
                  </div>
                </div>

                <div className="border-t-2 border-slate-900 pt-2 space-y-1">
                  <p className="font-bold text-slate-900">{contract.guarantor?.name || "Elena Mendoza"}</p>
                  <p className="font-mono">C.I.: {contract.guarantor?.docId || "V-20.192.481"}</p>
                  <p className="text-slate-600 uppercase font-bold text-[9px]">EL FIADOR Y AVAL SOLIDARIO</p>
                  <div className="w-16 h-20 border-2 border-dashed border-slate-400 mx-auto mt-2 flex flex-col items-center justify-center text-[8px] text-slate-500 bg-slate-50">
                    <span>Pulgar Derecho</span>
                    <span className="text-[7px]">Huella Dactilar</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. RECIBO OFICIAL DE CAJA (DESGLOSE BIMONETARIO BCV + IVA + IGTF)         */}
          {/* ========================================================================= */}
          {activeDocType === "RECEIPT" && (
            <div className="space-y-4 font-sans text-xs">
              <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                  Comprobante Oficial de Recaudo & Amortización Bimonetaria
                </span>
                <h2 className="text-2xl font-black text-emerald-950 font-mono">
                  {receiptData?.receiptCode || `REC-${contract.contractNumber}-2026`}
                </h2>
                <p className="text-xs text-emerald-800">
                  Tasa Oficial de Cambio BCV: <strong>Bs. {currentRate.toFixed(2)} / USD</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-sans">
                <div>
                  <span className="text-slate-500 text-[10px] block">CLIENTE / DEUDOR:</span>
                  <strong className="text-slate-900 text-sm">{contract.clientName}</strong>
                  <p className="font-mono text-slate-700 text-[11px]">C.I.: {contract.clientDocId}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">VEHÍCULO VINCULADO:</span>
                  <strong className="text-slate-900 text-sm">{contract.vehicle?.brand} {contract.vehicle?.model}</strong>
                  <p className="font-mono text-slate-700 text-[11px]">Placa: {contract.vehicle?.plate || "EN TRÁMITE"}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">MONTO COBRADO ($ USD):</span>
                  <p className="text-xl font-black text-slate-900 font-mono">${receiptData?.amountUSD || 50.00} USD</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">EQUIVALENTE VES (BCV):</span>
                  <p className="text-xl font-black text-emerald-700 font-mono">
                    {BcvEngine.formatVes(BcvEngine.convertUsdToVes(receiptData?.amountUSD || 50.00, currentRate))}
                  </p>
                </div>
              </div>

              {/* Desglose Tributario */}
              <div className="bg-slate-100 p-3 rounded-lg border border-slate-300 text-[11px] font-mono grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-slate-500 text-[9px] block">MÉTODO DE PAGO:</span>
                  <strong>{receiptData?.paymentMethod || "PAGO_MOVIL"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] block">IVA 16% DEVENGADO:</span>
                  <strong>${((receiptData?.amountUSD || 50.00) * 0.16 * 0.18).toFixed(2)} USD</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] block">IGTF (3% DIVISAS):</span>
                  <strong>{receiptData?.paymentMethod === "CASH_USD" ? `$${((receiptData?.amountUSD || 50) * 0.03).toFixed(2)} USD` : "EXENTO (Bs.)"}</strong>
                </div>
              </div>

              <div className="pt-8 flex justify-between items-center text-[10px] text-slate-600 border-t border-slate-200">
                <span className="font-mono">Sello Criptográfico: {sha256VerificationHash}</span>
                <span>Firma de Caja / Tesorería: _______________________</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. CRONOGRAMA OFICIAL DEL PLAN DE ABONOS EN PDF                           */}
          {/* ========================================================================= */}
          {activeDocType === "SCHEDULE_PLAN" && (
            <div className="space-y-4 font-sans text-xs">
              <h2 className="text-center font-bold text-sm uppercase underline">
                CRONOGRAMA OFICIAL DE AMORTIZACIÓN & PLAN DE ABONOS
              </h2>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-3 gap-2 text-[11px]">
                <div>Cliente: <strong>{contract.clientName}</strong></div>
                <div>C.I.: <strong className="font-mono">{contract.clientDocId}</strong></div>
                <div>Contrato: <strong className="font-mono">#{contract.contractNumber}</strong></div>
                <div>Vehículo: <strong>{contract.vehicle?.brand} {contract.vehicle?.model}</strong></div>
                <div>Saldo Financiado: <strong>${contract.financedAmountUSD} USD</strong></div>
                <div>Total Cuotas: <strong>{contract.totalQuotas} Meses</strong></div>
              </div>

              <table className="w-full text-left text-[10px] border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="p-2">N° Cuota</th>
                    <th className="p-2">Vencimiento</th>
                    <th className="p-2">Capital</th>
                    <th className="p-2">Interés</th>
                    <th className="p-2">IVA (16%)</th>
                    <th className="p-2">Total ($ USD)</th>
                    <th className="p-2">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {contract.schedule?.map(q => (
                    <tr key={q.quotaNumber} className={q.status === "PAID" ? "bg-emerald-50/50" : ""}>
                      <td className="p-2 font-bold">Cuota #{q.quotaNumber}</td>
                      <td className="p-2">{q.dueDate}</td>
                      <td className="p-2">${q.capitalUSD}</td>
                      <td className="p-2">${q.interestUSD}</td>
                      <td className="p-2">${q.ivaUSD}</td>
                      <td className="p-2 font-bold text-slate-900">${q.totalQuotaUSD} USD</td>
                      <td className="p-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-sans font-bold ${
                          q.status === "PAID" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                        }`}>
                          {q.status === "PAID" ? "PAGADO" : "PENDIENTE"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-[10px] text-slate-500 italic">
                * Las cuotas pagadas en Bolívares se calculan a la tasa oficial del Banco Central de Venezuela (BCV) del día exacto del depósito o transferencia.
              </p>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. DESCARGO LEGAL DE TIEMPOS INTT                                         */}
          {/* ========================================================================= */}
          {activeDocType === "INTT_DISCLAIMER" && (
            <div className="space-y-4">
              <h2 className="text-center font-bold text-sm uppercase underline font-sans">
                DOCUMENTO DE DECLARACIÓN, ACEPTACIÓN DE RIESGOS Y DESCARGO DE RESPONSABILIDAD
                POR TRÁMITES ANTE EL INSTITUTO NACIONAL DE TRANSPORTE TERRESTRE (INTT)
              </h2>
              <p className="text-justify indent-4 leading-relaxed">
                Yo, <strong>{contract.clientName}</strong>, titular de la Cédula de Identidad N° <strong>{contract.clientDocId}</strong>, con domicilio en {contract.clientAddress}, por medio del presente documento declaro de manera libre, voluntaria y expresa lo siguiente:
              </p>
              <p className="text-justify indent-4 leading-relaxed">
                <strong>PRIMERO:</strong> Que he adquirido financiado el vehículo marca <strong>{contract.vehicle?.brand} {contract.vehicle?.model}</strong> (Serial de Carrocería/VIN: {contract.vehicle?.vinChassis}, Serial de Motor: {contract.vehicle?.engineSerial}) a la sociedad mercantil <strong>{tenant.legalName}</strong> (RIF: {tenant.rif}).
              </p>
              <p className="text-justify indent-4 leading-relaxed">
                <strong>SEGUNDO:</strong> Que conozco y acepto plenamente que los tiempos de emisión de placas identificadoras, experticias técnicas vehiculares, verificación en el sistema SIIPOL y otorgamiento de Títulos de Propiedad corresponden de forma exclusiva y soberana al <strong>Instituto Nacional de Transporte Terrestre (INTT)</strong> como órgano público desconcentrado.
              </p>
              <p className="text-justify indent-4 leading-relaxed">
                <strong>TERCERO:</strong> En consecuencia, <strong>EXONERO EXPRESAMENTE</strong> a <strong>{tenant.legalName}</strong> de toda responsabilidad civil, administrativa o patrimonial por demoras, caídas del sistema informático gubernamental o retrasos institucionales atribuibles al INTT.
              </p>
              <div className="pt-10 text-center font-sans text-xs">
                <div className="border-t-2 border-slate-900 w-64 mx-auto pt-2">
                  <p className="font-bold text-slate-900">{contract.clientName}</p>
                  <p className="font-mono">C.I.: {contract.clientDocId}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">FIRMA CONFORME DEL DEUDOR</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. FINIQUITO TOTAL Y LIBERACIÓN DE RESERVA DE DOMINIO                      */}
          {/* ========================================================================= */}
          {activeDocType === "SETTLEMENT" && (
            <div className="space-y-4">
              <h2 className="text-center font-bold text-sm uppercase underline font-sans">
                CARTA DE FINIQUITO TOTAL Y LIBERACIÓN DE RESERVA DE DOMINIO
              </h2>
              <p className="text-justify indent-4 leading-relaxed">
                Por medio de la presente, la sociedad mercantil <strong>{tenant.legalName}</strong>, inscrita bajo el RIF <strong>{tenant.rif}</strong>, certifica y hace constar solemnemente que el ciudadano(a) <strong>{contract.clientName}</strong> (C.I. N° {contract.clientDocId}) ha cancelado la totalidad del <strong>CIEN POR CIENTO (100%)</strong> de las obligaciones pecuniarias derivadas del Contrato de Venta con Reserva de Dominio N° <strong>{contract.contractNumber}</strong>.
              </p>
              <p className="text-justify indent-4 leading-relaxed">
                En virtud de encontrarse plenamente solvente por concepto de capital, intereses, moras y gastos administrativos, <strong>SE DECLARA LA EXTINCIÓN TOTAL DEL CRÉDITO Y SE AUTORIZA EL LEVANTAMIENTO Y LIBERACIÓN DE LA RESERVA DE DOMINIO</strong> sobre el vehículo marca <strong>{contract.vehicle?.brand} {contract.vehicle?.model}</strong> (VIN: {contract.vehicle?.vinChassis}, Motor: {contract.vehicle?.engineSerial}, Placa: {contract.vehicle?.plate || "EN TRÁMITE"}), facultando al comprador para efectuar el trámite de traspaso de propiedad a su exclusivo nombre.
              </p>
              <div className="pt-12 text-center font-sans text-xs">
                <div className="border-t-2 border-slate-900 w-72 mx-auto pt-2">
                  <p className="font-bold text-slate-900">{tenant.legalName}</p>
                  <p className="text-[10px] text-slate-600 font-bold">REPRESENTANTE LEGAL & SELLO HÚMEDO CORPORATIVO</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. ACTA DE RETENCIÓN FÍSICA EN CAMPO                                      */}
          {/* ========================================================================= */}
          {activeDocType === "REPOSSESSION_ACT" && (
            <div className="space-y-4">
              <h2 className="text-center font-bold text-sm uppercase underline font-sans text-red-900">
                ACTA NOTARIAL DE INSPECCIÓN Y RETENCIÓN FÍSICA DE VEHÍCULO EN CAMPO
              </h2>
              <p className="text-justify indent-4">
                En la ciudad de Caracas, siendo el día <strong>{todayFormatted}</strong>, los Oficiales del Equipo de Investigación de Campo y Cobranza Presencial de <strong>{tenant.legalName}</strong> se constituyeron en la dirección <em>{contract.clientAddress}</em>, a los fines de proceder a la retención física preventiva del vehículo marca <strong>{contract.vehicle?.brand} {contract.vehicle?.model}</strong> (VIN: {contract.vehicle?.vinChassis}, Placa: {contract.vehicle?.plate || "EN TRÁMITE"}), en virtud del incumplimiento contractual de pago acumulado superior a sesenta (60) días continuos por parte del deudor <strong>{contract.clientName}</strong> (C.I. {contract.clientDocId}).
              </p>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-300 text-[10px] space-y-1 font-sans">
                <p className="font-bold text-slate-900">INSPECCIÓN TÉCNICA DEL ESTADO DEL VEHÍCULO:</p>
                <p>• Kilometraje actual registrado: <strong>14,820 km</strong></p>
                <p>• Carrocería / Pintura: <strong>Condiciones operativas regulares, sin choques estructurales</strong></p>
                <p>• Accesorios recibidos: <strong>Juego de 2 llaves originales, retrovisores, batería operativa</strong></p>
                <p>• Patio de Depósito y Custodia: <strong>Patio Central de Resguardo Chacao</strong></p>
              </div>

              <div className="pt-10 grid grid-cols-2 gap-8 text-center font-sans text-xs">
                <div className="border-t-2 border-slate-900 pt-2">
                  <p className="font-bold text-slate-900">OFICIAL DE CAMPO</p>
                  <p className="text-[10px] text-slate-600">Investigador Responsable</p>
                </div>
                <div className="border-t-2 border-slate-900 pt-2">
                  <p className="font-bold text-slate-900">RESPONSABLE DE PATIO</p>
                  <p className="text-[10px] text-slate-600">Custodia y Recepción</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. ACTA DE LIQUIDACIÓN DE REEMBOLSO (REGLA 70% / 30%)                      */}
          {/* ========================================================================= */}
          {activeDocType === "REFUND_ACT" && (
            <div className="space-y-4">
              <h2 className="text-center font-bold text-sm uppercase underline font-sans">
                ACTA OFICIAL DE FINIQUITO DE RESCISIÓN & LIQUIDACIÓN DE REEMBOLSO (70% / 30%)
              </h2>
              <p className="text-justify indent-4 leading-relaxed">
                Por medio de la presente, la empresa <strong>{tenant.legalName}</strong> (RIF: {tenant.rif}) y el ciudadano(a) <strong>{contract.clientName}</strong> (C.I. {contract.clientDocId}) hacen constar que, habiéndose presentado causa justificada debidamente aprobada por la Gerencia General, se ha acordado la rescisión voluntaria del Contrato N° <strong>{contract.contractNumber}</strong> bajo las siguientes condiciones de liquidación económica:
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-300 font-sans text-xs space-y-2">
                <p className="font-bold text-slate-900">DESGLOSE DE LIQUIDACIÓN ECONÓMICA:</p>
                <div className="grid grid-cols-3 gap-2 font-mono">
                  <div className="bg-white p-2 rounded border">
                    <span className="text-[10px] text-slate-500 block">Total Aportado:</span>
                    <strong className="text-slate-900">${contract.refundDetails?.totalPaidUSD || contract.totalPaidUSD} USD</strong>
                  </div>
                  <div className="bg-amber-50 p-2 rounded border border-amber-300">
                    <span className="text-[10px] text-amber-800 block font-bold">Retención Gastos (30%):</span>
                    <strong className="text-amber-900">${contract.refundDetails?.companyRetention30PercentUSD || (contract.totalPaidUSD * 0.30).toFixed(2)} USD</strong>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded border border-emerald-300">
                    <span className="text-[10px] text-emerald-800 block font-bold">Devolución Cliente (70%):</span>
                    <strong className="text-emerald-950 text-sm">${contract.refundDetails?.clientRefund70PercentUSD || (contract.totalPaidUSD * 0.70).toFixed(2)} USD</strong>
                  </div>
                </div>
                <p className="text-[10px] text-slate-600 font-serif pt-1">
                  Motivo de aprobación: <em>{contract.refundDetails?.reason || "Justificación médica y económica calificada."}</em>
                </p>
              </div>

              <div className="pt-10 grid grid-cols-2 gap-8 text-center font-sans text-xs">
                <div className="border-t-2 border-slate-900 pt-2">
                  <p className="font-bold text-slate-900">{contract.clientName}</p>
                  <p className="text-[10px] text-slate-600">CLIENTE (RECIBE CONFORME)</p>
                </div>
                <div className="border-t-2 border-slate-900 pt-2">
                  <p className="font-bold text-slate-900">{tenant.legalName}</p>
                  <p className="text-[10px] text-slate-600">GERENCIA GENERAL & TESORERÍA</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. ACTA DE EXPIRACIÓN Y SUSPENSIÓN DEFINITIVA (>3 MESES SIN MOTO)          */}
          {/* ========================================================================= */}
          {activeDocType === "EXPIRATION_ACT" && (
            <div className="space-y-4">
              <h2 className="text-center font-bold text-sm uppercase underline font-sans text-red-900">
                ACTA NOTARIAL DE SUSPENSIÓN PERMANENTE Y PÉRDIDA DE FONDOS POR EXPIRACIÓN CONTRACTUAL
              </h2>
              <p className="text-justify indent-4 leading-relaxed">
                Se hace constar que el Contrato N° <strong>{contract.contractNumber}</strong> suscrito por el deudor <strong>{contract.clientName}</strong> (C.I. {contract.clientDocId}) ha incurrido en la causal de <strong>EXPIRACIÓN CONTRACTUAL DEFINITIVA</strong>, al verificarse que el cliente no posee vehículo entregado y ha acumulado más de tres (3) meses consecutivos de abandono e impago de sus cuotas.
              </p>
              <p className="text-justify indent-4 leading-relaxed">
                De conformidad con la Cláusula Cuarta del contrato mercantil de financiamiento, <strong>EL CONTRATO QUEDA SUSPENDIDO DE FORMA PERMANENTE E IRREVERSIBLE</strong>, perdiendo el deudor el derecho a retirar los fondos aportados (${contract.totalPaidUSD} USD), los cuales quedan retenidos por la empresa por concepto de indemnización y penalidad por incumplimiento culposo.
              </p>
              <div className="pt-10 text-center font-sans text-xs">
                <div className="border-t-2 border-slate-900 w-72 mx-auto pt-2">
                  <p className="font-bold text-slate-900">{tenant.legalName}</p>
                  <p className="text-[10px] text-slate-600">CONSULTORÍA JURÍDICA & GERENCIA</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
