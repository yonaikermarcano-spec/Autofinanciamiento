"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { toast } from "./common/GoogleSnackbar";

export default function ClientPortal({ onSwitchToAdmin }: { onSwitchToAdmin: () => void }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [docIdInput, setDocIdInput] = useState("V-18.942.301");
  const [contractsList, setContractsList] = useState<LoanContract[]>(LocalDB.getAllContracts());
  const [activeContract, setActiveContract] = useState<LoanContract | null>(
    LocalDB.getContractByDocId("V-18.942.301") || contractsList[0] || null
  );

  useEffect(() => {
    const saved = localStorage.getItem("autolending_theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      if (saved === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    }
    const handleSync = (e: any) => {
      if (e.detail && (e.detail === "light" || e.detail === "dark")) {
        setTheme(e.detail);
      }
    };
    window.addEventListener("autolending_theme_sync", handleSync);
    return () => window.removeEventListener("autolending_theme_sync", handleSync);
  }, []);

  const handleSetTheme = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    localStorage.setItem("autolending_theme", newTheme);
    if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    window.dispatchEvent(new CustomEvent("autolending_theme_sync", { detail: newTheme }));
  };

  const [activePortalTab, setActivePortalTab] = useState<"SCHEDULE" | "PAY_REPORT" | "DOCS" | "SUPPORT" | "NOTIFS">("SCHEDULE");
  const [quotaFilter, setQuotaFilter] = useState<"ALL" | "PENDING" | "PAID">("ALL");

  // Motor Multimoneda (3 Opciones: Dólar BCV, Euro BCV, Binance USDT)
  const [activeBenchmark, setActiveBenchmark] = useState<CurrencyBenchmark>(() => BcvEngine.getRates().activeBenchmark);
  const [usdRate, setUsdRate] = useState<number>(() => BcvEngine.getRates().usdRate);
  const [eurRate, setEurRate] = useState<number>(() => BcvEngine.getRates().eurRate);
  const [usdtRate, setUsdtRate] = useState<number>(() => BcvEngine.getRates().usdtRate);
  const [lastRateSync, setLastRateSync] = useState<string>(() => BcvEngine.getRates().lastUpdated || "En vivo");
  const [isSyncingRates, setIsSyncingRates] = useState<boolean>(false);
  const [isRateMenuOpen, setIsRateMenuOpen] = useState(false);
  const rateMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = async () => {
      setIsSyncingRates(true);
      try {
        const live = await BcvEngine.syncLiveRates();
        setUsdRate(live.usdRate);
        setEurRate(live.eurRate);
        setUsdtRate(live.usdtRate);
        if (live.lastUpdated) setLastRateSync(live.lastUpdated);
      } catch (e) {
        console.error("Error sincronizando tasas en ClientPortal:", e);
      } finally {
        setIsSyncingRates(false);
      }
    };

    sync();
    const interval = setInterval(sync, 180000);

    const handleRatesUpdated = (e: any) => {
      const detail = e.detail;
      if (detail) {
        if (detail.usdRate) setUsdRate(detail.usdRate);
        if (detail.eurRate) setEurRate(detail.eurRate);
        if (detail.usdtRate) setUsdtRate(detail.usdtRate);
        if (detail.lastUpdated) setLastRateSync(detail.lastUpdated);
      }
    };

    window.addEventListener("bcv_rates_updated", handleRatesUpdated);
    return () => {
      clearInterval(interval);
      window.removeEventListener("bcv_rates_updated", handleRatesUpdated);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsRateMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (isRateMenuOpen && rateMenuRef.current && !rateMenuRef.current.contains(target)) {
        setIsRateMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isRateMenuOpen]);

  const activeRateValue = activeBenchmark === "EUR_BCV" ? eurRate : activeBenchmark === "USDT_BINANCE" ? usdtRate : usdRate;
  const bcvRate = activeRateValue;
  const tenantProfile = TenantOnboardingEngine.getProfile();

  // Estado Modal Reportar Pago
  const [payAmountUSD, setPayAmountUSD] = useState<number>(50);
  const [payMethod, setPayMethod] = useState<"PAGO_MOVIL" | "BINANCE_USDT" | "CASH_USD">("PAGO_MOVIL");
  const [payReference, setPayReference] = useState("PM-9901824");
  const [recentPaymentReceipt, setRecentPaymentReceipt] = useState<any>(null);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  // Estado Modal de Impresión PDF
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printDocType, setPrintDocType] = useState<DocType>("CONTRACT");
  const [printReceiptData, setPrintReceiptData] = useState<any>(null);

  // Calculadora Trade-In para el Cliente
  const [tradeInAppraisalUSD, setTradeInAppraisalUSD] = useState<number>(900);
  const [tradeInTargetBikeUSD, setTradeInTargetBikeUSD] = useState<number>(1800);

  // Ticket de soporte
  const [supportSubject, setSupportSubject] = useState("Consulta de Placas INTT");
  const [supportMessage, setSupportMessage] = useState("");
  const [ticketCreatedSuccess, setTicketCreatedSuccess] = useState<string | null>(null);
  
  // Cashea-Style Mobile Payment States
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
  
  // Estado Agendamiento de Taller por el Cliente
  const [clientOdometerInput, setClientOdometerInput] = useState<number>(480);
  const [clientSelectedMilestoneKm, setClientSelectedMilestoneKm] = useState<number>(500);
  const [clientSelectedWorkshop, setClientSelectedWorkshop] = useState<string>("Taller Central AutoLending Catia");
  const [clientAppointmentDate, setClientAppointmentDate] = useState<string>("2026-08-28 09:00");
  const [clientAppointmentSuccess, setClientAppointmentSuccess] = useState<string | null>(null);
  
  // Estado Servicios Aliados Cliente (RCV / Médico)
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
      toast.success(`Contrato cargado: ${contract.contractNumber} (${contract.clientName})`);
    } else {
      toast.error("No se encontró ningún financiamiento asociado a la Cédula/Contrato: " + docId);
    }
  };

  const handleProcessClientPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContract) return;

    const targetQuota = activeContract.schedule?.find(q => q.status === "PENDING" || q.status === "PARTIALLY_PAID" || q.status === "OVERDUE");
    if (!targetQuota) {
      toast.info("¡Felicitaciones! Todas las cuotas de este financiamiento ya han sido canceladas en su totalidad.");
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
      toast.success("¡Abono registrado con éxito! Recibo: " + result.receiptCode);
    } catch (err: any) {
      toast.error("Error reportando pago: " + err.message);
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
    const msg = "¡Solicitud #" + created.id + " registrada! Preséntate el " + clientPickupDate + " en oficina para el pago y retiro.";
    setClientAlliedSuccessMessage(msg);
    toast.success(msg);
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

    const msg = "¡Cita de Mantenimiento confirmada exitosamente para el " + clientAppointmentDate + " en " + clientSelectedWorkshop + "!";
    setClientAppointmentSuccess(msg);
    toast.success(msg);
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

    const msg = "Ticket #" + ticket.ticketId + " creado exitosamente. Asesor responderá vía WhatsApp.";
    setTicketCreatedSuccess(msg);
    toast.success(msg);
    setSupportMessage("");
  };

  const tradeInResult = activeContract ? AtcTicketsModule.calculateTradeInUpgrade({
    currentContract: activeContract,
    currentVehicleAppraisedValueUSD: tradeInAppraisalUSD,
    targetNewVehiclePriceUSD: tradeInTargetBikeUSD,
    downPaymentRequiredPercent: 30
  }) : null;

  // Filtrado de cuotas
  const filteredSchedule = (activeContract?.schedule || []).filter(q => {
    if (quotaFilter === "PENDING") return q.status === "PENDING" || q.status === "PARTIALLY_PAID" || q.status === "OVERDUE";
    if (quotaFilter === "PAID") return q.status === "PAID";
    return true;
  });

  return (
    <div className={(isDark ? "dark bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900") + " min-h-screen flex flex-col antialiased"}>
      
      {/* HEADER SUPERIOR LIMPIO */}
      <header className={"border-b px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 backdrop-blur-md " + (
        isDark ? "bg-zinc-950/90 border-zinc-850" : "bg-white/90 border-zinc-200"
      )}>
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm shadow-sm">
            {tenantProfile.commercialName.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                {tenantProfile.commercialName}
              </h1>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.2 rounded-full font-mono font-medium">
                Portal del Cliente
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">Autoservicio Digital • VE</p>
          </div>
        </div>

        {/* Centro/Derecha: Selector 3 Tasas & Toggle Apariencia */}
        <div className="flex items-center space-x-3 text-xs">
          
          {/* SELECTOR INTERACTIVO DE 3 TASAS */}
          <div className="relative" ref={rateMenuRef}>
            <button
              onClick={() => setIsRateMenuOpen(!isRateMenuOpen)}
              className={"flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition cursor-pointer " + (
                isDark 
                  ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700" 
                  : "bg-zinc-100 border-zinc-200 text-zinc-800 hover:border-zinc-300"
              )}
            >
              <Coins className="w-3.5 h-3.5 text-emerald-500" />
                <span className="truncate max-w-[42vw] sm:max-w-none">
                {activeBenchmark === "USD_BCV" && "Dólar BCV: Bs. " + usdRate.toFixed(2)}
                {activeBenchmark === "EUR_BCV" && "Euro BCV: Bs. " + eurRate.toFixed(2)}
                {activeBenchmark === "USDT_BINANCE" && "Binance USDT: Bs. " + usdtRate.toFixed(2)}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-600 dark:text-zinc-400" />
            </button>

            {/* DROPDOWN DE LAS 3 TASAS */}
            {isRateMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent" 
                  onClick={(e) => { e.stopPropagation(); setIsRateMenuOpen(false); }} 
                />
                <div className={"absolute right-0 top-11 w-72 rounded-xl p-2.5 shadow-2xl border text-xs space-y-2 z-50 animate-in fade-in zoom-in-95 duration-150 " + (
                isDark ? "bg-zinc-900 border-zinc-800 text-zinc-200" : "bg-white border-zinc-200 text-zinc-900"
              )}>
                <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[11px] uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block">
                      Tasas de Cambio en Vivo
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      Act.: {lastRateSync}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      En Vivo
                    </span>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        setIsSyncingRates(true);
                        const live = await BcvEngine.syncLiveRates();
                        setUsdRate(live.usdRate);
                        setEurRate(live.eurRate);
                        setUsdtRate(live.usdtRate);
                        if (live.lastUpdated) setLastRateSync(live.lastUpdated);
                        setIsSyncingRates(false);
                      }}
                      disabled={isSyncingRates}
                      title="Actualizar tasas ahora"
                      className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingRates ? "animate-spin text-emerald-600" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* 1. DÓLAR BCV */}
                <div 
                  onClick={() => { setActiveBenchmark("USD_BCV"); BcvEngine.setActiveBenchmark("USD_BCV"); setIsRateMenuOpen(false); }}
                  className={"p-2.5 rounded-lg border transition cursor-pointer space-y-1 " + (
                    activeBenchmark === "USD_BCV"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-600 dark:text-emerald-200 shadow-xs"
                      : isDark ? "bg-zinc-950 border-zinc-850 hover:bg-zinc-850 text-zinc-300" : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-800"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center space-x-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>1. Dólar BCV Oficial ($)</span>
                    </span>
                    {activeBenchmark === "USD_BCV" && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">Bs. {usdRate.toFixed(2)}</span>
                    <span className="text-[10px] text-zinc-500 font-sans">Banco Central (Oficial)</span>
                  </div>
                </div>

                {/* 2. EURO BCV */}
                <div 
                  onClick={() => { setActiveBenchmark("EUR_BCV"); BcvEngine.setActiveBenchmark("EUR_BCV"); setIsRateMenuOpen(false); }}
                  className={"p-2.5 rounded-lg border transition cursor-pointer space-y-1 " + (
                    activeBenchmark === "EUR_BCV"
                      ? "bg-blue-50 border-blue-300 text-blue-950 dark:bg-blue-950/40 dark:border-blue-600 dark:text-blue-200 shadow-xs"
                      : isDark ? "bg-zinc-950 border-zinc-850 hover:bg-zinc-850 text-zinc-300" : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-800"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center space-x-1.5">
                      <Coins className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>2. Euro BCV Oficial (€)</span>
                    </span>
                    {activeBenchmark === "EUR_BCV" && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">Bs. {eurRate.toFixed(2)}</span>
                    <span className="text-[10px] text-zinc-500 font-sans">Banco Central (Oficial)</span>
                  </div>
                </div>

                {/* 3. BINANCE USDT */}
                <div 
                  onClick={() => { setActiveBenchmark("USDT_BINANCE"); BcvEngine.setActiveBenchmark("USDT_BINANCE"); setIsRateMenuOpen(false); }}
                  className={"p-2.5 rounded-lg border transition cursor-pointer space-y-1 " + (
                    activeBenchmark === "USDT_BINANCE"
                      ? "bg-amber-50 border-amber-300 text-amber-950 dark:bg-amber-950/40 dark:border-amber-600 dark:text-amber-200 shadow-xs"
                      : isDark ? "bg-zinc-950 border-zinc-850 hover:bg-zinc-850 text-zinc-300" : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-800"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center space-x-1.5">
                      <Wallet className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>3. Binance USDT (P2P)</span>
                    </span>
                    {activeBenchmark === "USDT_BINANCE" && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">Bs. {usdtRate.toFixed(2)}</span>
                    <span className="text-[10px] text-zinc-500 font-sans">Binance P2P / Mercado</span>
                  </div>
                </div>

              </div>
              </>
            )}
          </div>

          {/* Toggle Light / Dark */}
          <div className="flex items-center bg-slate-100 dark:bg-zinc-850 p-1 rounded-full border border-slate-200 dark:border-zinc-750">
            <button
              onClick={() => handleSetTheme("light")}
              className={"p-1.5 rounded-full transition-all " + (!isDark ? "bg-white text-google-blue-600 shadow-xs" : "text-zinc-400 hover:text-white")}
              title="Modo Claro"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleSetTheme("dark")}
              className={"p-1.5 rounded-full transition-all " + (isDark ? "bg-zinc-900 text-google-blue-400 shadow-xs" : "text-zinc-600 hover:text-zinc-900")}
              title="Modo Oscuro"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Switch a Financiadora */}
          <button
            onClick={onSwitchToAdmin}
            className="bg-google-blue-600 hover:bg-google-blue-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95"
          >
            <Building2 className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline font-medium">Volver a Financiadora</span>
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-5 sm:space-y-6 pb-24">
        
        {/* BARRA DE LOGIN / DEMOSTRACIÓN RÁPIDA DE CLIENTES */}
        <div className={"p-3.5 sm:p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs " + (
          isDark ? "bg-surface-dark-container border-zinc-800" : "bg-surface-light-container border-slate-200/90 shadow-xs"
        )}>
          <div className="flex flex-wrap items-center gap-2">
            <UserCheck className="w-4 h-4 text-google-blue-500" />
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Consultar por Cédula:</span>
            <input 
              type="text"
              value={docIdInput}
              onChange={e => setDocIdInput(e.target.value)}
              placeholder="Ej. V-18.942.301"
              className={"px-3.5 py-1.5 rounded-full border font-mono font-bold text-xs focus:outline-none focus:ring-2 focus:ring-google-blue-500/40 " + (
                isDark ? "bg-zinc-900 border-zinc-750 text-white placeholder-zinc-500" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              )}
            />
            <button
              onClick={() => handleLogin(docIdInput)}
              className="bg-google-blue-600 hover:bg-google-blue-700 text-white px-4 py-1.5 rounded-full font-medium transition cursor-pointer shadow-xs active:scale-95"
            >
              Consultar
            </button>
          </div>

          {/* Demos Rápidos */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-zinc-600 dark:text-zinc-400 text-[11px] font-medium">Demos:</span>
            {[
              { label: "José Gregorio (Al Día)", doc: "V-18.942.301" },
              { label: "Carlos Pérez (Mora 2m)", doc: "V-14.890.112" },
              { label: "María Elena (Acumulando)", doc: "V-22.109.843" }
            ].map(d => (
              <button
                key={d.doc}
                onClick={() => { setDocIdInput(d.doc); handleLogin(d.doc); }}
                className={"px-3 py-1 rounded-full border text-[11px] font-medium transition cursor-pointer " + (
                  activeContract?.clientDocId === d.doc
                    ? "bg-google-blue-50 dark:bg-google-blue-900/30 border-google-blue-400/50 text-google-blue-700 dark:text-google-blue-300 font-semibold"
                    : isDark ? "border-zinc-800 hover:bg-zinc-800/80 text-zinc-300" : "border-slate-200 hover:bg-slate-100 text-slate-700"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {activeContract ? (
          <div className="space-y-6">
            
            {/* 1. TARJETA PRINCIPAL DEL CLIENTE & ESTADO DE CUENTA (360° GOOGLE WALLET STYLE) */}
            <div className={"p-6 sm:p-7 rounded-3xl border space-y-6 shadow-sm " + (
              isDark ? "bg-surface-dark-container border-zinc-800" : "bg-white border-slate-200/90"
            )}>
              
              {/* Encabezado */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 font-mono font-bold text-xs px-3 py-1 rounded-full border border-slate-200 dark:border-zinc-700">
                      N° CONTRATO: {activeContract.contractNumber}
                    </span>
                    <span className={"text-xs px-3 py-0.5 rounded-full font-semibold border " + (
                      activeContract.status === "ACTIVE" 
                        ? "bg-google-green-50 text-google-green-700 dark:bg-google-green-950/40 dark:text-google-green-400 border-google-green-200 dark:border-google-green-800" 
                        : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800"
                    )}>
                      ● {activeContract.status}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-2.5">
                    {activeContract.clientName}
                  </h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono mt-1">
                    CI: <strong className="text-slate-800 dark:text-zinc-200">{activeContract.clientDocId}</strong> • Teléfono: <strong className="text-slate-800 dark:text-zinc-200">{activeContract.clientPhone}</strong> • {activeContract.clientAddress}
                  </p>
                </div>

                {/* Fiador & Vehículo */}
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className={"p-3.5 rounded-2xl border min-w-[200px] " + (
                    isDark ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-200"
                  )}>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold tracking-wider block">FIADOR / AVAL SOLIDARIO</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-1">{activeContract.guarantor?.name || "Sin fiador registrado"}</p>
                    <p className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px] mt-0.5">CI: {activeContract.guarantor?.docId || "N/A"}</p>
                    <p className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">Tlf: {activeContract.guarantor?.phone || "N/A"}</p>
                  </div>

                  <div className={"p-3.5 rounded-2xl border min-w-[200px] " + (
                    isDark ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-200"
                  )}>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold tracking-wider block">VEHÍCULO ADQUIRIDO</span>
                    <p className="font-bold text-google-green-600 dark:text-google-green-400 mt-1">{activeContract.vehicle?.brand} {activeContract.vehicle?.model}</p>
                    <p className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px] mt-0.5">Año {activeContract.vehicle?.year} • Color: {activeContract.vehicle?.color}</p>
                    <p className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">Placa: {activeContract.vehicle?.plate || "En trámite INTT"}</p>
                  </div>
                </div>
              </div>

              {/* Grid Contable & Precios - Google M3 Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                
                <div className={"p-4 rounded-2xl border transition-all hover:shadow-xs " + (isDark ? "bg-zinc-950/70 border-zinc-800" : "bg-slate-50/70 border-slate-200")}>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold tracking-wider block">SALDO REMANENTE</span>
                  <p className="text-base font-black font-mono text-slate-900 dark:text-white mt-1">
                    {"$" + activeContract.totalOutstandingUSD + " USD"}
                  </p>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono block mt-0.5">
                    ≈ {BcvEngine.formatVes(BcvEngine.convertUsdToVes(activeContract.totalOutstandingUSD, activeRateValue))}
                  </span>
                </div>

                <div className={"p-4 rounded-2xl border transition-all hover:shadow-xs " + (isDark ? "bg-zinc-950/70 border-zinc-800" : "bg-slate-50/70 border-slate-200")}>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold tracking-wider block">TOTAL PAGADO</span>
                  <p className="text-base font-black font-mono text-google-green-600 dark:text-google-green-400 mt-1">
                    {"$" + activeContract.totalPaidUSD + " USD"}
                  </p>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono block mt-0.5">
                    ≈ {BcvEngine.formatVes(BcvEngine.convertUsdToVes(activeContract.totalPaidUSD, activeRateValue))}
                  </span>
                </div>

                <div className={"p-4 rounded-2xl border transition-all hover:shadow-xs " + (isDark ? "bg-zinc-950/70 border-zinc-800" : "bg-slate-50/70 border-slate-200")}>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold tracking-wider block">PRECIO EMPRESA</span>
                  <p className="text-base font-black font-mono text-slate-900 dark:text-white mt-1">
                    {"$" + activeContract.companyPriceUSD + " USD"}
                  </p>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block mt-0.5">Retail financiado</span>
                </div>

                <div className={"p-4 rounded-2xl border transition-all hover:shadow-xs " + (isDark ? "bg-zinc-950/70 border-zinc-800" : "bg-slate-50/70 border-slate-200")}>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold tracking-wider block">MORAS ACTIVAS</span>
                  <p className="text-sm font-bold font-mono text-amber-500 mt-1">
                    {"$" + (activeContract.lateFeesPendingUSD || 0) + " USD"}
                  </p>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block mt-0.5">Pagadas: {"$" + (activeContract.lateFeesPaidUSD || 0)}</span>
                </div>

                <div className={"p-4 rounded-2xl border transition-all hover:shadow-xs " + (isDark ? "bg-zinc-950/70 border-zinc-800" : "bg-slate-50/70 border-slate-200")}>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold tracking-wider block">IVA & IGTF</span>
                  <p className="text-xs font-mono text-slate-700 dark:text-zinc-300 mt-1">
                    IVA Pagado: {"$" + (activeContract.ivaPaidUSD || 0)}
                  </p>
                  <span className="text-[10px] text-google-blue-500 font-mono block mt-0.5">
                    IGTF 3%: {"$" + (activeContract.igtfPaidUSD || 0) + " USD"}
                  </span>
                </div>

                <div className={"p-4 rounded-2xl border transition-all hover:shadow-xs " + (isDark ? "bg-zinc-950/70 border-zinc-800" : "bg-slate-50/70 border-slate-200")}>
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold tracking-wider block">CUOTAS & AVANCE</span>
                  <p className="text-sm font-black font-mono text-purple-600 dark:text-purple-400 mt-1">
                    {activeContract.quotasPaidCount} / {activeContract.totalQuotas} ({activeContract.quotasPaidPercent}%)
                  </p>
                  <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: activeContract.overallProgressPercent + "%" }} />
                  </div>
                </div>

              </div>

              {/* Tira de los 5 Estatus Operativos */}
              <div className={"p-4 rounded-2xl border space-y-2.5 " + (
                isDark ? "bg-zinc-950/50 border-zinc-800" : "bg-slate-50/60 border-slate-200"
              )}>
                <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
                  Trazabilidad de Estatus Operativos de tu Financiamiento:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
                  
                  <div className={"p-3 rounded-xl border " + (isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200 shadow-xs")}>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block">1. Entrega Unidad:</span>
                    <strong className="text-google-green-600 dark:text-google-green-400 font-mono mt-0.5 block">{activeContract.deliveryStatus}</strong>
                  </div>

                  <div className={"p-3 rounded-xl border " + (isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200 shadow-xs")}>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block">2. Reembolso:</span>
                    <strong className="text-slate-700 dark:text-zinc-300 font-mono mt-0.5 block">{activeContract.refundStatus}</strong>
                  </div>

                  <div className={"p-3 rounded-xl border " + (isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200 shadow-xs")}>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block">3. Documentos:</span>
                    <strong className="text-google-blue-600 dark:text-google-blue-400 font-mono mt-0.5 block">{activeContract.documentsStatus}</strong>
                  </div>

                  <div className={"p-3 rounded-xl border " + (isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200 shadow-xs")}>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block">4. Factura Física:</span>
                    <strong className="text-amber-500 font-mono mt-0.5 block">{activeContract.physicalInvoiceStatus}</strong>
                  </div>

                  <div className={"p-3 rounded-xl border " + (isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200 shadow-xs")}>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block">5. Trámite INTT:</span>
                    <strong className="text-purple-600 dark:text-purple-400 font-mono mt-0.5 block">{activeContract.vehicleRegistrationStatus}</strong>
                  </div>

                </div>
              </div>

            </div>

            {/* 2. PESTAÑAS DE AUTOSERVICIO DEL CLIENTE */}
            <div className="space-y-4">
              
              <div className="p-1.5 bg-slate-100 dark:bg-zinc-900/80 rounded-2xl sm:rounded-full border border-slate-200/90 dark:border-zinc-800 flex flex-wrap gap-1 text-xs">
                {[
                  { id: "SCHEDULE", label: "Cronograma de Cuotas", icon: Calendar },
                  { id: "PAY_REPORT", label: "Reportar Abono / Pago", icon: CreditCard },
                  { id: "DOCS", label: "Descargar Documentos (PDF)", icon: FileText },
                  { id: "SUPPORT", label: "Trade-in Upgrade & Soporte", icon: HelpCircle },
                  { id: "NOTIFS", label: "Buzón de Avisos", icon: Bell }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activePortalTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActivePortalTab(tab.id as any)}
                      className={"px-4 py-2 rounded-xl sm:rounded-full font-medium transition-all cursor-pointer flex items-center space-x-2 " + (
                        isActive 
                          ? "bg-white dark:bg-zinc-800 text-google-blue-700 dark:text-google-blue-300 shadow-xs border border-slate-200 dark:border-zinc-700 font-semibold"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-zinc-800/50"
                      )}
                    >
                      <Icon className={"w-3.5 h-3.5 " + (isActive ? "text-google-blue-600 dark:text-google-blue-400" : "text-zinc-400")} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* PESTAÑA A: CRONOGRAMA */}
              {activePortalTab === "SCHEDULE" && (
                <div className="space-y-4">
                  
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-1 text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400 text-[11px] mr-2">Filtrar:</span>
                      {[
                        { id: "ALL", label: "Todas las Cuotas" },
                        { id: "PENDING", label: "Pendientes / En Mora" },
                        { id: "PAID", label: "Pagadas" }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setQuotaFilter(f.id as any)}
                          className={"px-2.5 py-1 rounded-md text-xs transition cursor-pointer " + (
                            quotaFilter === f.id 
                              ? "bg-zinc-800 text-white font-bold" 
                              : "text-zinc-400 hover:text-white"
                          )}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openPrint("SCHEDULE_PLAN")}
                        className={"px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 " + (
                          isDark ? "border-zinc-800 hover:bg-zinc-850 text-zinc-200" : "border-zinc-200 hover:bg-zinc-100 text-zinc-800"
                        )}
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                        <span>Imprimir Cronograma (PDF)</span>
                      </button>

                      <button
                        onClick={() => setActivePortalTab("PAY_REPORT")}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>+ Reportar Pago Ahora</span>
                      </button>
                    </div>
                  </div>

                  {/* Lista de Cuotas */}
                  <div className={"rounded-xl border overflow-x-auto " + (
                    isDark ? "bg-zinc-900/40 border-zinc-850" : "bg-white border-zinc-200"
                  )}>
                    <table className="min-w-[42rem] w-full text-left text-xs">
                      <thead className={"border-b text-[11px] font-semibold uppercase tracking-wider " + (
                        isDark ? "bg-zinc-900/80 border-zinc-850 text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-600 dark:text-zinc-400"
                      )}>
                        <tr>
                          <th className="p-3.5">N° Cuota</th>
                          <th className="p-3.5">Fecha Vencimiento</th>
                          <th className="p-3.5">Capital</th>
                          <th className="p-3.5">Interés + IVA</th>
                          <th className="p-3.5">Total Cuota ($ USD)</th>
                          <th className="p-3.5">Equivalente Tasa</th>
                          <th className="p-3.5">Estado</th>
                          <th className="p-3.5 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className={"divide-y " + (isDark ? "divide-zinc-850" : "divide-zinc-100")}>
                        {filteredSchedule.map(q => (
                          <tr key={q.quotaNumber} className="hover:bg-zinc-850/30 transition">
                            <td className="p-3.5 font-bold font-mono text-zinc-900 dark:text-zinc-100">
                              {"Cuota #" + q.quotaNumber}
                            </td>
                            <td className="p-3.5 text-zinc-600 dark:text-zinc-400 font-mono">
                              {q.dueDate}
                            </td>
                            <td className="p-3.5 font-mono text-slate-800 dark:text-zinc-200">
                              {"$" + q.capitalUSD + " USD"}
                            </td>
                            <td className="p-3.5 font-mono text-zinc-600 dark:text-zinc-400">
                              {"$" + q.interestUSD + " + $" + q.ivaUSD + " (IVA)"}
                            </td>
                            <td className="p-3.5 font-bold font-mono text-emerald-500 text-sm">
                              {"$" + q.totalQuotaUSD + " USD"}
                            </td>
                            <td className="p-3.5 font-mono text-zinc-600 dark:text-zinc-400">
                              {BcvEngine.formatVes(BcvEngine.convertUsdToVes(q.totalQuotaUSD, activeRateValue))}
                            </td>
                            <td className="p-3.5">
                              <span className={"text-[11px] px-2.5 py-0.5 rounded-full font-medium inline-flex items-center space-x-1 " + (
                                q.status === "PAID" 
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                  : q.status === "PARTIALLY_PAID"
                                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                                  : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                              )}>
                                <span>●</span>
                                <span>{q.status === "PAID" ? "PAGADO" : q.status === "PARTIALLY_PAID" ? ("Abono: $" + q.paidAmountUSD) : "PENDIENTE"}</span>
                              </span>
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap">
                              {q.status !== "PAID" ? (
                                <button
                                  onClick={() => {
                                    setPayAmountUSD(q.remainingAmountUSD || q.totalQuotaUSD);
                                    setActivePortalTab("PAY_REPORT");
                                  }}
                                  className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition cursor-pointer"
                                >
                                  Pagar Cuota →
                                </button>
                              ) : (
                                <button
                                  onClick={() => openPrint("RECEIPT", {
                                    receiptCode: q.receiptNumber || ("REC-" + activeContract.contractNumber + "-Q" + q.quotaNumber),
                                    amountUSD: q.paidAmountUSD || q.totalQuotaUSD,
                                    paymentMethod: q.paymentMethod || "PAGO_MOVIL"
                                  })}
                                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-400 font-medium text-[11px] inline-flex items-center space-x-1"
                                >
                                  <Receipt className="w-3 h-3" />
                                  <span>Ver Recibo</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* PESTAÑA B: REPORTAR PAGO */}
              {activePortalTab === "PAY_REPORT" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  <form onSubmit={handleProcessClientPayment} className={"lg:col-span-7 p-6 rounded-xl border space-y-4 shadow-sm " + (
                    isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200"
                  )}>
                    <div className="border-b border-zinc-200 dark:border-zinc-850 pb-3">
                      <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-emerald-500" />
                        <span>Formulario para Reportar Abono o Pago</span>
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Ingresa los datos de tu transferencia para emitir tu recibo oficial</p>
                    </div>

                    {paymentSuccessMessage && (
                      <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{paymentSuccessMessage}</span>
                        </div>
                        <div className="flex items-center space-x-2 pt-1">
                          <button
                            type="button"
                            onClick={() => openPrint("RECEIPT", {
                              receiptCode: recentPaymentReceipt?.receiptCode,
                              amountUSD: payAmountUSD,
                              paymentMethod: payMethod
                            })}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center space-x-1 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Imprimir Recibo PDF</span>
                          </button>

                          <a
                            href={"https://wa.me/584120000000?text=" + encodeURIComponent("Hola, acabo de reportar mi pago de $" + payAmountUSD + " USD para el Contrato #" + activeContract.contractNumber + ". Referencia: " + payReference)}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-800 hover:bg-slate-750 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center space-x-1"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Notificar WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Monto a Pagar ($ USD)</label>
                        <input 
                          type="number"
                          step="0.01"
                          required
                          value={payAmountUSD}
                          onChange={e => setPayAmountUSD(Number(e.target.value))}
                          className={"w-full p-2.5 font-mono font-bold text-base rounded-lg border focus:outline-none " + (
                            isDark ? "bg-zinc-950 border-zinc-800 text-emerald-700 dark:text-emerald-400" : "bg-zinc-50 border-zinc-200 text-emerald-600"
                          )}
                        />
                        <span className="text-[11px] text-slate-600 dark:text-zinc-400 mt-1 block font-mono">
                          Monto en Bolívares: <strong className="text-slate-900 dark:text-zinc-100 font-bold">{BcvEngine.formatVes(BcvEngine.convertUsdToVes(payAmountUSD, activeRateValue))}</strong>
                        </span>
                      </div>

                      <div>
                        <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Método de Pago</label>
                        <select
                          value={payMethod}
                          onChange={e => setPayMethod(e.target.value as any)}
                          className={"w-full p-2.5 rounded-lg border font-medium focus:outline-none cursor-pointer " + (
                            isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200"
                          )}
                        >
                          <option value="PAGO_MOVIL">Pago Móvil (Bs. Tasa Activa)</option>
                          <option value="BINANCE_USDT">Binance Pay (USDT)</option>
                          <option value="CASH_USD">Efectivo $ USD en Taquilla (+3% IGTF)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-zinc-600 dark:text-zinc-400 block mb-1">N° de Referencia Bancaria / Hash TxID</label>
                        <input 
                          type="text"
                          required
                          placeholder="Ej. PM-8819204 o Hash Binance"
                          value={payReference}
                          onChange={e => setPayReference(e.target.value)}
                          className={"w-full p-2.5 font-mono text-xs rounded-lg border focus:outline-none " + (
                            isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200"
                          )}
                        />
                      </div>
                    </div>

                    {payMethod === "CASH_USD" && (
                      <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-lg text-amber-800 dark:text-amber-300 text-xs flex justify-between items-center">
                        <span>Aplica 3% de IGTF (Ley de Grandes Transacciones en Divisas):</span>
                        <strong className="font-mono text-amber-700 dark:text-amber-400">{"+$" + (payAmountUSD * 0.03).toFixed(2) + " USD"}</strong>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-bold p-3 rounded-lg transition shadow-sm cursor-pointer text-xs flex items-center justify-center space-x-2 mt-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Registrar Reporte & Emitir Recibo Oficial</span>
                    </button>
                  </form>

                  {/* Coordenadas Bancarias */}
                  <div className={"lg:col-span-5 p-6 rounded-xl border space-y-4 " + (
                    isDark ? "bg-zinc-900/40 border-zinc-850" : "bg-white border-zinc-200"
                  )}>
                    <h4 className="font-bold text-xs uppercase text-zinc-600 dark:text-zinc-400 tracking-wider">Cuentas y Coordenadas Bancarias</h4>
                    
                    <div className={"p-3.5 rounded-lg border space-y-1.5 text-xs font-mono " + (
                      isDark ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200"
                    )}>
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-zinc-100">
                        <span>PAGO MÓVIL BANESCO</span>
                        <span className="text-emerald-600 dark:text-emerald-400">● ACTIVO</span>
                      </div>
                      <p>Banco: <strong>0134 - Banesco</strong></p>
                      <p>RIF: <strong>{tenantProfile.rif}</strong></p>
                      <p>Teléfono: <strong>0412-887-1122</strong></p>
                      <p className="text-emerald-600 dark:text-emerald-400 pt-1 font-bold">Tasa activa: Bs. {activeRateValue.toFixed(2)}</p>
                    </div>

                    <div className={"p-3.5 rounded-lg border space-y-1.5 text-xs font-mono " + (
                      isDark ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200"
                    )}>
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-zinc-100">
                        <span>BINANCE PAY (USDT)</span>
                        <span className="text-amber-600 dark:text-amber-400">● 0% COMISIÓN</span>
                      </div>
                      <p>Pay ID: <strong>89102934</strong></p>
                      <p>Email: <strong>{"pagos@" + tenantProfile.commercialName.toLowerCase().replace(/[^a-z]/g, '') + ".ve"}</strong></p>
                    </div>
                  </div>

                </div>
              )}

              {/* PESTAÑA C: DOCUMENTOS */}
              {activePortalTab === "DOCS" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={"p-5 rounded-xl border space-y-3 " + (
                    isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200"
                  )}>
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg w-fit">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Contrato de Compra-Venta con Reserva</h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Documento notariado original que rige el financiamiento.</p>
                    </div>
                    <button
                      onClick={() => openPrint("CONTRACT")}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold text-xs py-2 rounded-lg transition cursor-pointer"
                    >
                      Descargar Contrato (PDF)
                    </button>
                  </div>

                  <div className={"p-5 rounded-xl border space-y-3 " + (
                    isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200"
                  )}>
                    <div className="p-2.5 bg-purple-500/10 text-purple-500 rounded-lg w-fit">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Cronograma Oficial de Cuotas</h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Plan de pagos y amortización cuota a cuota.</p>
                    </div>
                    <button
                      onClick={() => openPrint("SCHEDULE_PLAN")}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold text-xs py-2 rounded-lg transition cursor-pointer"
                    >
                      Descargar Cronograma (PDF)
                    </button>
                  </div>

                  <div className={"p-5 rounded-xl border space-y-3 " + (
                    isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200"
                  )}>
                    <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-lg w-fit">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Descargo Legal de Trámites INTT</h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Anexo contractual de tiempos de tramitación.</p>
                    </div>
                    <button
                      onClick={() => openPrint("INTT_DISCLAIMER")}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold text-xs py-2 rounded-lg transition cursor-pointer"
                    >
                      Descargar Descargo (PDF)
                    </button>
                  </div>
                </div>
              )}

              {/* PESTAÑA E: BUZÓN DE AVISOS IN-APP */}
              {activePortalTab === "NOTIFS" && (
                <div className="space-y-4">
                  <div className={"p-5 rounded-2xl border flex items-center justify-between " + (
                    isDark ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-800 dark:text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"
                  )}>
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-emerald-500/20 rounded-xl">
                        <Bell className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">Centro de Notificaciones & Recordatorios In-App</h4>
                        <p className="text-xs text-slate-700 dark:text-zinc-300 mt-0.5">
                          Avisos directos en tu app sin spam: recordatorios de cuotas, revisiones de taller y estado de pagos.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {SmartNotificationsEngine.getInAppNotifications(activeContract?.contractNumber || "CTR-2026-001").map(n => (
                      <div 
                        key={n.id}
                        className={"p-4 rounded-xl border space-y-1 text-xs " + (
                          isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                            <span className="text-emerald-600 dark:text-emerald-400">●</span>
                            <span>{n.title}</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-400">{n.createdAt}</span>
                        </div>
                        <p className="text-slate-700 dark:text-zinc-300 font-sans">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PESTAÑA D: TRADE-IN UPGRADE & SOPORTE */}
              {activePortalTab === "SUPPORT" && (
                <div className="space-y-6">

                  {/* SECCIÓN 1: AGENDAR CITA DE TALLER & GARANTÍA */}
                  <div className={"p-6 rounded-2xl border space-y-4 " + (
                    isDark ? "bg-purple-950/20 border-purple-500/30" : "bg-purple-50 border-purple-200"
                  )}>
                    <div className="flex items-center space-x-3 text-purple-700 dark:text-purple-400">
                      <div className="p-2.5 bg-purple-500/20 rounded-xl">
                        <Bike className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">🛵 Agendar Cita en Taller Oficial (Garantía de Fábrica)</h4>
                        <p className="text-xs text-slate-700 dark:text-zinc-300 mt-0.5">
                          Mantén vigente la garantía de tu moto realizando tus servicios obligatorios (500 km, 1.500 km, 3.000 km).
                        </p>
                      </div>
                    </div>

                    {clientAppointmentSuccess && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
                        <span>{clientAppointmentSuccess}</span>
                      </div>
                    )}

                    <form onSubmit={handleClientScheduleWorkshop} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
                      <div>
                        <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Kilometraje Actual (Odómetro)</label>
                        <input
                          type="number"
                          required
                          value={clientOdometerInput}
                          onChange={e => setClientOdometerInput(parseInt(e.target.value, 10) || 0)}
                          className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-purple-700 dark:text-purple-400 font-bold font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Hito de Servicio</label>
                        <select
                          value={clientSelectedMilestoneKm}
                          onChange={e => setClientSelectedMilestoneKm(parseInt(e.target.value, 10))}
                          className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-white text-xs font-mono"
                        >
                          <option value={500}>500 km (1er Asentamiento)</option>
                          <option value={1500}>1.500 km (2do Preventivo)</option>
                          <option value={3000}>3.000 km (3er Servicio)</option>
                          <option value={5000}>5.000 km (4to Integral)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Taller Autorizado</label>
                        <select
                          value={clientSelectedWorkshop}
                          onChange={e => setClientSelectedWorkshop(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-white text-xs"
                        >
                          <option value="Taller Central AutoLending Catia">Taller Central Catia (Caracas)</option>
                          <option value="Taller Autorizado Maracay Centro">Taller Autorizado Maracay</option>
                          <option value="Taller Aliado Valencia Guayos">Taller Aliado Valencia</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-zinc-600 dark:text-zinc-400 block mb-1 font-semibold">Fecha y Hora Preferida</label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            required
                            value={clientAppointmentDate}
                            onChange={e => setClientAppointmentDate(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-white font-mono text-xs"
                          />
                          <button
                            type="submit"
                            className="p-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer shadow-md flex-shrink-0"
                          >
                            Agendar
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  {tradeInResult && (
                    <div className={"p-6 rounded-xl border space-y-4 " + (
                      isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200"
                    )}>
                      <div className="border-b border-zinc-200 dark:border-zinc-850 pb-3">
                        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5 text-emerald-500" />
                          <span>Calculadora Trade-In (Cambio por Modelo Superior)</span>
                        </h3>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Calcula el valor que reconocemos por tu moto actual para llevarte un modelo 0km</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Avalúo Estimado de tu Moto ($ USD)</label>
                          <input 
                            type="number"
                            value={tradeInAppraisalUSD}
                            onChange={e => setTradeInAppraisalUSD(Number(e.target.value))}
                            className={"w-full p-2.5 font-bold font-mono rounded-lg border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200")}
                          />
                        </div>

                        <div>
                          <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Precio de la Nueva Moto Deseada ($ USD)</label>
                          <input 
                            type="number"
                            value={tradeInTargetBikeUSD}
                            onChange={e => setTradeInTargetBikeUSD(Number(e.target.value))}
                            className={"w-full p-2.5 font-bold font-mono rounded-lg border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200")}
                          />
                        </div>

                        <div className={"p-3.5 rounded-lg border flex flex-col justify-center " + (
                          isDark ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200"
                        )}>
                          <span className="text-zinc-600 dark:text-zinc-400 font-semibold block">Capital Neto a tu Favor:</span>
                          <strong className="text-emerald-500 font-mono text-base mt-0.5">
                            {"$" + tradeInResult.netEquityRecognizedUSD + " USD"}
                          </strong>
                          <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
                            Efectivo adicional para inicial: {"$" + tradeInResult.additionalCashNeededUSD + " USD"}
                          </span>
                        </div>
                      </div>

                      <pre className={"p-3.5 rounded-lg border text-xs font-mono whitespace-pre-wrap " + (
                        isDark ? "bg-zinc-950 border-zinc-850 text-zinc-300" : "bg-zinc-50 border-zinc-200 text-zinc-700"
                      )}>
                        {tradeInResult.summaryText}
                      </pre>
                    </div>
                  )}

                  {/* Formulario Ticket */}
                  <form onSubmit={handleCreateSupportTicket} className={"p-6 rounded-xl border space-y-4 " + (
                    isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200"
                  )}>
                    <div className="border-b border-zinc-200 dark:border-zinc-850 pb-3">
                      <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                        <HelpCircle className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                        <span>Abrir Ticket de Soporte o Atención al Cliente</span>
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Envía tus consultas sobre placas, citas de inspección o certificados de solvencia</p>
                    </div>

                    {ticketCreatedSuccess && (
                      <div className="bg-purple-950/30 border border-purple-500/40 p-3.5 rounded-xl text-purple-800 dark:text-purple-300 text-xs flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                        <span>{ticketCreatedSuccess}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Motivo / Asunto</label>
                        <select
                          value={supportSubject}
                          onChange={e => setSupportSubject(e.target.value)}
                          className={"w-full p-2.5 rounded-lg border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200")}
                        >
                          <option value="Consulta de Placas INTT">Consulta de Estatus de Placas INTT</option>
                          <option value="Reclamo de Garantía de Concesionario">Reclamo de Garantía Mecánica con Concesionario</option>
                          <option value="Solicitud de Finiquito 100% Pagado">Solicitud de Finiquito y Levantamiento de Reserva</option>
                          <option value="Reporte de Siniestro o Pérdida">Reporte de Siniestro / Pérdida / Robo</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Teléfono de Contacto WhatsApp</label>
                        <input 
                          type="text"
                          readOnly
                          value={activeContract.clientPhone}
                          className={"w-full p-2.5 rounded-lg border font-mono " + (isDark ? "bg-zinc-950 border-zinc-800 text-zinc-400" : "bg-zinc-50 border-zinc-200")}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-zinc-600 dark:text-zinc-400 block mb-1">Mensaje / Detalle de la Solicitud</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Describe brevemente tu solicitud..."
                          value={supportMessage}
                          onChange={e => setSupportMessage(e.target.value)}
                          className={"w-full p-2.5 rounded-lg border focus:outline-none text-xs " + (
                            isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"
                          )}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition cursor-pointer"
                    >
                      Enviar Ticket a Atención al Cliente
                    </button>
                  </form>
                </div>
              )}

            </div>

          </div>
        ) : (
          <div className={"p-16 rounded-2xl border text-center space-y-3 " + (
            isDark ? "bg-zinc-900/40 border-zinc-850 text-zinc-400" : "bg-white border-zinc-200 text-zinc-600"
          )}>
            <Lock className="w-8 h-8 text-slate-500 dark:text-zinc-400 mx-auto" />
            <h3 className="font-bold text-base text-slate-900 dark:text-zinc-100">No se ha seleccionado ningún contrato activo</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400">Ingresa tu número de Cédula arriba para acceder a tu estado de cuenta.</p>
          </div>
        )}

      </main>

      {/* MODAL DE IMPRESIÓN Y DESCARGA EN PDF */}
      {activeContract && (
        <PrintDocumentModal 
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          docType={printDocType}
          contract={activeContract}
          receiptData={printReceiptData}
          bcvRate={bcvRate}
        />
      )}
    </div>
  );
}
