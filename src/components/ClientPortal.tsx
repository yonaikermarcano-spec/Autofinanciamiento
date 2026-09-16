"use client";

import React, { useState } from "react";
import { 
  Bike, 
  Car, 
  DollarSign, 
  Smartphone, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Download, 
  ShieldCheck, 
  QrCode, 
  Send,
  Lock,
  ChevronRight,
  LogOut,
  Building2,
  Wallet,
  Search,
  RotateCcw,
  Printer,
  FileCheck,
  Sun,
  Moon,
  Upload,
  RefreshCw,
  PhoneCall,
  UserCheck,
  HelpCircle,
  TrendingUp,
  MapPin,
  Calendar,
  Check,
  ArrowRight,
  CreditCard,
  Receipt,
  ChevronDown,
  Coins,
  Bell
} from "lucide-react";
import { LocalDB } from "../modules/local-db";
import { BcvEngine, CurrencyBenchmark } from "../modules/bcv-engine";
import { FinancialCore } from "../modules/financial-core";
import { AtcTicketsModule } from "../modules/atc-tickets";
import { TenantOnboardingEngine } from "../modules/tenant-onboarding";
import { BankPushEngine, ClientPaymentAttempt } from "../modules/bank-push";
import { MaintenanceWarrantyEngine, WorkshopAppointment } from "../modules/maintenance-warranty";
import { LegalDocumentationEngine, AlliedServiceType, AlliedServiceOrder } from "../modules/legal-documentation";
import { SmartNotificationsEngine, InAppNotification } from "../modules/smart-notifications";
import { LoanContract } from "../types";
import PrintDocumentModal, { DocType } from "./modals/PrintDocumentModal";

export default function ClientPortal({ onSwitchToAdmin }: { onSwitchToAdmin: () => void }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [docIdInput, setDocIdInput] = useState("V-18.942.301");
  const [contractsList, setContractsList] = useState<LoanContract[]>(LocalDB.getAllContracts());
  const [activeContract, setActiveContract] = useState<LoanContract | null>(
    LocalDB.getContractByDocId("V-18.942.301") || contractsList[0] || null
  );

  const [activePortalTab, setActivePortalTab] = useState<"SCHEDULE" | "PAY_REPORT" | "DOCS" | "SUPPORT" | "NOTIFS">("SCHEDULE");
  const [quotaFilter, setQuotaFilter] = useState<"ALL" | "PENDING" | "PAID">("ALL");

  const [activeBenchmark, setActiveBenchmark] = useState<CurrencyBenchmark>("USD_BCV");
  const [usdRate, setUsdRate] = useState<number>(46.85);
  const [eurRate, setEurRate] = useState<number>(50.12);
  const [usdtRate, setUsdtRate] = useState<number>(52.40);
  const [isRateMenuOpen, setIsRateMenuOpen] = useState(false);

  const activeRateValue = activeBenchmark === "EUR_BCV" ? eurRate : activeBenchmark === "USDT_BINANCE" ? usdtRate : usdRate;
  const bcvRate = activeRateValue;
  const tenantProfile = TenantOnboardingEngine.getProfile();

  const [payAmountUSD, setPayAmountUSD] = useState<number>(50);
  const [payMethod, setPayMethod] = useState<"PAGO_MOVIL" | "BINANCE_USDT" | "CASH_USD">("PAGO_MOVIL");
  const [payReference, setPayReference] = useState("PM-9901824");
  const [recentPaymentReceipt, setRecentPaymentReceipt] = useState<any>(null);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printDocType, setPrintDocType] = useState<DocType>("CONTRACT");
  const [printReceiptData, setPrintReceiptData] = useState<any>(null);

  const [tradeInAppraisalUSD, setTradeInAppraisalUSD] = useState<number>(900);
  const [tradeInTargetBikeUSD, setTradeInTargetBikeUSD] = useState<number>(1800);

  const [supportSubject, setSupportSubject] = useState("Consulta de Placas INTT");
  const [supportMessage, setSupportMessage] = useState("");
  const [ticketCreatedSuccess, setTicketCreatedSuccess] = useState<string | null>(null);

  const [selectedPaymentAccountIndex, setSelectedPaymentAccountIndex] = useState<number>(0);
  const [originBankInput, setOriginBankInput] = useState<string>("Banco de Venezuela");
  const [senderPhoneInput, setSenderPhoneInput] = useState<string>("0414-3329011");
  const [casheaRefInput, setCasheaRefInput] = useState<string>("0049281");
  const [isVerifyingCashea, setIsVerifyingCashea] = useState<boolean>(false);
  const [casheaPaymentResult, setCasheaPaymentResult] = useState<{
    success: boolean;
    isInstantValidated: boolean;
    message: string;
    attempt: ClientPaymentAttempt;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [clientOdometerInput, setClientOdometerInput] = useState<number>(480);
  const [clientSelectedMilestoneKm, setClientSelectedMilestoneKm] = useState<number>(500);
  const [clientSelectedWorkshop, setClientSelectedWorkshop] = useState<string>("Taller Central AutoLending Catia");
  const [clientAppointmentDate, setClientAppointmentDate] = useState<string>("2026-08-28 09:00");
  const [clientAppointmentSuccess, setClientAppointmentSuccess] = useState<string | null>(null);

  const [clientAlliedServiceType, setClientAlliedServiceType] = useState<AlliedServiceType>("CERTIFICADO_MEDICO_VIAL");
  const [clientPickupDate, setClientPickupDate] = useState<string>("2026-08-30 10:00");
  const [clientAlliedSuccessMessage, setClientAlliedSuccessMessage] = useState<string | null>(null);
  const [clientAlliedOrders, setClientAlliedOrders] = useState<AlliedServiceOrder[]>(LegalDocumentationEngine.getAllAlliedOrders());
  const [inAppNotifs, setInAppNotifs] = useState<InAppNotification[]>([]);

  const isDark = theme === "dark";

  const handleLogin = (docId: string) => {
    const contract = LocalDB.getContractByDocId(docId) || contractsList.find(c => c.contractNumber === docId || c.clientDocId.includes(docId));
    if (contract) {
      setActiveContract(contract);
      setRecentPaymentReceipt(null);
      setPaymentSuccessMessage(null);
    } else {
      alert("No se encontró ningún financiamiento asociado a la Cédula/Contrato: " + docId);
    }
  };

  const handleProcessClientPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContract) return;

    const targetQuota = activeContract.schedule?.find(q => q.status === "PENDING" || q.status === "PARTIALLY_PAID" || q.status === "OVERDUE");
    if (!targetQuota) {
      alert("¡Felicitaciones! Todas las cuotas de este financiamiento ya han sido canceladas en su totalidad.");
      return;
    }

    try {
      const result = FinancialCore.processPayment({
        schedule: activeContract.schedule,
        quotaNumber: targetQuota.quotaNumber,
        amountPaidUSD: Number(payAmountUSD),
        paymentMethod: payMethod,
        paymentReference: payReference,
        bcvRate,
        clientName: activeContract.clientName,
        contractNumber: activeContract.contractNumber
      });

      const updatedContract: LoanContract = {
        ...activeContract,
        schedule: result.updatedSchedule,
        totalPaidUSD: Number((activeContract.totalPaidUSD + Number(payAmountUSD)).toFixed(2)),
        totalOutstandingUSD: Math.max(0, Number((activeContract.totalOutstandingUSD - Number(payAmountUSD)).toFixed(2))),
        quotasPaidCount: result.updatedSchedule.filter(q => q.status === "PAID").length,
        quotasPendingCount: result.updatedSchedule.filter(q => q.status !== "PAID").length,
        quotasPaidPercent: Number(((result.updatedSchedule.filter(q => q.status === "PAID").length / result.updatedSchedule.length) * 100).toFixed(1))
      };

      LocalDB.updateContract(updatedContract);
      setActiveContract(updatedContract);
      setContractsList(LocalDB.getAllContracts());
      setRecentPaymentReceipt(result);
      setPaymentSuccessMessage("¡Abono registrado con éxito! Recibo: " + result.receiptCode);
    } catch (err: any) {
      alert("Error reportando pago: " + err.message);
    }
  };

  const openPrint = (type: DocType, receipt?: any) => {
    setPrintDocType(type);
    setPrintReceiptData(receipt);
    setIsPrintModalOpen(true);
  };

  const handleClientRequestAlliedService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContract) return;

    const created = LegalDocumentationEngine.requestAlliedService({
      contractNumber: activeContract.contractNumber,
      clientName: activeContract.clientName,
      clientDocId: activeContract.clientDocId,
      clientPhone: activeContract.clientPhone,
      serviceType: clientAlliedServiceType,
      pickupDateScheduled: clientPickupDate
    });

    setClientAlliedOrders(LegalDocumentationEngine.getAllAlliedOrders());
    setClientAlliedSuccessMessage("¡Solicitud #" + created.id + " registrada! Preséntate el " + clientPickupDate + " en oficina para el pago y retiro.");
    setTimeout(() => setClientAlliedSuccessMessage(null), 4000);
  };

  const handleClientScheduleWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContract) return;

    MaintenanceWarrantyEngine.scheduleAppointment({
      contractNumber: activeContract.contractNumber,
      clientName: activeContract.clientName,
      clientPhone: activeContract.clientPhone,
      vehicleModel: activeContract.vehicle.brand + " " + activeContract.vehicle.model,
      plateOrVin: activeContract.vehicle.plate || activeContract.vehicle.vinChassis,
      serviceMilestoneKm: clientSelectedMilestoneKm,
      currentOdometerKm: clientOdometerInput,
      appointmentDate: clientAppointmentDate,
      workshopName: clientSelectedWorkshop,
      mechanicName: "Técnico Especialista Asignado",
      totalCostUSD: 15
    });

    setClientAppointmentSuccess("¡Cita de Mantenimiento confirmada exitosamente para el " + clientAppointmentDate + " en " + clientSelectedWorkshop + "!");
    setTimeout(() => setClientAppointmentSuccess(null), 4000);
  };

  const handleCreateSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContract || !supportMessage.trim()) return;

    const ticket = AtcTicketsModule.createTicket({
      contractNumber: activeContract.contractNumber,
      clientName: activeContract.clientName,
      clientDocId: activeContract.clientDocId,
      clientPhone: activeContract.clientPhone,
      category: "INTT_DOCUMENTATION_INQUIRY",
      subject: supportSubject,
      description: supportMessage.trim()
    });

    setTicketCreatedSuccess("Ticket #" + ticket.ticketId + " creado exitosamente. Un asesor responderá a tu WhatsApp (" + activeContract.clientPhone + ") a la brevedad.");
    setSupportMessage("");
  };

  const tradeInResult = activeContract ? AtcTicketsModule.calculateTradeInUpgrade({
    currentContract: activeContract,
    currentVehicleAppraisedValueUSD: tradeInAppraisalUSD,
    targetNewVehiclePriceUSD: tradeInTargetBikeUSD,
    downPaymentRequiredPercent: 30
  }) : null;

  const filteredSchedule = (activeContract?.schedule || []).filter(q => {
    if (quotaFilter === "PENDING") return q.status === "PENDING" || q.status === "PARTIALLY_PAID" || q.status === "OVERDUE";
    if (quotaFilter === "PAID") return q.status === "PAID";
    return true;
  });

  return (
    <div className={`g-app-shell min-h-screen flex flex-col font-sans antialiased ${
      isDark ? "bg-zinc-950 text-zinc-100" : "bg-[var(--bg)] text-[var(--text)]"
    }`}>
      <header className={`border-b px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md ${
        isDark ? "bg-zinc-950/90 border-zinc-850" : "bg-white/90 border-[var(--border)]"
      }`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm shadow-soft">
            {tenantProfile.commercialName.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-sm tracking-tight text-[var(--text)]">
                {tenantProfile.commercialName}
              </h1>
              <span className="text-[10px] bg-blue-100 text-[var(--primary)] border border-blue-200 px-2 py-0.2 rounded-full font-mono font-medium">
                Portal del Cliente
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-mono">Autoservicio Digital • VE</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="relative">
            <button
              onClick={() => setIsRateMenuOpen(!isRateMenuOpen)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition cursor-pointer ${
                isDark 
                  ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700" 
                  : "bg-white border-[var(--border)] text-[var(--text)] hover:border-[var(--border-strong)]"
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>
                {activeBenchmark === "USD_BCV" && "Dólar BCV: Bs. " + usdRate.toFixed(2)}
                {activeBenchmark === "EUR_BCV" && "Euro BCV: Bs. " + eurRate.toFixed(2)}
                {activeBenchmark === "USDT_BINANCE" && "Binance USDT: Bs. " + usdtRate.toFixed(2)}
              </span>
              <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
            </button>

            {isRateMenuOpen && (
              <div className={`absolute right-0 top-11 w-72 rounded-xl p-2.5 shadow-2xl border text-xs space-y-2 z-50 ${
                isDark ? "bg-zinc-900 border-zinc-800 text-zinc-200" : "bg-white border-[var(--border)] text-[var(--text)]"
              }`}>
                <div className="border-b border-[var(--border)] pb-2 flex items-center justify-between">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                    Seleccionar Tasa Activa
                  </span>
                  <span className="text-[10px] text-[var(--primary)] font-semibold">● En Vivo</span>
                </div>

                <div onClick={() => { setActiveBenchmark("USD_BCV"); setIsRateMenuOpen(false); }} className={`p-2.5 rounded-lg border transition cursor-pointer space-y-1.5 ${activeBenchmark === "USD_BCV" ? "bg-blue-50 border-blue-200 text-[var(--primary)]" : "bg-[var(--surface-alt)] border-[var(--border)] hover:bg-white"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center space-x-1.5"><DollarSign className="w-3.5 h-3.5 text-[var(--primary)]" /><span>1. Dólar BCV Oficial ($)</span></span>
                    {activeBenchmark === "USD_BCV" && <Check className="w-4 h-4 text-[var(--primary)]" />}
                  </div>
                  <div className="flex items-center justify-between font-mono"><span className="text-sm font-black">Bs. {usdRate.toFixed(2)}</span></div>
                </div>

                <div onClick={() => { setActiveBenchmark("EUR_BCV"); setIsRateMenuOpen(false); }} className={`p-2.5 rounded-lg border transition cursor-pointer space-y-1.5 ${activeBenchmark === "EUR_BCV" ? "bg-blue-50 border-blue-200 text-[var(--primary)]" : "bg-[var(--surface-alt)] border-[var(--border)] hover:bg-white"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center space-x-1.5"><Coins className="w-3.5 h-3.5 text-[var(--primary)]" /><span>2. Euro BCV Oficial (€)</span></span>
                    {activeBenchmark === "EUR_BCV" && <Check className="w-4 h-4 text-[var(--primary)]" />}
                  </div>
                  <div className="flex items-center justify-between font-mono"><span className="text-sm font-black">Bs. {eurRate.toFixed(2)}</span></div>
                </div>

                <div onClick={() => { setActiveBenchmark("USDT_BINANCE"); setIsRateMenuOpen(false); }} className={`p-2.5 rounded-lg border transition cursor-pointer space-y-1.5 ${activeBenchmark === "USDT_BINANCE" ? "bg-blue-50 border-blue-200 text-[var(--primary)]" : "bg-[var(--surface-alt)] border-[var(--border)] hover:bg-white"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center space-x-1.5"><Wallet className="w-3.5 h-3.5 text-[var(--primary)]" /><span>3. Binance USDT (P2P)</span></span>
                    {activeBenchmark === "USDT_BINANCE" && <Check className="w-4 h-4 text-[var(--primary)]" />}
                  </div>
                  <div className="flex items-center justify-between font-mono"><span className="text-sm font-black">Bs. {usdtRate.toFixed(2)}</span></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center bg-[var(--surface-alt)] p-0.5 rounded-lg">
            <button onClick={() => setTheme("light")} className={`p-1.5 rounded-md transition ${!isDark ? "bg-white text-[var(--text)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`} title="Modo Claro"><Sun className="w-3.5 h-3.5" /></button>
            <button onClick={() => setTheme("dark")} className={`p-1.5 rounded-md transition ${isDark ? "bg-[var(--primary)] text-white shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`} title="Modo Oscuro"><Moon className="w-3.5 h-3.5" /></button>
          </div>

          <button onClick={onSwitchToAdmin} className="bg-[var(--primary)] hover:bg-[var(--primary-strong)] text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shadow-soft">
            <Building2 className="w-3.5 h-3.5" />
            <span>Volver a Financiadora</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-[var(--border)]"}`}>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-[var(--text-muted)]">Consultar Contrato por Cédula:</span>
            <input value={docIdInput} onChange={e => setDocIdInput(e.target.value)} placeholder="Ej. V-18.942.301" className={`px-3 py-1.5 rounded-lg border font-mono font-bold focus:outline-none ${isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-[var(--surface-alt)] border-[var(--border)] text-[var(--text)]"}`} />
            <button onClick={() => handleLogin(docIdInput)} className="bg-[var(--primary)] hover:bg-[var(--primary-strong)] text-white px-3 py-1.5 rounded-lg font-semibold transition">Consultar</button>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-[var(--text-muted)] text-[11px]">Cargar Demo:</span>
            {[
              { label: "José Gregorio (Al Día)", doc: "V-18.942.301" },
              { label: "Carlos Pérez (Mora 2m)", doc: "V-14.890.112" },
              { label: "María Elena (Acumulando)", doc: "V-22.109.843" }
            ].map(d => (
              <button key={d.doc} onClick={() => { setDocIdInput(d.doc); handleLogin(d.doc); }} className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition ${activeContract?.clientDocId === d.doc ? "bg-blue-50 border-blue-200 text-[var(--primary)] font-bold" : isDark ? "border-zinc-800 hover:bg-zinc-800 text-zinc-400" : "border-[var(--border)] hover:bg-[var(--surface-alt)] text-[var(--text-muted)]"}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {activeContract ? (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-5 shadow-card ${isDark ? "bg-zinc-900/40 border-zinc-850" : "bg-white border-[var(--border)]"}`}>
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-[var(--surface-alt)] text-[var(--text)] font-mono font-black text-sm px-3 py-1 rounded-lg border border-[var(--border)]">N° CONTRATO: {activeContract.contractNumber}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${activeContract.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                      ● {activeContract.status}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-[var(--text)] mt-2">{activeContract.clientName}</h2>
                  <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">CI: <strong>{activeContract.clientDocId}</strong> • Teléfono: <strong>{activeContract.clientPhone}</strong></p>
                </div>

                <div className="flex flex-wrap gap-3 text-xs">
                  <div className={`p-3 rounded-xl border min-w-[200px] ${isDark ? "bg-zinc-950 border-zinc-850" : "bg-[var(--surface-alt)] border-[var(--border)]"}`}>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">FIADOR / AVAL SOLIDARIO:</span>
                    <p className="font-bold text-[var(--text)] mt-0.5">{activeContract.guarantor?.name || "Sin fiador registrado"}</p>
                    <p className="text-[var(--text-muted)] font-mono text-[11px]">CI: {activeContract.guarantor?.docId || "N/A"}</p>
                  </div>

                  <div className={`p-3 rounded-xl border min-w-[200px] ${isDark ? "bg-zinc-950 border-zinc-850" : "bg-[var(--surface-alt)] border-[var(--border)]"}`}>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">VEHÍCULO ADQUIRIDO:</span>
                    <p className="font-bold text-[var(--primary)] mt-0.5">{activeContract.vehicle?.brand} {activeContract.vehicle?.model}</p>
                    <p className="text-[var(--text-muted)] font-mono text-[11px]">Año {activeContract.vehicle?.year} • Color: {activeContract.vehicle?.color}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className={`p-3.5 rounded-xl border ${isDark ? "bg-zinc-950 border-zinc-850" : "bg-[var(--surface-alt)] border-[var(--border)]"}`}><span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">SALDO REMANENTE</span><p className="text-base font-black font-mono text-[var(--text)] mt-0.5">{"$" + activeContract.totalOutstandingUSD + " USD"}</p><span className="text-[10px] text-[var(--text-muted)] font-mono block">≈ {BcvEngine.formatVes(BcvEngine.convertUsdToVes(activeContract.totalOutstandingUSD, activeRateValue))}</span></div>
                <div className={`p-3.5 rounded-xl border ${isDark ? "bg-zinc-950 border-zinc-850" : "bg-[var(--surface-alt)] border-[var(--border)]"}`}><span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">TOTAL PAGADO</span><p className="text-base font-black font-mono text-emerald-500 mt-0.5">{"$" + activeContract.totalPaidUSD + " USD"}</p><span className="text-[10px] text-[var(--text-muted)] font-mono block">≈ {BcvEngine.formatVes(BcvEngine.convertUsdToVes(activeContract.totalPaidUSD, activeRateValue))}</span></div>
                <div className={`p-3.5 rounded-xl border ${isDark ? "bg-zinc-950 border-zinc-850" : "bg-[var(--surface-alt)] border-[var(--border)]"}`}><span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">PRECIO EMPRESA</span><p className="text-base font-black font-mono text-[var(--text)] mt-0.5">{"$" + activeContract.companyPriceUSD + " USD"}</p><span className="text-[10px] text-[var(--text-muted)]">Retail financiado</span></div>
                <div className={`p-3.5 rounded-xl border ${isDark ? "bg-zinc-950 border-zinc-850" : "bg-[var(--surface-alt)] border-[var(--border)]"}`}><span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">MORAS ACTIVAS</span><p className="text-sm font-bold font-mono text-amber-500 mt-0.5">{"$" + (activeContract.lateFeesPendingUSD || 0) + " USD"}</p><span className="text-[10px] text-[var(--text-muted)]">Pagadas: {"$" + (activeContract.lateFeesPaidUSD || 0)}</span></div>
                <div className={`p-3.5 rounded-xl border ${isDark ? "bg-zinc-950 border-zinc-850" : "bg-[var(--surface-alt)] border-[var(--border)]"}`}><span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">IVA & IGTF</span><p className="text-xs font-mono text-[var(--text)] mt-0.5">IVA Pagado: {"$" + (activeContract.ivaPaidUSD || 0)}</p><span className="text-[10px] text-blue-500 font-mono block">IGTF 3%: {"$" + (activeContract.igtfPaidUSD || 0) + " USD"}</span></div>
                <div className={`p-3.5 rounded-xl border ${isDark ? "bg-zinc-950 border-zinc-850" : "bg-[var(--surface-alt)] border-[var(--border)]"}`}><span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">CUOTAS & AVANCE</span><p className="text-sm font-black font-mono text-purple-500 mt-0.5">{activeContract.quotasPaidCount} / {activeContract.totalQuotas} ({activeContract.quotasPaidPercent}%)</p><div className="w-full bg-zinc-200 h-1.5 rounded-full mt-1.5 overflow-hidden"><div className="bg-[var(--primary)] h-full rounded-full" style={{ width: activeContract.overallProgressPercent + "%" }} /></div></div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
