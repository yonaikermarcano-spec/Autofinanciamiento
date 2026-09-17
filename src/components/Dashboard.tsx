"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  LayoutDashboard,
  Users, 
  Bike, 
  Car, 
  DollarSign, 
  ShieldAlert, 
  FileText, 
  Smartphone, 
  Clock, 
  FileCheck, 
  Navigation, 
  Settings, 
  TrendingUp, 
  Wallet, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Send, 
  RefreshCw, 
  Lock, 
  HelpCircle,
  Printer,
  MapPin,
  UserX,
  Tag,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Sliders,
  ArrowUpDown,
  PhoneCall,
  Download,
  ChevronDown,
  ChevronsUpDown,
  Bell,
  Menu,
  Sun,
  Moon,
  MoreHorizontal,
  ExternalLink,
  Code2,
  Check,
  ChevronRight,
  ShieldCheck,
  KeyRound,
  Shield,
  Coins,
  MessageSquare,
  Sparkles,
  History,
  FileSpreadsheet,
  PieChart,
  BarChart3,
  Receipt,
  Scale,
  Radio,
  Key,
  UploadCloud,
  Store,
  Calculator,
  Award,
  Wrench,
  Brain,
  FolderLock,
  PackageCheck,
  Building2,
  Ticket,
  UserCheck,
  X
} from "lucide-react";
import { toast } from "./common/GoogleSnackbar";
import { BcvEngine, CurrencyBenchmark } from "../modules/bcv-engine";
import { FinancialCore } from "../modules/financial-core";
import { TreasuryGuard } from "../modules/treasury-guard";
import { LocalDB } from "../modules/local-db";
import { InttLegalModule } from "../modules/intt-legal";
import { AtcTicketsModule } from "../modules/atc-tickets";
import { PromoEngine } from "../modules/promo-engine";
import { TenantOnboardingEngine } from "../modules/tenant-onboarding";
import { AuthSecurityModule, UserRole, PermissionKey } from "../modules/auth-security";
import { WhatsappNotificationEngine, NotificationTemplateType } from "../modules/whatsapp-notifications";
import { FinancialReportsEngine, SeniatSalesEntry, MonthlyCashFlowProjection, BalanceSheetData } from "../modules/financial-reports";
import { FieldAppEngine, HomeInspectionRecord, FieldRepossessionRecord } from "../modules/field-app";
import { BulkDataEngine } from "../modules/bulk-data";
import { LoanContract, VehicleSpec } from "../types";

import NewClientModal from "./modals/NewClientModal";
import NewVehicleModal from "./modals/NewVehicleModal";
import NewLoanModal from "./modals/NewLoanModal";
import CashierShiftModal from "./modals/CashierShiftModal";
import PrintDocumentModal, { DocType } from "./modals/PrintDocumentModal";
import KpiDrillDownModal, { KpiCategory } from "./modals/KpiDrillDownModal";
import ManageUsersModal from "./modals/ManageUsersModal";
import WhatsappBroadcastModal from "./modals/WhatsappBroadcastModal";
import BulkDataModal from "./modals/BulkDataModal";
import TelematicsGpsModal from "./modals/TelematicsGpsModal";
import ForensicAuditModal from "./modals/ForensicAuditModal";
import JudicialCollectionModal from "./modals/JudicialCollectionModal";
import PromissoryNoteModal from "./modals/PromissoryNoteModal";
import DealersPayableModal from "./modals/DealersPayableModal";
import BankPushReconciliationModal from "./modals/BankPushReconciliationModal";
import CommissionsModal from "./modals/CommissionsModal";
import MaintenanceWarrantyModal from "./modals/MaintenanceWarrantyModal";
import CreditScoringModal from "./modals/CreditScoringModal";
import GPSCommandCenterModal from "./modals/GPSCommandCenterModal";
import LegalDocsAndAlliedModal from "./modals/LegalDocsAndAlliedModal";
import ExecutiveBIModal from "./modals/ExecutiveBIModal";
import SmartCommunicationsModal from "./modals/SmartCommunicationsModal";
import DigitalDossierModal from "./modals/DigitalDossierModal";
import LoanRestructuringModal from "./modals/LoanRestructuringModal";
import CryptoReconciliationModal from "./modals/CryptoReconciliationModal";
import InvestorPortalModal from "./modals/InvestorPortalModal";
import DebtAssignmentModal from "./modals/DebtAssignmentModal";
import PromotionsReferralsModal from "./modals/PromotionsReferralsModal";
import { DebtAssignmentEngine } from "../modules/debt-assignment";
import { PromotionsReferralsEngine } from "../modules/promotions-referrals";
import { LoanRestructuringEngine } from "../modules/loan-restructuring";
import { CryptoReconciliationEngine } from "../modules/crypto-reconciliation";
import { TenantConfigEngine, TenantFinancingConfig } from "../modules/tenant-config";
import { InvestorPortalEngine } from "../modules/investor-portal";
import { DigitalDossierEngine } from "../modules/digital-dossier";
import { SmartNotificationsEngine } from "../modules/smart-notifications";
import { ExecutiveBIEngine } from "../modules/executive-bi";
import { LegalDocumentationEngine } from "../modules/legal-documentation";
import { GPSTelemetryEngine } from "../modules/gps-telemetry";
import { CreditScoringEngine } from "../modules/credit-scoring";
import { MaintenanceWarrantyEngine } from "../modules/maintenance-warranty";
import { CommissionsEngine } from "../modules/commissions";
import { BankPushEngine } from "../modules/bank-push";
import { DealersPayableEngine } from "../modules/dealers-payable";
import { PromissoryNoteEngine } from "../modules/promissory-note";
import { JudicialCollectionEngine } from "../modules/judicial-collection";
import { ForensicAuditEngine } from "../modules/forensic-audit";
import { TelematicsEngine } from "../modules/telematics-gps";
import FieldAppPwa from "./FieldAppPwa";
import PublicLoanSimulator from "./PublicLoanSimulator";


// Componente Helper de Tooltip Explicativo para las 7 Dimensiones
function DimensionHelpTooltip({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center ml-1.5 align-middle">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition cursor-pointer p-0.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none"
        title="Clic para ver explicación"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      {isOpen && (
        <span 
          onClick={(e) => e.stopPropagation()}
          className="absolute left-6 -top-2 w-64 p-3 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[11px] font-normal rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 leading-relaxed border border-zinc-700/60 dark:border-zinc-300 pointer-events-auto block text-left"
        >
          <span className="flex items-center justify-between gap-1 mb-1 border-b border-zinc-800 dark:border-zinc-200 pb-1">
            <strong className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 dark:text-emerald-600 flex items-center space-x-1">
              <span>💡</span>
              <span>Guía Explicativa</span>
            </strong>
            <button 
              type="button" 
              onClick={() => setIsOpen(false)} 
              className="text-zinc-600 dark:text-zinc-400 hover:text-white dark:hover:text-black text-[10px] cursor-pointer"
            >
              ✕
            </button>
          </span>
          <span className="block text-zinc-100 dark:text-zinc-900 font-sans">{text}</span>
        </span>
      )}
    </span>
  );
}

export default function Dashboard() {
  // Modo PWA Móvil para Cobradores en Calle
  const [isFieldAppActive, setIsFieldAppActive] = useState(false);
  const [isPublicSimulatorActive, setIsPublicSimulatorActive] = useState(false);

  // Tema Resend: Soporte Light / Dark Mode
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [currentSection, setCurrentSection] = useState<string>("dashboard");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Tasas Multimoneda (3 Opciones: Dólar BCV, Euro BCV, Binance USDT)
  const [activeBenchmark, setActiveBenchmark] = useState<CurrencyBenchmark>("USD_BCV");
  const [usdRate, setUsdRate] = useState<number>(46.85);
  const [eurRate, setEurRate] = useState<number>(50.12);
  const [usdtRate, setUsdtRate] = useState<number>(52.40);
  const [isRateMenuOpen, setIsRateMenuOpen] = useState(false);

  const activeRateValue = activeBenchmark === "EUR_BCV" ? eurRate : activeBenchmark === "USDT_BINANCE" ? usdtRate : usdRate;
  const bcvRate = activeRateValue; // Para cálculos del core financiero

  // Control de Acceso por Roles (RBAC)
  const [userRole, setUserRole] = useState<UserRole>("GERENTE_GENERAL");
  const [isManageUsersModalOpen, setIsManageUsersModalOpen] = useState(false);
  const [isToolsHubOpen, setIsToolsHubOpen] = useState(false);
  // Gestor de Módulos Activos (Feature Flags)
  const defaultModulesConfig = {
    // 1. Menú Lateral
    crm_clients: true,
    notifs_whatsapp: true,
    financial_reports: true,
    inventory: true,
    loan_servicing: true,
    treasury_cash: true,
    intt_legal: true,
    field_recovery: true,
    promotions: true,
    
    // 2. Módulos Especializados
    loan_restructuring: true,
    crypto_reconciliation: true,
    investor_portal: true,
    debt_assignment: true,
    promotions_referrals: true,
    digital_dossier: true,
    smart_communications: true,
    executive_bi: true,
    legal_docs_allied: true,
    gps_telemetry: true,
    credit_scoring: true,
    mechanical_workshop: true,
    commissions: true,
    bank_push: true,
    dealers_payable: true,
    promissory_otp: true,
    judicial_collection: true,
    forensic_audit: true,
    public_simulator: true,
    field_app_pwa: true,
    bulk_backup: true,
  };

  
  // 7 Dimensiones de Configuración de Financiadora
  const [financingConfig, setFinancingConfig] = useState<TenantFinancingConfig>(() => TenantConfigEngine.getConfig());
  const [settingsActiveTab, setSettingsActiveTab] = useState<"MODULES" | "DIMENSIONS">("DIMENSIONS");
  const [isSecurityConfirmModalOpen, setIsSecurityConfirmModalOpen] = useState(false);
  const [configSaveSuccess, setConfigSaveSuccess] = useState<string | null>(null);
  const [rbacMatrixVersion, setRbacMatrixVersion] = useState(0);

  useEffect(() => {
    const handleRbacUpdate = () => {
      setRbacMatrixVersion(v => v + 1);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("rbac_permissions_updated", handleRbacUpdate);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("rbac_permissions_updated", handleRbacUpdate);
      }
    };
  }, []);

  const handleUpdateFinancingConfig = (updater: (prev: TenantFinancingConfig) => TenantFinancingConfig) => {
    setFinancingConfig(prev => updater(prev));
  };

  const handleConfirmSaveConfig = () => {
    const result = TenantConfigEngine.saveConfig(financingConfig, userRole);
    setIsSecurityConfirmModalOpen(false);
    setConfigSaveSuccess("¡Configuración de la Financiadora guardada con éxito! Sello de Integridad: " + result.sha256AuditSeal + " (Versión #" + result.version + ")");
    setTimeout(() => setConfigSaveSuccess(null), 7000);
  };

  const [activeModules, setActiveModules] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("autolending_active_modules");
        if (saved) return { ...defaultModulesConfig, ...JSON.parse(saved) };
      } catch (e) {}
    }
    return defaultModulesConfig;
  });

  const toggleModule = (moduleKey: keyof typeof defaultModulesConfig) => {
    setActiveModules((prev: any) => {
      const updated = { ...prev, [moduleKey]: !prev[moduleKey] };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("autolending_active_modules", JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  };

  const setAllModules = (enableAll: boolean) => {
    const updated: any = {};
    Object.keys(defaultModulesConfig).forEach(k => {
      updated[k] = enableAll;
    });
    setActiveModules(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("autolending_active_modules", JSON.stringify(updated));
      } catch (e) {}
    }
  };


  // Modal WhatsApp & Modal Bulk Import/Export
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [whatsappInitialTemplate, setWhatsappInitialTemplate] = useState<NotificationTemplateType>("PREVENTIVE_3_DAYS");
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isTelematicsModalOpen, setIsTelematicsModalOpen] = useState(false);
  const [isForensicModalOpen, setIsForensicModalOpen] = useState(false);
  const [isJudicialModalOpen, setIsJudicialModalOpen] = useState(false);
  const [isPromissoryModalOpen, setIsPromissoryModalOpen] = useState(false);
  const [isDealersPayableModalOpen, setIsDealersPayableModalOpen] = useState(false);
  const [isBankPushModalOpen, setIsBankPushModalOpen] = useState(false);
  const [isCommissionsModalOpen, setIsCommissionsModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isCreditScoringModalOpen, setIsCreditScoringModalOpen] = useState(false);
  const [isGPSModalOpen, setIsGPSModalOpen] = useState(false);
  const [isLegalDocsModalOpen, setIsLegalDocsModalOpen] = useState(false);
  const [isBIModalOpen, setIsBIModalOpen] = useState(false);
  const [isSmartCommsModalOpen, setIsSmartCommsModalOpen] = useState(false);
  const [isDigitalDossierModalOpen, setIsDigitalDossierModalOpen] = useState(false);
  const [isRestructureModalOpen, setIsRestructureModalOpen] = useState(false);
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [isInvestorModalOpen, setIsInvestorModalOpen] = useState(false);
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  // Menús desplegables
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);

  // Referencias para cerrar popovers al hacer click fuera o presionar Esc
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const rateMenuRef = useRef<HTMLDivElement>(null);
  const toolsHubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsProfileMenuOpen(false);
        setIsRateMenuOpen(false);
        setIsToolsHubOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (isProfileMenuOpen && profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
      if (isRateMenuOpen && rateMenuRef.current && !rateMenuRef.current.contains(target)) {
        setIsRateMenuOpen(false);
      }
      if (isToolsHubOpen && toolsHubRef.current && !toolsHubRef.current.contains(target)) {
        setIsToolsHubOpen(false);
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
  }, [isProfileMenuOpen, isRateMenuOpen, isToolsHubOpen]);

  // Pestaña en sección Contabilidad & Reportes
  const [accountingTab, setAccountingTab] = useState<"SENIAT_SALES" | "CASH_FLOW" | "BALANCE_SHEET" | "BANK_RECON">("SENIAT_SALES");

  const [contracts, setContracts] = useState<LoanContract[]>(LocalDB.getAllContracts());
  const [vehicles, setVehicles] = useState<VehicleSpec[]>(LocalDB.getAllVehicles());
  const activePromos = PromoEngine.getActiveCampaigns();
  const tenantProfile = TenantOnboardingEngine.getProfile();

  const treasuryMetrics = TreasuryGuard.evaluateTreasuryHealth({
    totalCashUSD: 14500,
    totalCashVESInUSD: 3200,
    totalBankVESInUSD: 4800,
    totalBinanceUSDT: 5500,
    committedDownPaymentsUSD: 18000,
    monthlyFixedCostsUSD: 3500,
    currentMonthCollectedUSD: 4200
  });

  const [selectedContractId, setSelectedContractId] = useState<string>("ctr-001");
  const selectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0] || {} as LoanContract;
  const [paymentAmountUSD, setPaymentAmountUSD] = useState<number>(50);
  const [paymentMethod, setPaymentMethod] = useState<"PAGO_MOVIL" | "BINANCE_USDT" | "CASH_USD">("PAGO_MOVIL");
  const [paymentReference, setPaymentReference] = useState<string>("PM-849201");
  const [lastPaymentResult, setLastPaymentResult] = useState<any>(null);

  // Modales
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isNewVehicleModalOpen, setIsNewVehicleModalOpen] = useState(false);
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);
  const [isCashierModalOpen, setIsCashierModalOpen] = useState(false);
  const [cashierAuditResult, setCashierAuditResult] = useState<any>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printDocType, setPrintDocType] = useState<DocType>("CONTRACT");
  const [printReceiptData, setPrintReceiptData] = useState<any>(null);
  const [selectedKpi, setSelectedKpi] = useState<KpiCategory | null>(null);
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);

  // Filtros CRM
  const [crmTab, setCrmTab] = useState<"ALL" | "DELIVERED" | "PENDING" | "VISITING" | "RECOVERY" | "EXPIRED" | "REFUND">("ALL");
  const [crmSearchTerm, setCrmSearchTerm] = useState("");
  const [crmBrandFilter, setCrmBrandFilter] = useState("TODOS");
  const [crmOverdueFilter, setCrmOverdueFilter] = useState("TODOS");
  const [crmSortBy, setCrmSortBy] = useState("DEFAULT");

  // Filtros Inventario
  const [invSearchTerm, setInvSearchTerm] = useState("");
  const [invTypeFilter, setInvTypeFilter] = useState("TODOS");
  const [invBrandFilter, setInvBrandFilter] = useState("TODOS");
  const [invStatusFilter, setInvStatusFilter] = useState("TODOS");
  const [invSortBy, setInvSortBy] = useState("DEFAULT");

  // Helper de Permisos RBAC
  const canAccess = (permission: PermissionKey) => rbacMatrixVersion >= 0 && AuthSecurityModule.hasPermission(userRole, permission);

  const openKpiDrillDown = (kpi: KpiCategory) => {
    setSelectedKpi(kpi);
    setIsKpiModalOpen(true);
  };

  const openPrintModal = (type: DocType, receipt?: any) => {
    setPrintDocType(type);
    setPrintReceiptData(receipt);
    setIsPrintModalOpen(true);
  };

  const openWhatsappModal = (contractId?: string, template: NotificationTemplateType = "PREVENTIVE_3_DAYS") => {
    if (contractId) setSelectedContractId(contractId);
    setWhatsappInitialTemplate(template);
    setIsWhatsappModalOpen(true);
  };

  // KPIs
  const countExpirados = contracts.filter(c => c.status === "EXPIRADO" || c.isExpiredPermanently).length;
  const countMorosos = contracts.filter(c => (c.overdueMonthsCount && c.overdueMonthsCount > 0) || c.status === "IN_DEFAULT" || c.status === "POR_RECUPERAR").length;
  const countEntregadas = contracts.filter(c => c.deliveryStatus === "ENTREGADO" || c.deliveryStatus === "POR_RECUPERAR").length;
  const countPorEntregar = contracts.filter(c => c.deliveryStatus === "ACUMULANDO_CUOTAS" || c.deliveryStatus === "PENDIENTE_INICIAL" || c.deliveryStatus === "POR_VISITAR" || c.deliveryStatus === "LISTO_PARA_ENTREGA").length;
  const countPorRecuperar = contracts.filter(c => c.deliveryStatus === "POR_RECUPERAR" || c.status === "POR_RECUPERAR").length;
  const countPorVisitar = contracts.filter(c => c.deliveryStatus === "POR_VISITAR" || c.status === "POR_VISITAR").length;
  const countPorReembolsar = contracts.filter(c => c.refundStatus === "POR_REEMBOLSAR" || c.refundStatus === "APROBADO" || c.status === "POR_REEMBOLSAR").length;

  const totalCuotasPorCobrarUSD = Number(contracts.reduce((acc, c) => acc + (c.quotasPendingAmountUSD || 0), 0).toFixed(2));
  const totalMorasPorCobrarUSD = Number(contracts.reduce((acc, c) => acc + (c.lateFeesPendingUSD || 0), 0).toFixed(2));
  const totalTotalPorCobrarUSD = Number((totalCuotasPorCobrarUSD + totalMorasPorCobrarUSD).toFixed(2));

  // Datos Contables Calculados
  const seniatSales = FinancialReportsEngine.generateSeniatSalesBook(contracts, bcvRate);
  const cashFlowProjections = FinancialReportsEngine.generate12MonthsCashFlow(contracts, 28000);
  const balanceSheet = FinancialReportsEngine.generateBalanceSheet(contracts);

  const totalSeniatBaseUSD = Number(seniatSales.reduce((acc, s) => acc + s.baseImponibleUSD, 0).toFixed(2));
  const totalSeniatIvaUSD = Number(seniatSales.reduce((acc, s) => acc + s.iva16PercentUSD, 0).toFixed(2));
  const totalSeniatIgtfUSD = Number(seniatSales.reduce((acc, s) => acc + s.igtf3PercentUSD, 0).toFixed(2));
  const totalSeniatFacturadoUSD = Number(seniatSales.reduce((acc, s) => acc + s.totalInvoiceUSD, 0).toFixed(2));

  // Filtrado CRM
  const availableCrmBrands = Array.from(new Set(contracts.map(c => c.vehicle?.brand).filter(Boolean)));
  
  const filteredCrmContracts = contracts.filter(c => {
    if (crmTab === "DELIVERED" && c.deliveryStatus !== "ENTREGADO") return false;
    if (crmTab === "PENDING" && c.deliveryStatus !== "ACUMULANDO_CUOTAS" && c.deliveryStatus !== "PENDIENTE_INICIAL") return false;
    if (crmTab === "VISITING" && c.deliveryStatus !== "POR_VISITAR") return false;
    if (crmTab === "RECOVERY" && c.deliveryStatus !== "POR_RECUPERAR" && c.status !== "POR_RECUPERAR") return false;
    if (crmTab === "EXPIRED" && c.status !== "EXPIRADO" && !c.isExpiredPermanently) return false;
    if (crmTab === "REFUND" && c.refundStatus !== "POR_REEMBOLSAR" && c.status !== "POR_REEMBOLSAR") return false;

    if (crmSearchTerm.trim()) {
      const term = crmSearchTerm.toLowerCase().trim();
      const matchClient = 
        c.clientName.toLowerCase().includes(term) ||
        c.clientDocId.toLowerCase().includes(term) ||
        c.contractNumber.toLowerCase().includes(term) ||
        c.clientPhone.toLowerCase().includes(term) ||
        c.clientAddress.toLowerCase().includes(term);
      const matchGuarantor = 
        (c.guarantor?.name && c.guarantor.name.toLowerCase().includes(term)) ||
        (c.guarantor?.docId && c.guarantor.docId.toLowerCase().includes(term)) ||
        (c.guarantor?.phone && c.guarantor.phone.toLowerCase().includes(term));
      const matchVehicle = 
        (c.vehicle?.brand && c.vehicle.brand.toLowerCase().includes(term)) ||
        (c.vehicle?.model && c.vehicle.model.toLowerCase().includes(term)) ||
        (c.vehicle?.vinChassis && c.vehicle.vinChassis.toLowerCase().includes(term)) ||
        (c.vehicle?.plate && c.vehicle.plate.toLowerCase().includes(term));
      if (!matchClient && !matchGuarantor && !matchVehicle) return false;
    }

    if (crmBrandFilter !== "TODOS" && c.vehicle?.brand !== crmBrandFilter) return false;
    if (crmOverdueFilter === "CON_MORA") {
      if ((c.lateFeesPendingUSD || 0) <= 0 && (!c.overdueMonthsCount || c.overdueMonthsCount === 0)) return false;
    } else if (crmOverdueFilter === "SIN_MORA") {
      if ((c.lateFeesPendingUSD || 0) > 0 || (c.overdueMonthsCount && c.overdueMonthsCount > 0)) return false;
    } else if (crmOverdueFilter === "MORA_2_MESES") {
      if (!c.overdueMonthsCount || c.overdueMonthsCount < 2) return false;
    } else if (crmOverdueFilter === "MORA_3_MESES") {
      if (!c.overdueMonthsCount || c.overdueMonthsCount < 3) return false;
    }
    return true;
  }).sort((a, b) => {
    if (crmSortBy === "NAME_ASC") return a.clientName.localeCompare(b.clientName);
    if (crmSortBy === "NAME_DESC") return b.clientName.localeCompare(a.clientName);
    if (crmSortBy === "OUTSTANDING_DESC") return b.totalOutstandingUSD - a.totalOutstandingUSD;
    if (crmSortBy === "LATE_FEES_DESC") return (b.lateFeesPendingUSD || 0) - (a.lateFeesPendingUSD || 0);
    if (crmSortBy === "PROGRESS_DESC") return b.overallProgressPercent - a.overallProgressPercent;
    return 0;
  });

  // Filtrado Inventario
  const availableInvBrands = Array.from(new Set(vehicles.map(v => v.brand).filter(Boolean)));
  const filteredVehicles = vehicles.filter(v => {
    if (invSearchTerm.trim()) {
      const term = invSearchTerm.toLowerCase().trim();
      const match = 
        v.brand.toLowerCase().includes(term) ||
        v.model.toLowerCase().includes(term) ||
        v.vinChassis.toLowerCase().includes(term) ||
        v.engineSerial.toLowerCase().includes(term) ||
        (v.plate && v.plate.toLowerCase().includes(term)) ||
        v.color.toLowerCase().includes(term);
      if (!match) return false;
    }
    if (invTypeFilter !== "TODOS" && v.type !== invTypeFilter) return false;
    if (invBrandFilter !== "TODOS" && v.brand !== invBrandFilter) return false;
    if (invStatusFilter !== "TODOS" && v.status !== invStatusFilter) return false;
    return true;
  }).sort((a, b) => {
    if (invSortBy === "PRICE_ASC") return a.retailPriceUSD - b.retailPriceUSD;
    if (invSortBy === "PRICE_DESC") return b.retailPriceUSD - a.retailPriceUSD;
    if (invSortBy === "BRAND_ASC") return a.brand.localeCompare(b.brand);
    if (invSortBy === "YEAR_DESC") return b.year - a.year;
    return 0;
  });

  // Manejo de Pagos
  const handleProcessPayment = () => {
    try {
      const targetQuota = selectedContract.schedule?.find(q => q.status === "PENDING" || q.status === "PARTIALLY_PAID" || q.status === "OVERDUE");
      const quotaNum = targetQuota ? targetQuota.quotaNumber : 1;

      const result = FinancialCore.processPayment({
        schedule: selectedContract.schedule,
        quotaNumber: quotaNum,
        amountPaidUSD: paymentAmountUSD,
        paymentMethod,
        paymentReference,
        bcvRate,
        clientName: selectedContract.clientName,
        contractNumber: selectedContract.contractNumber
      });

      // Registro de Auditoría
      AuthSecurityModule.logAction({
        userId: userRole === "GERENTE_GENERAL" ? "usr-001" : "usr-002",
        userName: userRole === "GERENTE_GENERAL" ? "Yon Aiker" : "María Fernández (Caja)",
        userRole,
        action: "PAGO_RECAUDADO",
        module: "RECAUDACION",
        details: "Cobro registrado por $" + paymentAmountUSD + " USD (Cuota #" + quotaNum + ") para " + selectedContract.clientName + " (Contrato #" + selectedContract.contractNumber + ") vía " + paymentMethod
      });

      setLastPaymentResult(result);
      setContracts(LocalDB.getAllContracts());
      toast.success("¡Abono registrado con éxito! Recibo: " + result.receiptCode);

      // Sugerir confirmación por WhatsApp
      openWhatsappModal(selectedContract.id, "PAYMENT_CONFIRMATION");
    } catch (err: any) {
      toast.error("Error procesando pago: " + err.message);
    }
  };

  const isDark = theme === "dark";

  // Si está activada la App Móvil PWA
  if (isPublicSimulatorActive) {
    return (
      <PublicLoanSimulator
        onBackToDashboard={() => setIsPublicSimulatorActive(false)}
        bcvRate={bcvRate}
      />
    );
  }

  if (isFieldAppActive) {
    return (
      <FieldAppPwa
        contracts={contracts}
        onBackToDashboard={() => setIsFieldAppActive(false)}
        bcvRate={bcvRate}
      />
    );
  }

  return (
    <div className={(isDark ? "dark bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900") + " flex min-h-screen md:h-screen font-sans antialiased"}>

      {isMobileNavOpen && (
        <button
          type="button"
          aria-label="Cerrar navegación"
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 z-30 bg-zinc-950/30 backdrop-blur-[2px] md:hidden"
        />
      )}
      
      {/* SIDEBAR MINIMALISTA */}
      <aside className={(isMobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0") + " fixed inset-y-0 left-0 z-40 w-72 md:static md:w-64 flex flex-col justify-between border-r transition-transform duration-200 " + (
        isDark ? "bg-zinc-950 border-zinc-850" : "bg-white border-zinc-200"
      ) + " p-3.5 select-none"}>
        
        <div className="space-y-4">
          
          {/* Workspace Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
              className={"w-full flex items-center justify-between p-2 rounded-lg transition cursor-pointer " + (
                isDark ? "hover:bg-zinc-900" : "hover:bg-zinc-100"
              )}
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs shadow-sm">
                  {tenantProfile.commercialName.slice(0, 1).toUpperCase()}
                </div>
                <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 tracking-tight truncate max-w-[130px]">
                  {tenantProfile.commercialName}
                </span>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
            </button>
          </div>

          {/* Menú de Navegación Principal */}
          <nav className="space-y-1 text-xs">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-3.5 block mb-1.5">
              General
            </span>

            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, perm: "VIEW_DASHBOARD_KPI" as PermissionKey, enabled: true },
              { id: "crm_clients", label: "Clientes & Avales", icon: Users, perm: "VIEW_CRM_CLIENTS" as PermissionKey, enabled: activeModules.crm_clients },
              { id: "notifs_whatsapp", label: "WhatsApp & Alertas", icon: MessageSquare, perm: "VIEW_CRM_CLIENTS" as PermissionKey, enabled: activeModules.notifs_whatsapp },
              { id: "financial_reports", label: "Reportería & SENIAT", icon: FileSpreadsheet, perm: "VIEW_TREASURY_VAULT" as PermissionKey, enabled: activeModules.financial_reports },
              { id: "inventory", label: "Inventario", icon: Bike, perm: "VIEW_INVENTORY" as PermissionKey, enabled: activeModules.inventory },
              { id: "loan_servicing", label: "Plan de Abonos", icon: DollarSign, perm: "PROCESS_PAYMENTS" as PermissionKey, enabled: activeModules.loan_servicing },
              { id: "treasury_cash", label: "Caja & Arqueo", icon: Wallet, perm: "PERFORM_CASHIER_AUDIT" as PermissionKey, enabled: activeModules.treasury_cash },
              { id: "intt_legal", label: "Gestión INTT", icon: FileCheck, perm: "PRINT_LEGAL_DOCS" as PermissionKey, enabled: activeModules.intt_legal },
              { id: "field_recovery", label: "Recuperación & Calle", icon: Navigation, perm: "TRIGGER_FIELD_RECOVERY" as PermissionKey, enabled: activeModules.field_recovery },
              { id: "promotions", label: "Campañas & Cupos", icon: Tag, perm: "VIEW_CRM_CLIENTS" as PermissionKey, enabled: activeModules.promotions },
            ].filter(item => item.enabled !== false).map(item => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              const hasAccess = canAccess(item.perm);

              return (
                <button
                  key={item.id}
                  onClick={() => { setCurrentSection(item.id); setIsMobileNavOpen(false); }}
                  className={"w-full flex items-center justify-between px-3.5 py-2.5 rounded-full font-medium transition cursor-pointer text-xs " + (
                    isActive 
                      ? isDark 
                        ? "bg-google-blue-900/30 text-google-blue-300 font-bold" 
                        : "bg-google-blue-50 text-google-blue-700 font-bold"
                      : isDark
                        ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={"w-4 h-4 transition-colors " + (isActive ? (isDark ? "text-google-blue-300" : "text-google-blue-700") : "text-zinc-400")} />
                    <span>{item.label}</span>
                  </div>
                  {!hasAccess && (
                    <span title="Requiere mayor nivel de privilegios">
                      <Lock className="w-3 h-3 text-zinc-400 opacity-60" />
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Acciones Rápidas en Sidebar */}
          <div className="pt-2 space-y-1.5">
            {activeModules.public_simulator && <button
              onClick={() => setIsPublicSimulatorActive(true)}
              className="w-full p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition flex items-center justify-center space-x-2 text-xs font-bold cursor-pointer"
              title="Abrir landing page y calculadora pública para clientes"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulador Web Clientes</span>
            </button>}
          </div>
        </div>

        {/* User Profile & RBAC Modal Trigger */}
        <div className="relative pt-2 border-t border-zinc-200 dark:border-zinc-850" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={"w-full flex items-center justify-between p-2 rounded-lg transition cursor-pointer " + (
              isDark ? "hover:bg-zinc-900" : "hover:bg-zinc-100"
            )}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-bold text-xs">
                {userRole === "GERENTE_GENERAL" ? "Y" : userRole === "CAJERO" ? "M" : userRole === "ASESOR_VENTAS" ? "C" : "H"}
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {userRole === "GERENTE_GENERAL" ? "Yon Aiker" : userRole === "CAJERO" ? "María Fernández" : userRole === "ASESOR_VENTAS" ? "Carlos Mendoza" : "Héctor Rodríguez"}
                </p>
                <p className="text-[10px] text-zinc-600 dark:text-zinc-400 truncate font-mono">
                  {userRole.replace("_", " ")}
                </p>
              </div>
            </div>
            <MoreHorizontal className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
          </button>

          {/* Menú Flotante de Perfil */}
          {isProfileMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={(e) => { e.stopPropagation(); setIsProfileMenuOpen(false); }} 
              />
              <div className={"absolute bottom-14 left-2 right-2 rounded-xl p-1.5 shadow-2xl border text-xs space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150 " + (
                isDark ? "bg-zinc-900 border-zinc-800 text-zinc-200" : "bg-white border-zinc-200 text-zinc-800"
              )}>
              <div className="p-2 border-b border-zinc-200 dark:border-zinc-800">
                <p className="font-semibold text-xs">Sesión: {userRole.replace("_", " ")}</p>
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400">RIF: {tenantProfile.rif}</span>
              </div>

              <button
                onClick={() => { setIsManageUsersModalOpen(true); setIsProfileMenuOpen(false); }}
                className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/80 flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold cursor-pointer"
              >
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>Seguridad & Permisos RBAC</span>
                </div>
                <KeyRound className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
              </button>

              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/80">
                <span className="text-xs font-medium">Appearance</span>
                <div className="flex items-center bg-zinc-200 dark:bg-zinc-800 p-0.5 rounded-lg">
                  <button
                    onClick={() => setTheme("light")}
                    className={"p-1 rounded-md transition " + (!isDark ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-400 hover:text-white")}
                    title="Modo Claro"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={"p-1 rounded-md transition " + (isDark ? "bg-zinc-950 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900")}
                    title="Modo Oscuro"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button 
                onClick={() => { setCurrentSection("settings"); setIsProfileMenuOpen(false); }}
                className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/80 flex items-center justify-between"
              >
                <span>Configuración Empresa</span>
                <ExternalLink className="w-3 h-3 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>
            </>
          )}
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen md:h-screen md:overflow-hidden">
        
        {/* HEADER SUPERIOR LIMPIO ESTILO GOOGLE */}
        <header className={"min-h-16 border-b flex items-center justify-between gap-3 px-4 sm:px-6 z-20 backdrop-blur-md transition-colors " + (
          isDark ? "bg-zinc-950/95 border-zinc-850" : "bg-white/95 border-zinc-200"
        )}>
          
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Abrir navegación"
              className="p-2 -ml-2 rounded-full text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 md:hidden transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block min-w-0">
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{currentSection === "dashboard" ? "Resumen General" : "Gestión Operativa"}</p>
              <p className="text-[11px] text-zinc-500 truncate">AutoLending OS</p>
            </div>
          </div>

          {/* BARRA DE BÚSQUEDA CENTRAL GOOGLE SEARCH PILL */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar clientes, contratos, placas, VIN (Ctrl+K)..."
              className={"w-full pl-10 pr-4 py-2 text-xs rounded-full border transition-all duration-200 focus:outline-none " + (
                isDark 
                  ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-google-blue-500 focus:bg-zinc-850"
                  : "bg-zinc-100/90 border-transparent text-zinc-900 placeholder-zinc-500 focus:border-google-blue-500 focus:bg-white focus:shadow-xs"
              )}
            />
          </div>

          {/* DERECHA: TASA BCV + MÓDULOS (35) + ROL + CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            
            {/* 1. SELECTOR INTERACTIVO DE 3 TASAS - GOOGLE FINANCE CHIP */}
            <div className="relative" ref={rateMenuRef}>
              <button
                onClick={() => setIsRateMenuOpen(!isRateMenuOpen)}
                className={"flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold transition cursor-pointer shadow-xs " + (
                  isDark 
                    ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700" 
                    : "bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-300"
                )}
              >
                <Coins className="w-3.5 h-3.5 text-google-green-600 dark:text-google-green-400" />
                <span>
                  {activeBenchmark === "USD_BCV" && "USD: Bs. " + usdRate.toFixed(2)}
                  {activeBenchmark === "EUR_BCV" && "EUR: Bs. " + eurRate.toFixed(2)}
                  {activeBenchmark === "USDT_BINANCE" && "USDT: Bs. " + usdtRate.toFixed(2)}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {/* DROPDOWN DE LAS 3 TASAS */}
              {isRateMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={(e) => { e.stopPropagation(); setIsRateMenuOpen(false); }} 
                  />
                  <div className={"absolute right-0 top-11 w-72 rounded-3xl p-3.5 shadow-2xl border text-xs space-y-2 z-50 animate-in fade-in zoom-in-95 duration-150 " + (
                    isDark ? "bg-zinc-900 border-zinc-800 text-zinc-200" : "bg-white border-zinc-200 text-zinc-900"
                  )}>
                  <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 flex items-center justify-between">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Seleccionar Tasa Activa
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">● En Vivo</span>
                  </div>

                  {/* 1. DÓLAR BCV */}
                  <div 
                    onClick={() => { setActiveBenchmark("USD_BCV"); setIsRateMenuOpen(false); }}
                    className={"p-2.5 rounded-xl border transition cursor-pointer space-y-1.5 " + (
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
                      <span className="text-sm font-black">Bs. {usdRate.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* 2. EURO BCV */}
                  <div 
                    onClick={() => { setActiveBenchmark("EUR_BCV"); setIsRateMenuOpen(false); }}
                    className={"p-2.5 rounded-xl border transition cursor-pointer space-y-1.5 " + (
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
                      <span className="text-sm font-black">Bs. {eurRate.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* 3. BINANCE USDT */}
                  <div 
                    onClick={() => { setActiveBenchmark("USDT_BINANCE"); setIsRateMenuOpen(false); }}
                    className={"p-2.5 rounded-xl border transition cursor-pointer space-y-1.5 " + (
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
                      <span className="text-sm font-black">Bs. {usdtRate.toFixed(2)}</span>
                    </div>
                  </div>

                </div>
                </>
              )}
            </div>

            {/* 2. BOTÓN CENTRO DE MÓDULOS (35) */}
            <div className="relative" ref={toolsHubRef}>
              <button
                onClick={() => setIsToolsHubOpen(!isToolsHubOpen)}
                className={"flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer shadow-xs " + (
                  isToolsHubOpen 
                    ? "bg-purple-600 text-white border-purple-500" 
                    : isDark 
                      ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-850 hover:text-white" 
                      : "bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-100"
                )}
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Módulos ({Object.values(activeModules).filter(Boolean).length})</span>
                <ChevronDown className="w-3 h-3 text-zinc-600 dark:text-zinc-400" />
              </button>

              {/* MEGA MENÚ CATEGORIZADO DE HERRAMIENTAS */}
              {isToolsHubOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[0.5px]" 
                    onClick={(e) => { e.stopPropagation(); setIsToolsHubOpen(false); }} 
                  />
                  <div className={"absolute right-0 top-12 w-[620px] max-w-[95vw] rounded-2xl p-5 shadow-2xl border z-50 animate-in fade-in zoom-in-95 duration-150 " + (
                    isDark ? "bg-zinc-950 border-zinc-850 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"
                  )}>
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-850 pb-3 mb-4">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span>Directorio Maestro de Módulos (AutoLending OS)</span>
                      </h4>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">Módulos operativos configurados y activos</p>
                    </div>
                    <button onClick={() => setIsToolsHubOpen(false)} className="text-zinc-600 dark:text-zinc-400 hover:text-white p-1 rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    
                    {/* COLUMNA 1: FINANZAS & LEGAL */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1.5">
                          💰 Finanzas, Cobranzas & Cripto
                        </span>
                        <div className="space-y-1">
                          {activeModules.loan_restructuring && <button onClick={() => { setIsRestructureModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <RefreshCw className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                            <span>Reestructuración & Refinanciamiento</span>
                          </button>}
                          {activeModules.crypto_reconciliation && <button onClick={() => { setIsCryptoModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>Conciliador Cripto USDT (Binance/TRC-20)</span>
                          </button>}
                          {activeModules.bank_push && <button onClick={() => { setIsBankPushModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Push Bancario & Pagos Cashea</span>
                          </button>}
                          {activeModules.commissions && <button onClick={() => { setIsCommissionsModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <Award className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
                            <span>Comisiones de Asesores & Cobradores</span>
                          </button>}
                          {activeModules.dealers_payable && <button onClick={() => { setIsDealersPayableModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <Store className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Proveedores Flota & Cuentas x Pagar</span>
                          </button>}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-1.5">
                          ⚖️ Legal, Títulos & Forense
                        </span>
                        <div className="space-y-1">
                          {activeModules.digital_dossier && <button onClick={() => { setIsDigitalDossierModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <PackageCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>Expediente Digital Forense (1-Clic)</span>
                          </button>}
                          {activeModules.debt_assignment && <button onClick={() => { setIsDebtModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Cesión de Deuda & Traspaso Tripartito</span>
                          </button>}
                          {activeModules.promissory_otp && <button onClick={() => { setIsPromissoryModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Pagarés Mercantiles OTP (Art. 486)</span>
                          </button>}
                          {activeModules.judicial_collection && <button onClick={() => { setIsJudicialModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <Scale className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                            <span>Cobro Judicial & Costas CPC 640</span>
                          </button>}
                          {activeModules.forensic_audit && <button onClick={() => { setIsForensicModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            <span>Auditoría Forense SHA-256</span>
                          </button>}
                        </div>
                      </div>
                    </div>

                    {/* COLUMNA 2: FLOTA, MARKETING & BI */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-1.5">
                          🛰️ Flota, GPS & Post-Venta
                        </span>
                        <div className="space-y-1">
                          {activeModules.gps_telemetry && <button onClick={() => { setIsGPSModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <Radio className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                            <span>Radar Satelital GPS & Kill-Switch</span>
                          </button>}
                          {activeModules.mechanical_workshop && <button onClick={() => { setIsMaintenanceModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <Wrench className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            <span>Taller & Mantenimientos (500 km)</span>
                          </button>}
                          {activeModules.legal_docs_allied && <button onClick={() => { setIsLegalDocsModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <FolderLock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Docs en 3 Fases & RCV Aliado</span>
                          </button>}
                          {activeModules.field_app_pwa && <button onClick={() => { setIsFieldAppActive(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>App Móvil de Campo (PWA)</span>
                          </button>}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1.5">
                          📈 Estrategia, Clientes & BI
                        </span>
                        <div className="space-y-1">
                          {activeModules.executive_bi && <button onClick={() => { setIsBIModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>BI Ejecutivo & Flujo 30/60/90</span>
                          </button>}
                          {activeModules.credit_scoring && <button onClick={() => { setIsCreditScoringModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <Brain className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Scoring Crediticio Predictivo IA</span>
                          </button>}
                          {activeModules.investor_portal && <button onClick={() => { setIsInvestorModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            <span>Portal del Inversionista (Dividendos)</span>
                          </button>}
                          {activeModules.smart_communications && <button onClick={() => { setIsSmartCommsModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <MessageSquare className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            <span>WhatsApp 1a1 & Notificaciones In-App</span>
                          </button>}
                          {activeModules.promotions_referrals && <button onClick={() => { setIsPromoModalOpen(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <Ticket className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                            <span>Cupones & Programa de Referidos</span>
                          </button>}
                          {activeModules.public_simulator && <button onClick={() => { setIsPublicSimulatorActive(true); setIsToolsHubOpen(false); }} className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center space-x-2 text-zinc-800 dark:text-zinc-200 font-medium">
                            <Calculator className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            <span>Simulador Web Público</span>
                          </button>}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                </>
              )}
            </div>

            {/* CTA PRINCIPAL */}
            {canAccess("CREATE_CLIENT") && (
              <button 
                onClick={() => setIsNewLoanModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Emitir Financiamiento</span>
              </button>
            )}

          </div>
        </header>

        {/* CONTENIDO PRINCIPAL SCROLLEABLE */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-5 sm:space-y-6 pb-24 md:pb-8">
          
          {/* ========================================================================= */}
          {/* 1. SECCIÓN DASHBOARD CON LAS 10 TARJETAS CLICKABLES                       */}
          {/* ========================================================================= */}
          {currentSection === "dashboard" && (
            <div className="space-y-6">
              
              {/* Header de Página */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Dashboard Ejecutivo</h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Resumen de métricas de cartera, 10 indicadores de clientes y salud financiera
                  </p>
                </div>
              </div>

              {/* LAS 10 TARJETAS DE KPIS */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Indicadores de Cartera & Unidades (Clickable Drill-down)
                  </span>
                  <span className="text-[11px] text-google-blue-600 dark:text-google-blue-400 font-semibold cursor-pointer hover:underline">
                    Ver todos los segmentos →
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  
                  {/* 1. EXPIRADOS */}
                  <div 
                    onClick={() => openKpiDrillDown("EXPIRADO")}
                    className={"p-5 rounded-3xl border transition-all duration-200 cursor-pointer space-y-2 group shadow-xs " + (
                      isDark 
                        ? "bg-zinc-900 border-zinc-800 hover:border-red-500/50 hover:bg-red-950/10 hover:shadow-md" 
                        : "bg-white border-zinc-200/90 hover:border-red-400 hover:bg-red-50/20 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center space-x-1.5">
                        <UserX className="w-4 h-4" />
                        <span>EXPIRADOS</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 group-hover:text-red-500 transition">Ver detalle →</span>
                    </div>
                    <h3 className="text-3xl font-extrabold tracking-tight font-mono text-zinc-900 dark:text-zinc-100">
                      {countExpirados}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                      Sin moto &gt;3 meses impagos. Suspendidos permanentes sin retiro.
                    </p>
                  </div>

                  {/* 2. MOROSOS */}
                  <div 
                    onClick={() => openKpiDrillDown("MOROSOS")}
                    className={"p-5 rounded-3xl border transition-all duration-200 cursor-pointer space-y-2 group shadow-xs " + (
                      isDark 
                        ? "bg-zinc-900 border-zinc-800 hover:border-amber-500/50 hover:bg-amber-950/10 hover:shadow-md" 
                        : "bg-white border-zinc-200/90 hover:border-amber-400 hover:bg-amber-50/20 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>MOROSOS</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 group-hover:text-amber-500 transition">Ver detalle →</span>
                    </div>
                    <h3 className="text-3xl font-extrabold tracking-tight font-mono text-amber-500">
                      {countMorosos}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                      Clientes con cuotas vencidas y recargos por mora acumulados.
                    </p>
                  </div>

                  {/* 3. ENTREGADAS */}
                  <div 
                    onClick={() => openKpiDrillDown("ENTREGADAS")}
                    className={"p-5 rounded-3xl border transition-all duration-200 cursor-pointer space-y-2 group shadow-xs " + (
                      isDark 
                        ? "bg-zinc-900 border-zinc-800 hover:border-google-green-500/50 hover:bg-google-green-950/10 hover:shadow-md" 
                        : "bg-white border-zinc-200/90 hover:border-google-green-500 hover:bg-google-green-50/20 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-google-green-600 dark:text-google-green-400 flex items-center space-x-1.5">
                        <Bike className="w-4 h-4" />
                        <span>ENTREGADAS</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 group-hover:text-google-green-500 transition">Ver detalle →</span>
                    </div>
                    <h3 className="text-3xl font-extrabold tracking-tight font-mono text-google-green-600 dark:text-google-green-400">
                      {countEntregadas}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                      Motos/Carros entregados y rodando en calle en posesión del deudor.
                    </p>
                  </div>

                  {/* 4. POR ENTREGAR */}
                  <div 
                    onClick={() => openKpiDrillDown("POR_ENTREGAR")}
                    className={"p-5 rounded-3xl border transition-all duration-200 cursor-pointer space-y-2 group shadow-xs " + (
                      isDark 
                        ? "bg-zinc-900 border-zinc-800 hover:border-google-blue-500/50 hover:bg-google-blue-950/10 hover:shadow-md" 
                        : "bg-white border-zinc-200/90 hover:border-google-blue-500 hover:bg-google-blue-50/20 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-google-blue-600 dark:text-google-blue-400 flex items-center space-x-1.5">
                        <Clock className="w-4 h-4" />
                        <span>POR ENTREGAR</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 group-hover:text-google-blue-500 transition">Ver detalle →</span>
                    </div>
                    <h3 className="text-3xl font-extrabold tracking-tight font-mono text-google-blue-600 dark:text-google-blue-400">
                      {countPorEntregar}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                      Unidades en fase de acumulación de cuotas o trámite.
                    </p>
                  </div>

                </div>

                {/* FILA 2 DE INDICADORES */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-3.5">
                  
                  {/* 5. POR RECUPERAR */}
                  <div 
                    onClick={() => openKpiDrillDown("POR_RECUPERAR")}
                    className={"p-5 rounded-3xl border transition-all duration-200 cursor-pointer space-y-2 group shadow-xs " + (
                      isDark 
                        ? "bg-zinc-900 border-zinc-800 hover:border-rose-500/50 hover:bg-rose-950/10 hover:shadow-md" 
                        : "bg-white border-zinc-200/90 hover:border-rose-400 hover:bg-rose-50/20 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-1.5">
                        <Navigation className="w-4 h-4" />
                        <span>POR RECUPERAR</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 group-hover:text-rose-500 transition">Ver detalle →</span>
                    </div>
                    <h3 className="text-3xl font-extrabold tracking-tight font-mono text-rose-500">
                      {countPorRecuperar}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                      Con moto entregada y &gt;2 meses de atraso. Orden en campo.
                    </p>
                  </div>

                  {/* 6. POR VISITAR */}
                  <div 
                    onClick={() => openKpiDrillDown("POR_VISITAR")}
                    className={"p-5 rounded-3xl border transition-all duration-200 cursor-pointer space-y-2 group shadow-xs " + (
                      isDark 
                        ? "bg-zinc-900 border-zinc-800 hover:border-purple-500/50 hover:bg-purple-950/10 hover:shadow-md" 
                        : "bg-white border-zinc-200/90 hover:border-purple-400 hover:bg-purple-50/20 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center space-x-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>POR VISITAR</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 group-hover:text-purple-500 transition">Ver detalle →</span>
                    </div>
                    <h3 className="text-3xl font-extrabold tracking-tight font-mono text-purple-500">
                      {countPorVisitar}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                      Alcanzaron cuotas para entrega. Visita a vivienda y fiadores.
                    </p>
                  </div>

                  {/* 7. POR REEMBOLSAR */}
                  <div 
                    onClick={() => openKpiDrillDown("POR_REEMBOLSAR")}
                    className={"p-5 rounded-3xl border transition-all duration-200 cursor-pointer space-y-2 group shadow-xs " + (
                      isDark 
                        ? "bg-zinc-900 border-zinc-800 hover:border-cyan-500/50 hover:bg-cyan-950/10 hover:shadow-md" 
                        : "bg-white border-zinc-200/90 hover:border-cyan-400 hover:bg-cyan-50/20 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center space-x-1.5">
                        <DollarSign className="w-4 h-4" />
                        <span>POR REEMBOLSAR</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 group-hover:text-cyan-500 transition">Ver detalle →</span>
                    </div>
                    <h3 className="text-3xl font-extrabold tracking-tight font-mono text-cyan-500">
                      {countPorReembolsar}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                      Aprobados gerencia. Retención 30% gastos / Devolución 70%.
                    </p>
                  </div>

                </div>
              </div>

              {/* BLOQUE DE TOTALES FINANCIEROS */}
              <div>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-3">
                  Consolidado Financiero de Cartera Activa
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  
                  <div 
                    onClick={() => openKpiDrillDown("CUOTAS_X_COBRAR")}
                    className={"p-5 rounded-3xl border transition-all duration-200 cursor-pointer space-y-1 shadow-xs " + (
                      isDark ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:shadow-md" : "bg-white border-zinc-200/90 hover:border-zinc-300 hover:shadow-md"
                    )}
                  >
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">TOTAL CUOTAS POR COBRAR</span>
                    <h3 className="text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100">
                      {"$" + totalCuotasPorCobrarUSD.toLocaleString("es-VE") + " USD"}
                    </h3>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Capital e intereses regulares</p>
                  </div>

                  <div 
                    onClick={() => openKpiDrillDown("MORAS_X_COBRAR")}
                    className={"p-5 rounded-3xl border transition-all duration-200 cursor-pointer space-y-1 shadow-xs " + (
                      isDark ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:shadow-md" : "bg-white border-zinc-200/90 hover:border-zinc-300 hover:shadow-md"
                    )}
                  >
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">TOTAL MORAS POR COBRAR</span>
                    <h3 className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400">
                      {"$" + totalMorasPorCobrarUSD.toLocaleString("es-VE") + " USD"}
                    </h3>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Recargos acumulados por retraso</p>
                  </div>

                  <div 
                    onClick={() => openKpiDrillDown("TOTAL_X_COBRAR")}
                    className={"p-5 rounded-3xl border transition-all duration-200 cursor-pointer space-y-1 shadow-xs " + (
                      isDark ? "bg-google-green-950/20 border-google-green-500/30 hover:border-google-green-500/60 hover:shadow-md" : "bg-google-green-50/50 border-google-green-200 hover:border-google-green-300 hover:shadow-md"
                    )}
                  >
                    <span className="text-xs text-google-green-700 dark:text-google-green-400 font-bold">TOTAL X COBRAR (TODO SUMADO)</span>
                    <h3 className="text-3xl font-black font-mono text-google-green-700 dark:text-google-green-400">
                      {"$" + totalTotalPorCobrarUSD.toLocaleString("es-VE") + " USD"}
                    </h3>
                    <p className="text-[11px] text-google-green-800 dark:text-google-green-300 font-medium">Suma de Cuotas + Moras activas</p>
                  </div>

                </div>
              </div>

              {/* GUARDIÁN DE TESORERÍA */}
              {canAccess("VIEW_TREASURY_VAULT") && (
                <div className={"p-6 rounded-3xl border space-y-4 shadow-xs " + (
                  isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200/90"
                )}>
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Guardián de Bóveda & Runway de Tesorería</h3>
                    </div>
                    <span className="text-[11px] bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full font-semibold">
                      Protegido contra Descapitalización
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                    <div className={"p-4 rounded-2xl border " + (isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                      <span className="text-zinc-700 dark:text-zinc-300 font-semibold block">Bóveda Iniciales Comprometidas</span>
                      <p className="text-xl font-bold font-mono text-amber-700 dark:text-amber-400 mt-1">{"$" + treasuryMetrics.committedDownPaymentsUSD.toLocaleString("es-VE") + " USD"}</p>
                      <p className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-0.5">🔒 Intocable (Reservado ensambladoras)</p>
                    </div>

                    <div className={"p-4 rounded-2xl border " + (isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                      <span className="text-zinc-700 dark:text-zinc-300 font-semibold block">Capital Libre Operativo Real</span>
                      <p className="text-xl font-bold font-mono text-google-green-700 dark:text-google-green-400 mt-1">{"$" + treasuryMetrics.freeOperatingCapitalUSD.toLocaleString("es-VE") + " USD"}</p>
                      <p className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-0.5">Disponible para nómina y gastos</p>
                    </div>

                    <div className={"p-4 rounded-2xl border " + (isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
                      <span className="text-zinc-700 dark:text-zinc-300 font-semibold block">Runway Operativo Real</span>
                      <p className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">{treasuryMetrics.runwayMonths} Meses</p>
                      <p className="text-[10px] text-google-green-700 dark:text-google-green-400 mt-0.5 font-medium">✅ Salud Financiera Protegida</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* SECCIÓN: REPORTERÍA FINANCIERA & SENIAT (MÓDULO 6)                        */}
          {/* ========================================================================= */}
          {currentSection === "financial_reports" && (
            <div className="space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Reportería Financiera & SENIAT</h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Libro de ventas fiscal (Providencia 00071), IGTF 3%, flujo de caja proyectado y balance
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => FinancialReportsEngine.exportToCSV(seniatSales, "Libro_Ventas_SENIAT_" + tenantProfile.rif)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold text-xs px-3.5 py-2 rounded-lg transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar a Excel / CSV</span>
                  </button>
                </div>
              </div>

              {/* Sub-Pestañas Financieras */}
              <div className="flex items-center space-x-1 border-b border-zinc-200 dark:border-zinc-850 pb-1 text-xs">
                {[
                  { id: "SENIAT_SALES", label: "Libro de Ventas SENIAT (IVA + IGTF 3%)", icon: Receipt },
                  { id: "CASH_FLOW", label: "Flujo de Caja Proyectado (12 Meses)", icon: TrendingUp },
                  { id: "BALANCE_SHEET", label: "Balance General & P&L", icon: Scale },
                  { id: "BANK_RECON", label: "Conciliación Bancaria Multi-Moneda", icon: Wallet }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = accountingTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setAccountingTab(tab.id as any)}
                      className={"px-3.5 py-2 rounded-lg font-semibold transition cursor-pointer flex items-center space-x-2 " + (
                        isActive 
                          ? isDark ? "bg-zinc-850 text-white shadow-xs" : "bg-zinc-200 text-zinc-900"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* PESTAÑA 1: LIBRO DE VENTAS SENIAT */}
              {accountingTab === "SENIAT_SALES" && (
                <div className="space-y-4">
                  
                  {/* Resumen Fiscal */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                    <div className={"p-4 rounded-xl border " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200")}>
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold block">BASE IMPONIBLE TOTAL</span>
                      <p className="text-lg font-black font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">{"$" + totalSeniatBaseUSD.toLocaleString("es-VE") + " USD"}</p>
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">≈ {BcvEngine.formatVes(BcvEngine.convertUsdToVes(totalSeniatBaseUSD, bcvRate))}</span>
                    </div>

                    <div className={"p-4 rounded-xl border " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200")}>
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold block">DÉBITO FISCAL IVA 16%</span>
                      <p className="text-lg font-black font-mono text-blue-500 mt-0.5">{"$" + totalSeniatIvaUSD.toLocaleString("es-VE") + " USD"}</p>
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">≈ {BcvEngine.formatVes(BcvEngine.convertUsdToVes(totalSeniatIvaUSD, bcvRate))}</span>
                    </div>

                    <div className={"p-4 rounded-xl border " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200")}>
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold block">IGTF PERCIBIDO 3% (EFECTIVO)</span>
                      <p className="text-lg font-black font-mono text-amber-500 mt-0.5">{"$" + totalSeniatIgtfUSD.toLocaleString("es-VE") + " USD"}</p>
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">≈ {BcvEngine.formatVes(BcvEngine.convertUsdToVes(totalSeniatIgtfUSD, bcvRate))}</span>
                    </div>

                    <div className={"p-4 rounded-xl border " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200")}>
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 uppercase font-bold block">TOTAL FACTURADO CON IMPUESTOS</span>
                      <p className="text-lg font-black font-mono text-emerald-500 mt-0.5">{"$" + totalSeniatFacturadoUSD.toLocaleString("es-VE") + " USD"}</p>
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">≈ {BcvEngine.formatVes(BcvEngine.convertUsdToVes(totalSeniatFacturadoUSD, bcvRate))}</span>
                    </div>
                  </div>

                  {/* Tabla Fiscal */}
                  <div className={"rounded-xl border overflow-x-auto shadow-sm " + (
                    isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200"
                  )}>
                    <table className="w-full text-left text-xs">
                      <thead className={"border-b text-[11px] uppercase font-semibold " + (
                        isDark ? "bg-zinc-900/80 border-zinc-850 text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-600 dark:text-zinc-400"
                      )}>
                        <tr>
                          <th className="p-3">N° Factura / Control</th>
                          <th className="p-3">Fecha</th>
                          <th className="p-3">Cliente & RIF/CI</th>
                          <th className="p-3">Base Imponible ($ / Bs.)</th>
                          <th className="p-3">IVA (16%)</th>
                          <th className="p-3">Método & IGTF (3%)</th>
                          <th className="p-3 text-right">Total Factura</th>
                        </tr>
                      </thead>
                      <tbody className={"divide-y " + (isDark ? "divide-zinc-850" : "divide-zinc-100")}>
                        {seniatSales.map(entry => (
                          <tr key={entry.invoiceNumber} className="hover:bg-zinc-850/20">
                            <td className="p-3">
                              <p className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{entry.invoiceNumber}</p>
                              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Ctrl: {entry.controlNumber}</span>
                            </td>
                            <td className="p-3 font-mono text-zinc-600 dark:text-zinc-400 text-[11px]">{entry.date}</td>
                            <td className="p-3">
                              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{entry.clientName}</p>
                              <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">{entry.clientDocId} • #{entry.contractNumber}</p>
                            </td>
                            <td className="p-3 font-mono">
                              <p className="font-bold text-zinc-900 dark:text-zinc-100">{"$" + entry.baseImponibleUSD.toFixed(2)}</p>
                              <span className="text-[10px] text-zinc-600 dark:text-zinc-400">{BcvEngine.formatVes(entry.baseImponibleVES)}</span>
                            </td>
                            <td className="p-3 font-mono text-blue-500">
                              <p>{"$" + entry.iva16PercentUSD.toFixed(2)}</p>
                              <span className="text-[10px] text-zinc-600 dark:text-zinc-400">{BcvEngine.formatVes(entry.iva16PercentVES)}</span>
                            </td>
                            <td className="p-3">
                              <span className="text-[10px] font-bold block">{entry.paymentMethod}</span>
                              <span className={"text-[10px] font-mono " + (entry.igtf3PercentUSD > 0 ? "text-amber-400 font-bold" : "text-zinc-600 dark:text-zinc-400")}>
                                {entry.igtf3PercentUSD > 0 ? ("IGTF: $" + entry.igtf3PercentUSD.toFixed(2)) : "Exento IGTF"}
                              </span>
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-emerald-500">
                              <p>{"$" + entry.totalInvoiceUSD.toFixed(2)} USD</p>
                              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-normal">{BcvEngine.formatVes(entry.totalInvoiceVES)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* PESTAÑA 2: FLUJO DE CAJA PROYECTADO 12 MESES */}
              {accountingTab === "CASH_FLOW" && (
                <div className="space-y-4">
                  <div className={"rounded-xl border overflow-x-auto shadow-sm " + (
                    isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200"
                  )}>
                    <table className="w-full text-left text-xs">
                      <thead className={"border-b text-[11px] uppercase font-semibold " + (
                        isDark ? "bg-zinc-900/80 border-zinc-850 text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-600 dark:text-zinc-400"
                      )}>
                        <tr>
                          <th className="p-3">Mes Proyectado</th>
                          <th className="p-3">Cobranza Cuotas ($)</th>
                          <th className="p-3">Iniciales Nuevas ($)</th>
                          <th className="p-3">Total Ingresos ($)</th>
                          <th className="p-3">Compras Vehículos ($)</th>
                          <th className="p-3">Gastos Fijos ($)</th>
                          <th className="p-3">Flujo Neto Mes ($)</th>
                          <th className="p-3 text-right">Liquidez Acumulada ($)</th>
                        </tr>
                      </thead>
                      <tbody className={"divide-y " + (isDark ? "divide-zinc-850" : "divide-zinc-100")}>
                        {cashFlowProjections.map(cf => (
                          <tr key={cf.monthName} className="hover:bg-zinc-850/20 font-mono">
                            <td className="p-3 font-sans font-semibold text-zinc-900 dark:text-zinc-100">{cf.monthName}</td>
                            <td className="p-3 text-emerald-400">{"$" + cf.expectedLoanCollectionsUSD.toLocaleString("es-VE")}</td>
                            <td className="p-3 text-emerald-400">{"$" + cf.expectedDownPaymentsUSD.toLocaleString("es-VE")}</td>
                            <td className="p-3 font-bold text-emerald-500">{"$" + cf.totalInflowUSD.toLocaleString("es-VE")}</td>
                            <td className="p-3 text-rose-400">{"-$" + cf.inventoryPurchasesUSD.toLocaleString("es-VE")}</td>
                            <td className="p-3 text-rose-400">{"-$" + cf.fixedOperatingCostsUSD.toLocaleString("es-VE")}</td>
                            <td className={"p-3 font-bold " + (cf.netCashFlowUSD >= 0 ? "text-emerald-400" : "text-rose-400")}>
                              {cf.netCashFlowUSD >= 0 ? ("+$" + cf.netCashFlowUSD.toLocaleString("es-VE")) : ("-$" + Math.abs(cf.netCashFlowUSD).toLocaleString("es-VE"))}
                            </td>
                            <td className="p-3 text-right font-black text-white">
                              {"$" + cf.cumulativeCashUSD.toLocaleString("es-VE")} USD
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PESTAÑA 3: BALANCE GENERAL */}
              {accountingTab === "BALANCE_SHEET" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Activos */}
                  <div className={"p-6 rounded-xl border space-y-4 " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200")}>
                    <div className="border-b border-zinc-200 dark:border-zinc-850 pb-2 flex justify-between items-center">
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase">1. Activos Totales</h3>
                      <strong className="text-emerald-500 font-mono">{"$" + balanceSheet.totalAssetsUSD.toLocaleString("es-VE")} USD</strong>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 uppercase font-sans font-bold">Activo Circulante</p>
                      <div className="flex justify-between pl-2"><span>Efectivo Físico USD:</span><span>{"$" + balanceSheet.currentAssets.cashUSD.toLocaleString("es-VE")}</span></div>
                      <div className="flex justify-between pl-2"><span>Bancos Nacionales (VES en USD):</span><span>{"$" + balanceSheet.currentAssets.bankVESinUSD.toLocaleString("es-VE")}</span></div>
                      <div className="flex justify-between pl-2"><span>Binance Pay (USDT):</span><span>{"$" + balanceSheet.currentAssets.binanceUSDT.toLocaleString("es-VE")}</span></div>
                      <div className="flex justify-between pl-2 text-emerald-400"><span>Cartera Crédito Vigente:</span><span>{"$" + balanceSheet.currentAssets.loanPortfolioActiveUSD.toLocaleString("es-VE")}</span></div>
                      <div className="flex justify-between pl-2 text-amber-400"><span>Cartera en Mora:</span><span>{"$" + balanceSheet.currentAssets.loanPortfolioOverdueUSD.toLocaleString("es-VE")}</span></div>

                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 uppercase font-sans font-bold pt-2">Activo No Circulante</p>
                      <div className="flex justify-between pl-2"><span>Inventario Motos/Carros Patio:</span><span>{"$" + balanceSheet.nonCurrentAssets.vehicleInventoryUSD.toLocaleString("es-VE")}</span></div>
                      <div className="flex justify-between pl-2"><span>Equipos GPS Instalados:</span><span>{"$" + balanceSheet.nonCurrentAssets.gpsEquipmentUSD.toLocaleString("es-VE")}</span></div>
                    </div>
                  </div>

                  {/* Pasivos & Patrimonio */}
                  <div className={"p-6 rounded-xl border space-y-4 " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200")}>
                    <div className="border-b border-zinc-200 dark:border-zinc-850 pb-2 flex justify-between items-center">
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase">2. Pasivo & Patrimonio</h3>
                      <strong className="text-blue-500 font-mono">{"$" + (balanceSheet.liabilities.totalLiabilitiesUSD + balanceSheet.equity.totalEquityUSD).toLocaleString("es-VE")} USD</strong>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 uppercase font-sans font-bold">Pasivo Exigible</p>
                      <div className="flex justify-between pl-2 text-amber-400"><span>Bóveda Iniciales Comprometidas:</span><span>{"$" + balanceSheet.liabilities.committedDownPaymentsVaultUSD.toLocaleString("es-VE")}</span></div>
                      <div className="flex justify-between pl-2"><span>Cuentas por Pagar Concesionarios:</span><span>{"$" + balanceSheet.liabilities.concessionairePayablesUSD.toLocaleString("es-VE")}</span></div>
                      <div className="flex justify-between pl-2"><span>Impuestos SENIAT por Pagar:</span><span>{"$" + balanceSheet.liabilities.seniatTaxesPayableUSD.toLocaleString("es-VE")}</span></div>

                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 uppercase font-sans font-bold pt-2">Patrimonio Neto</p>
                      <div className="flex justify-between pl-2"><span>Capital Social Suscrito:</span><span>{"$" + balanceSheet.equity.capitalStockUSD.toLocaleString("es-VE")}</span></div>
                      <div className="flex justify-between pl-2"><span>Utilidades Retenidas:</span><span>{"$" + balanceSheet.equity.retainedEarningsUSD.toLocaleString("es-VE")}</span></div>
                      <div className="flex justify-between pl-2 text-emerald-400 font-bold"><span>Utilidad Neta del Ejercicio:</span><span>{"$" + balanceSheet.equity.currentPeriodIncomeUSD.toLocaleString("es-VE")}</span></div>
                    </div>
                  </div>

                </div>
              )}

              {/* PESTAÑA 4: CONCILIACIÓN BANCARIA */}
              {accountingTab === "BANK_RECON" && (
                <div className={"p-6 rounded-xl border space-y-4 " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200")}>
                  <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-850 pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Conciliación de Cuentas & Pasarelas</h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Cruce automático de referencias bancarias vs reportes de cobros</p>
                    </div>
                    <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                      ● Conciliado al 100%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                    <div className={"p-3.5 rounded-lg border " + (isDark ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200")}>
                      <span className="text-zinc-600 dark:text-zinc-400 block font-semibold">BANESCO PAGO MÓVIL</span>
                      <p className="font-mono font-bold text-emerald-400 mt-1">42 Operaciones Conciliadas</p>
                      <p className="text-[10px] text-zinc-600 dark:text-zinc-400">Diferencia: $0.00 VES</p>
                    </div>
                    <div className={"p-3.5 rounded-lg border " + (isDark ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200")}>
                      <span className="text-zinc-600 dark:text-zinc-400 block font-semibold">BINANCE PAY (USDT)</span>
                      <p className="font-mono font-bold text-amber-400 mt-1">18 TxID Validados</p>
                      <p className="text-[10px] text-zinc-600 dark:text-zinc-400">Diferencia: 0.00 USDT</p>
                    </div>
                    <div className={"p-3.5 rounded-lg border " + (isDark ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200")}>
                      <span className="text-zinc-600 dark:text-zinc-400 block font-semibold">ARQUEO FÍSICO TAQUILLA</span>
                      <p className="font-mono font-bold text-blue-400 mt-1">Caja Cuadrada Diaria</p>
                      <p className="text-[10px] text-zinc-600 dark:text-zinc-400">Diferencia: $0.00 USD</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. DIRECTORIO DE CLIENTES & AVALES                                         */}
          {/* ========================================================================= */}
          {currentSection === "crm_clients" && (
            <div className="space-y-5">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Directorio de Clientes</h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Expedientes 360°, fiadores solidarios, vehículos y estatus operativo
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsBulkModalOpen(true)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold text-xs px-3.5 py-2 rounded-lg transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-blue-500" />
                    <span>Importar CSV</span>
                  </button>

                  <button
                    onClick={() => openWhatsappModal(undefined, "PREVENTIVE_3_DAYS")}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Disparar WhatsApp</span>
                  </button>

                  {canAccess("CREATE_CLIENT") && (
                    <button 
                      onClick={() => setIsNewClientModalOpen(true)}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold text-xs px-3.5 py-2 rounded-lg transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nuevo Cliente</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Segmented Control Tabs */}
              <div className="flex items-center space-x-1 border-b border-zinc-200 dark:border-zinc-850 pb-1 text-xs">
                {[
                  { id: "ALL", label: "Todos los Clientes", count: contracts.length },
                  { id: "DELIVERED", label: "Entregadas", count: countEntregadas },
                  { id: "PENDING", label: "Por Entregar", count: countPorEntregar },
                  { id: "VISITING", label: "Por Visitar", count: countPorVisitar },
                  { id: "RECOVERY", label: "Por Recuperar", count: countPorRecuperar },
                  { id: "EXPIRED", label: "Expirados", count: countExpirados },
                  { id: "REFUND", label: "Por Reembolsar", count: countPorReembolsar }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setCrmTab(t.id as any)}
                    className={"px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center space-x-1.5 " + (
                      crmTab === t.id 
                        ? isDark ? "bg-zinc-850 text-white font-semibold" : "bg-zinc-200 text-zinc-900 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    )}
                  >
                    <span>{t.label}</span>
                    <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.2 rounded-full">
                      {t.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Barra de Filtros */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-1 items-center space-x-2 min-w-[280px]">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      value={crmSearchTerm}
                      onChange={e => setCrmSearchTerm(e.target.value)}
                      placeholder="Search by name, CI, contract, phone, vehicle..."
                      className={"w-full text-xs rounded-lg pl-9 pr-8 py-2 border focus:outline-none transition " + (
                        isDark 
                          ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-zinc-700" 
                          : "bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400"
                      )}
                    />
                    {crmSearchTerm && (
                      <button 
                        onClick={() => setCrmSearchTerm("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-200"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <select
                    value={crmBrandFilter}
                    onChange={e => setCrmBrandFilter(e.target.value)}
                    className={"text-xs rounded-lg px-2.5 py-2 border focus:outline-none cursor-pointer " + (
                      isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"
                    )}
                  >
                    <option value="TODOS">All Brands</option>
                    {availableCrmBrands.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>

                  <select
                    value={crmOverdueFilter}
                    onChange={e => setCrmOverdueFilter(e.target.value)}
                    className={"text-xs rounded-lg px-2.5 py-2 border focus:outline-none cursor-pointer " + (
                      isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"
                    )}
                  >
                    <option value="TODOS">All Statuses</option>
                    <option value="SIN_MORA">Al Día (Sin Mora)</option>
                    <option value="CON_MORA">Con Mora Activa</option>
                    <option value="MORA_2_MESES">Mora &ge; 2 Meses</option>
                    <option value="MORA_3_MESES">Mora &ge; 3 Meses</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={crmSortBy}
                    onChange={e => setCrmSortBy(e.target.value)}
                    className={"text-xs rounded-lg px-2.5 py-2 border focus:outline-none cursor-pointer " + (
                      isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"
                    )}
                  >
                    <option value="DEFAULT">Sort by: Default</option>
                    <option value="NAME_ASC">Name (A - Z)</option>
                    <option value="OUTSTANDING_DESC">Highest Debt ($)</option>
                    <option value="LATE_FEES_DESC">Highest Late Fees ($)</option>
                    <option value="PROGRESS_DESC">Highest Progress (%)</option>
                  </select>

                  <button 
                    onClick={() => openPrintModal("CONTRACT")}
                    className={"p-2 rounded-lg border transition cursor-pointer " + (
                      isDark ? "border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white" : "border-zinc-200 hover:bg-zinc-100 text-zinc-600"
                    )}
                    title="Exportar en PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tabla ERP B2B */}
              <div className={"rounded-xl border overflow-x-auto shadow-sm " + (
                isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200"
              )}>
                {filteredCrmContracts.length === 0 ? (
                  <div className="p-16 text-center text-zinc-600 dark:text-zinc-400 text-xs space-y-2">
                    <p className="font-semibold">No se encontraron clientes con los filtros aplicados.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className={"border-b text-[11px] font-semibold uppercase tracking-wider " + (
                      isDark ? "bg-zinc-900/80 border-zinc-850 text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-600 dark:text-zinc-400"
                    )}>
                      <tr>
                        <th className="p-3.5">Cliente & Contrato</th>
                        <th className="p-3.5">Fiador Solidario</th>
                        <th className="p-3.5">Vehículo & Precios</th>
                        <th className="p-3.5">Cuotas & Pagos</th>
                        <th className="p-3.5">Estatus Operativo</th>
                        <th className="p-3.5">Progreso</th>
                        <th className="p-3.5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className={"divide-y " + (isDark ? "divide-zinc-850" : "divide-zinc-100")}>
                      {filteredCrmContracts.map(c => (
                        <tr 
                          key={c.id} 
                          className={"transition " + (
                            isDark ? "hover:bg-zinc-850/40" : "hover:bg-zinc-50"
                          )}
                        >
                          <td className="p-3.5 align-middle">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                                {"#" + c.contractNumber}
                              </span>
                              <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">{c.clientName}</strong>
                            </div>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono mt-0.5">
                              {"CI: " + c.clientDocId + " • Tlf: " + c.clientPhone}
                            </p>
                          </td>

                          <td className="p-3.5 align-middle text-zinc-600 dark:text-zinc-300">
                            <p className="font-medium text-xs text-zinc-900 dark:text-zinc-100">{c.guarantor?.name || "Sin fiador"}</p>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">{"CI: " + (c.guarantor?.docId || "N/A")}</p>
                          </td>

                          <td className="p-3.5 align-middle text-zinc-600 dark:text-zinc-300">
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{c.vehicle?.brand} {c.vehicle?.model}</p>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                              Empresa: <strong className="text-emerald-500">{"$" + c.companyPriceUSD + " USD"}</strong> • Dealer: {"$" + c.concessionairePriceUSD}
                            </p>
                          </td>

                          <td className="p-3.5 align-middle">
                            <p className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                              {c.quotasPaidCount}/{c.totalQuotas} Pagadas ({c.quotasPaidPercent}%)
                            </p>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                              Deuda: {"$" + c.totalOutstandingUSD} USD • Mora: {"$" + (c.lateFeesPendingUSD || 0)}
                            </p>
                          </td>

                          <td className="p-3.5 align-middle">
                            <span className={"text-[11px] px-2.5 py-1 rounded-full font-medium inline-flex items-center space-x-1 " + (
                              c.deliveryStatus === "ENTREGADO" 
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                : c.deliveryStatus === "POR_RECUPERAR" || c.status === "POR_RECUPERAR"
                                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                                : c.deliveryStatus === "POR_VISITAR"
                                ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                                : c.status === "EXPIRADO"
                                ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                            )}>
                              <span>●</span>
                              <span>{c.deliveryStatus}</span>
                            </span>
                          </td>

                          <td className="p-3.5 align-middle w-28">
                            <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">{c.overallProgressPercent}%</span>
                            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full mt-1 overflow-hidden">
                              <div 
                                className="bg-emerald-500 h-full rounded-full" 
                                style={{ width: Math.min(100, c.overallProgressPercent) + "%" }} 
                              />
                            </div>
                          </td>

                          <td className="p-3.5 align-middle text-right whitespace-nowrap">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button 
                                onClick={() => openWhatsappModal(c.id, c.lateFeesPendingUSD ? "LATE_FEE_ALERT" : "PREVENTIVE_3_DAYS")}
                                className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer"
                                title="Enviar Notificación por WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>

                              <button 
                                onClick={() => { setSelectedContractId(c.id); openPrintModal("CONTRACT"); }}
                                className={"px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer " + (
                                  isDark ? "border-zinc-800 hover:bg-zinc-800 text-zinc-300" : "border-zinc-200 hover:bg-zinc-100 text-zinc-700"
                                )}
                                title="Contrato Notarial PDF"
                              >
                                Contrato PDF
                              </button>

                              <button 
                                onClick={() => { setSelectedContractId(c.id); setCurrentSection("loan_servicing"); }}
                                className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold text-[11px] px-3 py-1 rounded-lg transition cursor-pointer"
                              >
                                Ver Abonos →
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECCIÓN: CENTRO DE MENSAJERÍA & WHATSAPP                                  */}
          {/* ========================================================================= */}
          {currentSection === "notifs_whatsapp" && (
            <div className="space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Centro de Mensajería & WhatsApp</h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Automatización de recordatorios de cuotas, alertas de morosidad y comprobantes oficiales
                  </p>
                </div>

                <button
                  onClick={() => openWhatsappModal(undefined, "PREVENTIVE_3_DAYS")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>+ Redactar / Disparar Notificación</span>
                </button>
              </div>

              {/* Grid de las 7 Plantillas Disponibles */}
              <div>
                <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-3">
                  Campañas & Plantillas Oficiales Automatizadas (7)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {Object.values(WhatsappNotificationEngine.TEMPLATES).map(t => (
                    <div 
                      key={t.id}
                      className={"p-5 rounded-xl border transition space-y-3 flex flex-col justify-between shadow-xs " + (
                        isDark ? "bg-zinc-900/50 border-zinc-850 hover:border-zinc-750" : "bg-white border-zinc-200 hover:border-zinc-300"
                      )}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={"text-[10px] px-2 py-0.5 rounded-full font-bold uppercase " + (
                            t.category === "PREVENTIVO" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                            t.category === "COBRANZA" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                            t.category === "LEGAL" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                            "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          )}>
                            {t.category}
                          </span>
                          <span className="text-zinc-600 dark:text-zinc-400 text-[10px] font-mono">wa.me ready</span>
                        </div>
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{t.title}</h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.description}</p>
                      </div>

                      <button
                        onClick={() => openWhatsappModal(undefined, t.id)}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold text-xs py-2 rounded-lg transition cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Probar & Disparar Plantilla</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bitácora de Envíos en Vivo */}
              <div className={"p-6 rounded-xl border space-y-4 shadow-sm " + (
                isDark ? "bg-zinc-900/40 border-zinc-850" : "bg-white border-zinc-200"
              )}>
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-850 pb-3">
                  <div className="flex items-center space-x-2">
                    <History className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Últimos Mensajes Disparados</h3>
                  </div>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">Auditoría Inmutable SHA-256</span>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className={"border-b text-[11px] uppercase font-semibold " + (
                      isDark ? "bg-zinc-950 border-zinc-850 text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-600 dark:text-zinc-400"
                    )}>
                      <tr>
                        <th className="p-3">ID / Fecha</th>
                        <th className="p-3">Cliente & Contrato</th>
                        <th className="p-3">Plantilla</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3 text-right">Sello Criptográfico</th>
                      </tr>
                    </thead>
                    <tbody className={"divide-y " + (isDark ? "divide-zinc-850" : "divide-zinc-100")}>
                      {WhatsappNotificationEngine.getLogs().map(log => (
                        <tr key={log.id} className="hover:bg-zinc-850/20">
                          <td className="p-3">
                            <p className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">{log.id}</p>
                            <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">{log.sentAt}</span>
                          </td>
                          <td className="p-3">
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{log.clientName}</p>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">{"#" + log.contractNumber + " • " + log.clientPhone}</p>
                          </td>
                          <td className="p-3">
                            <span className="text-zinc-600 dark:text-zinc-300 font-medium">{log.templateType}</span>
                          </td>
                          <td className="p-3">
                            <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              ● {log.status}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
                            {log.sha256Seal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. INVENTARIO DE VEHÍCULOS                                                */}
          {/* ========================================================================= */}
          {currentSection === "inventory" && (
            <div className="space-y-5">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Inventario de Unidades</h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Motos y carros disponibles en patio, seriales VIN y asignaciones
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsBulkModalOpen(true)}
                    className="p-2 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Importar Flota CSV</span>
                  </button>

                  {canAccess("CREATE_VEHICLE") && (
                    <button 
                      onClick={() => setIsNewVehicleModalOpen(true)}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold text-xs px-3.5 py-2 rounded-lg transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Registrar Unidad</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-1 items-center space-x-2 min-w-[280px]">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      value={invSearchTerm}
                      onChange={e => setInvSearchTerm(e.target.value)}
                      placeholder="Search by brand, model, VIN, plate..."
                      className={"w-full text-xs rounded-lg pl-9 pr-8 py-2 border focus:outline-none transition " + (
                        isDark 
                          ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-zinc-700" 
                          : "bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400"
                      )}
                    />
                  </div>

                  <select
                    value={invTypeFilter}
                    onChange={e => setInvTypeFilter(e.target.value)}
                    className={"text-xs rounded-lg px-2.5 py-2 border focus:outline-none cursor-pointer " + (
                      isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"
                    )}
                  >
                    <option value="TODOS">All Types</option>
                    <option value="MOTO">Motos</option>
                    <option value="CARRO">Carros</option>
                  </select>

                  <select
                    value={invBrandFilter}
                    onChange={e => setInvBrandFilter(e.target.value)}
                    className={"text-xs rounded-lg px-2.5 py-2 border focus:outline-none cursor-pointer " + (
                      isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"
                    )}
                  >
                    <option value="TODOS">All Brands</option>
                    {availableInvBrands.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid de Vehículos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVehicles.map(v => (
                  <div 
                    key={v.id} 
                    className={"p-5 rounded-xl border transition space-y-3 " + (
                      isDark ? "bg-zinc-900/50 border-zinc-850 hover:border-zinc-750" : "bg-white border-zinc-200 hover:border-zinc-300"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100">
                          {v.type === "MOTO" ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">{v.brand} {v.model}</h4>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">Año {v.year} • Color: {v.color}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-md">
                        {v.plate || "Sin Placa"}
                      </span>
                    </div>

                    <div className={"p-3 rounded-lg border text-xs font-mono space-y-1 " + (
                      isDark ? "bg-zinc-950 border-zinc-850 text-zinc-300" : "bg-zinc-50 border-zinc-200 text-zinc-700"
                    )}>
                      <p>VIN: <strong className="text-zinc-900 dark:text-zinc-100">{v.vinChassis}</strong></p>
                      <p>Motor: {v.engineSerial}</p>
                      <p>Costo Ensambladora: {"$" + v.dealerPriceUSD + " USD"} • Retail: <strong className="text-emerald-500">{"$" + v.retailPriceUSD + " USD"}</strong></p>
                    </div>

                    <div className="flex justify-between items-center text-xs text-zinc-600 dark:text-zinc-400 pt-1">
                      <span>Estatus:</span>
                      <span className={"font-semibold " + (
                        v.status === "IN_STOCK" ? "text-emerald-500" : "text-amber-500"
                      )}>
                        ● {v.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. PLAN DE ABONOS & RECAUDACIÓN (TERMINAL)                                */}
          {/* ========================================================================= */}
          {currentSection === "loan_servicing" && (
            <div className="space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Plan de Abonos & Cobranzas</h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Terminal de caja, amortización cuota a cuota e impresión de documentos
                  </p>
                </div>

                <button
                  onClick={() => openWhatsappModal(selectedContract.id, "PREVENTIVE_3_DAYS")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Enviar WhatsApp a Cliente</span>
                </button>
              </div>

              {/* Ficha del Contrato */}
              <div className={"p-6 rounded-xl border space-y-5 " + (
                isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200"
              )}>
                
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 dark:border-zinc-850 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono font-bold text-xs px-2.5 py-1 rounded-md">
                        {"#" + selectedContract.contractNumber}
                      </span>
                      <span className="text-xs font-semibold text-emerald-500">● {selectedContract.status}</span>
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                      {selectedContract.clientName}
                    </h2>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                      {"CI: " + selectedContract.clientDocId + " • Tlf: " + selectedContract.clientPhone + " • " + selectedContract.clientAddress}
                    </p>
                  </div>

                  {/* Acciones PDF Rápidas */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button 
                      onClick={() => openPrintModal("SCHEDULE_PLAN")}
                      className={"px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 " + (
                        isDark ? "border-zinc-800 hover:bg-zinc-800 text-zinc-200" : "border-zinc-200 hover:bg-zinc-100 text-zinc-800"
                      )}
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Cronograma PDF</span>
                    </button>

                    <button 
                      onClick={() => openPrintModal("CONTRACT")}
                      className={"px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 " + (
                        isDark ? "border-zinc-800 hover:bg-zinc-800 text-zinc-200" : "border-zinc-200 hover:bg-zinc-100 text-zinc-800"
                      )}
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span>Contrato Notarial</span>
                    </button>

                    <button 
                      onClick={() => openPrintModal("INTT_DISCLAIMER")}
                      className={"px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 " + (
                        isDark ? "border-zinc-800 hover:bg-zinc-800 text-zinc-200" : "border-zinc-200 hover:bg-zinc-100 text-zinc-800"
                      )}
                    >
                      <FileCheck className="w-3.5 h-3.5 text-purple-500" />
                      <span>Descargo INTT</span>
                    </button>
                  </div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  <div className={"p-3 rounded-lg border " + (isDark ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200")}>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block font-semibold">PRECIO EMPRESA</span>
                    <p className="text-sm font-black font-mono text-emerald-500 mt-0.5">{"$" + selectedContract.companyPriceUSD + " USD"}</p>
                  </div>

                  <div className={"p-3 rounded-lg border " + (isDark ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200")}>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block font-semibold">DEUDA REMANENTE</span>
                    <p className="text-sm font-black font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">{"$" + selectedContract.totalOutstandingUSD + " USD"}</p>
                  </div>

                  <div className={"p-3 rounded-lg border " + (isDark ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200")}>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block font-semibold">MORAS X COBRAR</span>
                    <p className="text-sm font-black font-mono text-amber-500 mt-0.5">{"$" + (selectedContract.lateFeesPendingUSD || 0) + " USD"}</p>
                  </div>

                  <div className={"p-3 rounded-lg border " + (isDark ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200")}>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block font-semibold">CUOTAS PAGADAS</span>
                    <p className="text-sm font-black font-mono text-emerald-500 mt-0.5">{selectedContract.quotasPaidCount}/{selectedContract.totalQuotas}</p>
                  </div>

                  <div className={"p-3 rounded-lg border " + (isDark ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200")}>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block font-semibold">ESTATUS ENTREGA</span>
                    <p className="text-xs font-bold font-mono text-blue-500 mt-0.5">{selectedContract.deliveryStatus}</p>
                  </div>

                  <div className={"p-3 rounded-lg border " + (isDark ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200")}>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 block font-semibold">PROGRESO FINAL</span>
                    <p className="text-sm font-black font-mono text-purple-500 mt-0.5">{selectedContract.overallProgressPercent}%</p>
                  </div>
                </div>

              </div>

              {/* Terminal de Cobro */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                <div className={"lg:col-span-5 p-6 rounded-xl border space-y-4 " + (
                  isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200"
                )}>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Terminal de Recaudación</h3>
                  
                  {canAccess("PROCESS_PAYMENTS") ? (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Seleccionar Contrato</label>
                        <select 
                          value={selectedContractId} 
                          onChange={e => setSelectedContractId(e.target.value)}
                          className={"w-full p-2 rounded-lg border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200")}
                        >
                          {contracts.map(c => (
                            <option key={c.id} value={c.id}>
                              {"#" + c.contractNumber + " - " + c.clientName + " ($" + c.totalOutstandingUSD + " USD pendiente)"}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Monto a Cobrar ($ USD)</label>
                        <input 
                          type="number"
                          value={paymentAmountUSD}
                          onChange={e => setPaymentAmountUSD(Number(e.target.value))}
                          className={"w-full p-2 font-bold font-mono rounded-lg border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200")}
                        />
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-1 block">
                          Equivalente en Tasa Activa: <strong className="text-emerald-500">{BcvEngine.formatVes(BcvEngine.convertUsdToVes(paymentAmountUSD, activeRateValue))}</strong>
                        </span>
                      </div>

                      <div>
                        <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Método</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "PAGO_MOVIL", label: "Pago Móvil" },
                            { id: "BINANCE_USDT", label: "Binance" },
                            { id: "CASH_USD", label: "Efectivo $" }
                          ].map(m => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setPaymentMethod(m.id as any)}
                              className={"p-2 rounded-lg border text-center transition font-bold cursor-pointer " + (
                                paymentMethod === m.id 
                                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" 
                                  : isDark ? "bg-zinc-950 border-zinc-800 text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-600"
                              )}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Referencia Bancaria / TxID</label>
                        <input 
                          type="text"
                          value={paymentReference}
                          onChange={e => setPaymentReference(e.target.value)}
                          className={"w-full p-2 font-mono rounded-lg border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200")}
                        />
                      </div>

                      <button
                        onClick={handleProcessPayment}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold p-2.5 rounded-lg transition shadow-sm cursor-pointer mt-2"
                      >
                        Procesar Recaudo & Despachar WhatsApp
                      </button>
                    </div>
                  ) : (
                    <div className={"p-6 text-center space-y-2 rounded-xl border " + (
                      isDark ? "bg-zinc-950 border-zinc-850" : "bg-slate-50 border-slate-200"
                    )}>
                      <Lock className="w-6 h-6 text-amber-500 mx-auto" />
                      <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100">Terminal Bloqueada para tu Rol</p>
                      <p className="text-[11px] text-slate-600 dark:text-zinc-400">Solo usuarios con rol <strong>CAJERO</strong> o <strong>GERENTE GENERAL</strong> pueden procesar recaudos.</p>
                    </div>
                  )}
                </div>

                {/* Cronograma */}
                <div className={"lg:col-span-7 p-6 rounded-xl border space-y-4 " + (
                  isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200"
                )}>
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-850 pb-3">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Cronograma de Cuotas</h3>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">{(selectedContract.schedule?.length || 0) + " cuotas"}</span>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {(selectedContract.schedule || []).map(q => (
                      <div 
                        key={q.quotaNumber}
                        className={"p-3 rounded-lg border flex justify-between items-center text-xs " + (
                          isDark ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200"
                        )}
                      >
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{"Cuota #" + q.quotaNumber + " • Vence: " + q.dueDate}</p>
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">{"Capital: $" + q.capitalUSD + " • Interés: $" + q.interestUSD}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold font-mono text-zinc-900 dark:text-zinc-100">{"$" + q.totalQuotaUSD + " USD"}</p>
                          <span className={"text-[10px] px-2 py-0.5 rounded-full font-medium inline-block " + (
                            q.status === "PAID" 
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" 
                              : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                          )}>
                            {q.status === "PAID" ? "● PAGADO" : "● PENDIENTE"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. GESTIÓN INTT, CAJA, RETENCIÓN EN CAMPO & SETTINGS                      */}
          {/* ========================================================================= */}
          {currentSection === "intt_legal" && (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Gestión Legal & INTT</h1>
              <div className={"p-6 rounded-xl border space-y-4 " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200")}>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Emisión de finiquitos y descargos legales:</p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openPrintModal("INTT_DISCLAIMER")}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-3.5 py-2 rounded-lg cursor-pointer"
                  >
                    Descargo Legal INTT (PDF)
                  </button>
                  <button 
                    onClick={() => openPrintModal("SETTLEMENT")}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3.5 py-2 rounded-lg cursor-pointer"
                  >
                    Finiquito Notarial (PDF)
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentSection === "field_recovery" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Investigación, Visitas & Campo</h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Coordinación de inspecciones domiciliarias y órdenes de retención vehicular en calle
                  </p>
                </div>

                <button
                  onClick={() => setIsFieldAppActive(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>📲 Abrir App Móvil de Oficiales</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={"p-6 rounded-xl border space-y-3 " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200")}>
                  <div className="flex items-center space-x-2">
                    <FileCheck className="w-5 h-5 text-purple-400" />
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Inspecciones Domiciliarias Registradas</h3>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Verificaciones de domicilio, fiadores y estabilidad para entrega de unidades.</p>
                  <div className="space-y-2 pt-1 font-mono text-xs">
                    {FieldAppEngine.getInspections().map(insp => (
                      <div key={insp.id} className="p-3 bg-zinc-950 rounded-lg border border-zinc-850 space-y-1">
                        <div className="flex justify-between">
                          <strong className="text-white">{insp.clientName}</strong>
                          <span className="text-emerald-400">{insp.dictamen}</span>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-[10px]">Insp: {insp.inspectorName} • {insp.visitDate} • {insp.sha256Seal}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={"p-6 rounded-xl border space-y-3 " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200")}>
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Actas de Retención Física en Campo</h3>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Ejecución de medidas de retención por morosidad grave (&gt; 2 meses).</p>
                  <div className="pt-2">
                    <button 
                      onClick={() => openPrintModal("REPOSSESSION_ACT")}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-3.5 py-2 rounded-lg cursor-pointer"
                    >
                      Imprimir Formato Notarial de Retención (PDF)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentSection === "treasury_cash" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Control de Caja & Arqueo</h1>
                {canAccess("PERFORM_CASHIER_AUDIT") && (
                  <button 
                    onClick={() => setIsCashierModalOpen(true)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold text-xs px-3.5 py-2 rounded-lg cursor-pointer"
                  >
                    Realizar Arqueo Ciego
                  </button>
                )}
              </div>

              {canAccess("PERFORM_CASHIER_AUDIT") || canAccess("VIEW_TREASURY_VAULT") ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={"p-5 rounded-xl border " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200")}>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">Efectivo Físico USD</span>
                    <h3 className="text-2xl font-bold font-mono text-emerald-500 mt-1">$520.00 USD</h3>
                  </div>
                  <div className={"p-5 rounded-xl border " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200")}>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">Pago Móvil (Bs.)</span>
                    <h3 className="text-2xl font-bold font-mono text-blue-500 mt-1">Bs. 24,362.00</h3>
                  </div>
                  <div className={"p-5 rounded-xl border " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200")}>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">Binance Pay (USDT)</span>
                    <h3 className="text-2xl font-bold font-mono text-amber-500 mt-1">$150.00 USDT</h3>
                  </div>
                </div>
              ) : (
                <div className={"p-8 text-center rounded-xl border space-y-2 " + (
                  isDark ? "bg-zinc-900/40 border-zinc-850" : "bg-slate-50 border-slate-200"
                )}>
                  <Lock className="w-6 h-6 text-amber-500 mx-auto" />
                  <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100">Acceso Restringido a Arqueos</p>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400">{"Tu rol (" + userRole + ") no posee privilegios de arqueo de caja."}</p>
                </div>
              )}
            </div>
          )}

          {currentSection === "promotions" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Campañas Promocionales & Cupos</h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Promociones temporizadas, descuentos de inicial y límites de cupos
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePromos.map(p => (
                  <div key={p.id} className={"p-5 rounded-xl border space-y-3 " + (
                    isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200"
                  )}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                          {p.code}
                        </span>
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">{p.title}</h4>
                      </div>
                      <span className="text-xs font-semibold text-emerald-500">● ACTIVA</span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">{p.description}</p>
                    <div className={"p-2.5 rounded-lg border text-xs font-mono " + (
                      isDark ? "bg-zinc-950 border-zinc-850 text-zinc-300" : "bg-zinc-50 border-zinc-200 text-zinc-700"
                    )}>
                      Cupos Restantes: <strong className="text-emerald-500">{p.maxSlots - p.usedSlots}</strong> de {p.maxSlots}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSection === "settings" && (
            <div className="space-y-6">
              
              {/* Header de Configuración */}
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Centro de Configuración & Políticas</h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Parametriza las 7 dimensiones clave de tu financiadora y gestiona los módulos activos del sistema
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsSecurityConfirmModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-md shadow-emerald-900/20 flex items-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>💾 Guardar Políticas & Aplicar Sello</span>
                  </button>
                  <button
                    onClick={() => setIsManageUsersModalOpen(true)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-bold text-xs px-3.5 py-2 rounded-xl cursor-pointer flex items-center space-x-1.5 shadow-sm"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Operadores & Roles</span>
                  </button>
                </div>
              </div>

              {/* Banner de Éxito al Guardar */}
              {configSaveSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>{configSaveSuccess}</span>
                </div>
              )}

              {/* Selector de Pestañas: 1. Las 7 Dimensiones / 2. Gestor de Módulos */}
              <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <button
                  onClick={() => setSettingsActiveTab("DIMENSIONS")}
                  className={"px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-2 " + (
                    settingsActiveTab === "DIMENSIONS"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                  <span>1. Las 7 Dimensiones & Condiciones de Crédito</span>
                </button>
                <button
                  onClick={() => setSettingsActiveTab("MODULES")}
                  className={"px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-2 " + (
                    settingsActiveTab === "MODULES"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>2. Módulos Activos (Feature Flags)</span>
                </button>
              </div>

              {/* ========================================================================= */}
              {/* PESTAÑA 1: LAS 7 DIMENSIONES DE POLÍTICAS DE FINANCIAMIENTO               */}
              {/* ========================================================================= */}
              {settingsActiveTab === "DIMENSIONS" && (
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                    
                    {/* DIMENSIÓN 1: CONDICIONES FINANCIERAS & COBRO */}
                    <div className={"p-5 rounded-2xl border space-y-3.5 " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200 shadow-xs")}>
                      <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <span className="text-base">💰</span>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">1. Condiciones Financieras</h3>
                      </div>
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>% Inicial por Defecto</span><DimensionHelpTooltip text="Monto mínimo en porcentaje que el cliente debe pagar de contado antes de retirar la moto (ej. 30%). Reduce el capital financiado y disminuye el riesgo de pérdida para la financiadora." /></label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={financingConfig.financialTerms.defaultDownPaymentPercent}
                              onChange={e => handleUpdateFinancingConfig(prev => ({
                                ...prev,
                                financialTerms: { ...prev.financialTerms, defaultDownPaymentPercent: Number(e.target.value) }
                              }))}
                              className={"w-full p-2 font-mono font-bold rounded-xl border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                            />
                            <span className="font-bold text-zinc-600 dark:text-zinc-400">%</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Tasa de Interés Anual (%)</span><DimensionHelpTooltip text="Rendimiento financiero anual sobre el capital financiado (ej. 18% anual = 1.5% mensual). Se prorratea equitativamente entre las cuotas del cronograma." /></label>
                          <input
                            type="number"
                            value={financingConfig.financialTerms.defaultAnnualInterestRate}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              financialTerms: { ...prev.financialTerms, defaultAnnualInterestRate: Number(e.target.value) }
                            }))}
                            className={"w-full p-2 font-mono font-bold rounded-xl border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          />
                        </div>

                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Frecuencia de Cobro</span><DimensionHelpTooltip text="Periodicidad de los abonos. Semanal es ideal para delivery y mototaxis de ingresos diarios; Quincenal para asalariados; Mensual para créditos corporativos." /></label>
                          <select
                            value={financingConfig.financialTerms.defaultPaymentFrequency}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              financialTerms: { ...prev.financialTerms, defaultPaymentFrequency: e.target.value as any }
                            }))}
                            className={"w-full p-2 rounded-xl border font-bold " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          >
                            <option value="WEEKLY">Semanal (Recomendado Delivery)</option>
                            <option value="BIWEEKLY">Quincenal (Asalariados)</option>
                            <option value="MONTHLY">Mensual (Corporativo)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Plazo Base (Semanas)</span><DimensionHelpTooltip text="Duración estándar del crédito en semanas (ej. 48 semanas ≈ 11 meses). A mayor plazo, cuotas más bajas pero mayor tiempo de exposición del capital." /></label>
                          <input
                            type="number"
                            value={financingConfig.financialTerms.defaultTermWeeks}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              financialTerms: { ...prev.financialTerms, defaultTermWeeks: Number(e.target.value) }
                            }))}
                            className={"w-full p-2 font-mono font-bold rounded-xl border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          />
                        </div>

                        
                        {/* RÉGIMEN DE MORA POR RETRASO */}
                        <div className="pt-2.5 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                          <label className="text-zinc-700 dark:text-zinc-300 font-bold flex items-center text-[11px]"><span>Régimen de Mora por Retraso</span><DimensionHelpTooltip text="Penalidad aplicada por retraso de pago. Puede configurarse en monto fijo ($ USD) o porcentaje (%) diario, semanal, mensual o fijo por cuota, tras el período de gracia." /></label>
                          
                          {/* Selector Tipo: Monto Fijo ($) vs Porcentaje (%) */}
                          <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <button
                              type="button"
                              onClick={() => handleUpdateFinancingConfig(prev => ({
                                ...prev,
                                financialTerms: {
                                  ...prev.financialTerms,
                                  lateFeeConfig: {
                                    ...prev.financialTerms.lateFeeConfig,
                                    calculationType: "FIXED_USD"
                                  }
                                }
                              }))}
                              className={"py-1 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center justify-center space-x-1 " + (
                                financingConfig.financialTerms.lateFeeConfig.calculationType === "FIXED_USD"
                                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                              )}
                            >
                              <span>💵 Monto Fijo ($)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateFinancingConfig(prev => ({
                                ...prev,
                                financialTerms: {
                                  ...prev.financialTerms,
                                  lateFeeConfig: {
                                    ...prev.financialTerms.lateFeeConfig,
                                    calculationType: "PERCENTAGE"
                                  }
                                }
                              }))}
                              className={"py-1 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center justify-center space-x-1 " + (
                                financingConfig.financialTerms.lateFeeConfig.calculationType === "PERCENTAGE"
                                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                              )}
                            >
                              <span>📊 Porcentaje (%)</span>
                            </button>
                          </div>

                          {/* Valor de la Mora y Unidad de Tiempo */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-zinc-700 dark:text-zinc-400 font-semibold block mb-0.5 text-[10px]">
                                {financingConfig.financialTerms.lateFeeConfig.calculationType === "FIXED_USD" ? "Monto ($ USD)" : "Porcentaje (%)"}
                              </label>
                              <div className="relative flex items-center">
                                <input
                                  type="number"
                                  step="0.1"
                                  value={financingConfig.financialTerms.lateFeeConfig.value}
                                  onChange={e => handleUpdateFinancingConfig(prev => ({
                                    ...prev,
                                    financialTerms: {
                                      ...prev.financialTerms,
                                      lateFeeConfig: {
                                        ...prev.financialTerms.lateFeeConfig,
                                        value: Number(e.target.value)
                                      }
                                    }
                                  }))}
                                  className={"w-full p-2 font-mono font-bold rounded-xl border text-xs " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                                />
                                <span className="absolute right-2.5 font-bold text-zinc-600 dark:text-zinc-400 text-xs">
                                  {financingConfig.financialTerms.lateFeeConfig.calculationType === "FIXED_USD" ? "USD" : "%"}
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="text-zinc-700 dark:text-zinc-400 font-semibold block mb-0.5 text-[10px]">Frecuencia Temporal</label>
                              <select
                                value={financingConfig.financialTerms.lateFeeConfig.frequency}
                                onChange={e => handleUpdateFinancingConfig(prev => ({
                                  ...prev,
                                  financialTerms: {
                                    ...prev.financialTerms,
                                    lateFeeConfig: {
                                      ...prev.financialTerms.lateFeeConfig,
                                      frequency: e.target.value as any
                                    }
                                  }
                                }))}
                                className={"w-full p-2 rounded-xl border font-bold text-xs " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                              >
                                <option value="DAILY">Por Día (Diario)</option>
                                <option value="WEEKLY">Por Semana (Semanal)</option>
                                <option value="MONTHLY">Por Mes (Mensual)</option>
                                <option value="FLAT_PER_QUOTA">Fijo Único por Cuota</option>
                              </select>
                            </div>
                          </div>

                          {/* Días de Gracia sin Mora */}
                          <div>
                            <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-0.5 text-[10px]"><span>Días de Gracia de Pago</span><DimensionHelpTooltip text="Días de tolerancia otorgados al cliente tras el vencimiento de la fecha de pago sin aplicar recargos por mora ni corte de motor." /></label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={financingConfig.financialTerms.lateFeeConfig.graceDaysBeforeFee}
                                onChange={e => handleUpdateFinancingConfig(prev => ({
                                  ...prev,
                                  financialTerms: {
                                    ...prev.financialTerms,
                                    lateFeeConfig: {
                                      ...prev.financialTerms.lateFeeConfig,
                                      graceDaysBeforeFee: Number(e.target.value)
                                    }
                                  }
                                }))}
                                className={"w-full p-2 font-mono font-bold rounded-xl border text-xs " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                              />
                              <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold whitespace-nowrap">días</span>
                            </div>
                          </div>

                          {/* Preview Dinámico de Regla de Mora */}
                          <div className="p-2.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-600 dark:text-zinc-400">
                            <strong className="text-zinc-900 dark:text-zinc-100 block font-semibold mb-0.5">💡 Regla de Mora Configurada:</strong>
                            <span>
                              {financingConfig.financialTerms.lateFeeConfig.calculationType === "FIXED_USD"
                                ? `${financingConfig.financialTerms.lateFeeConfig.value} USD ${
                                    financingConfig.financialTerms.lateFeeConfig.frequency === "DAILY" ? "por cada día de retraso" :
                                    financingConfig.financialTerms.lateFeeConfig.frequency === "WEEKLY" ? "por cada semana de retraso" :
                                    financingConfig.financialTerms.lateFeeConfig.frequency === "MONTHLY" ? "por cada mes de retraso" : "monto fijo por cuota vencida"
                                  }`
                                : `${financingConfig.financialTerms.lateFeeConfig.value}% sobre el saldo de la cuota ${
                                    financingConfig.financialTerms.lateFeeConfig.frequency === "DAILY" ? "por cada día de retraso" :
                                    financingConfig.financialTerms.lateFeeConfig.frequency === "WEEKLY" ? "por cada semana de retraso" :
                                    financingConfig.financialTerms.lateFeeConfig.frequency === "MONTHLY" ? "por cada mes de retraso" : "por cuota vencida"
                                  }`
                              }
                              {financingConfig.financialTerms.lateFeeConfig.graceDaysBeforeFee > 0 
                                ? ` (tras ${financingConfig.financialTerms.lateFeeConfig.graceDaysBeforeFee} días de gracia).`
                                : " (sin días de gracia)."}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DIMENSIÓN 2: POLÍTICAS DE DESPACHO & ENTREGA */}
                    <div className={"p-5 rounded-2xl border space-y-3.5 " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200 shadow-xs")}>
                      <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <span className="text-base">🛵</span>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">2. Políticas de Despacho</h3>
                      </div>
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Régimen de Entrega</span><DimensionHelpTooltip text="Define cuándo se despacha la moto: 1. Llave en mano inmediata (con la inicial), 2. Por cuotas acumuladas (tras pagar 3-4 cuotas puntuales), o 3. Sorteo/Adjudicación programada." /></label>
                          <select
                            value={financingConfig.deliveryPolicy.deliveryPolicyType}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              deliveryPolicy: { ...prev.deliveryPolicy, deliveryPolicyType: e.target.value as any }
                            }))}
                            className={"w-full p-2 rounded-xl border font-bold " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          >
                            <option value="IMMEDIATE">1. Llave en Mano Inmediata (Con Inicial)</option>
                            <option value="ACCUMULATED_QUOTAS">2. Por Cuotas Acumuladas</option>
                            <option value="ADJUDICATION">3. Sorteo / Adjudicación</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Cuotas Exigidas para Despacho</span><DimensionHelpTooltip text="Cantidad de cuotas consecutivas y puntuales requeridas antes de entregar las llaves de la unidad en el régimen de cuotas acumuladas." /></label>
                          <input
                            type="number"
                            value={financingConfig.deliveryPolicy.requiredQuotasToDeliver}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              deliveryPolicy: { ...prev.deliveryPolicy, requiredQuotasToDeliver: Number(e.target.value) }
                            }))}
                            className={"w-full p-2 font-mono font-bold rounded-xl border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          />
                        </div>

                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Score IA Mínimo Entrega Directa</span><DimensionHelpTooltip text="Puntaje mínimo de Scoring Crediticio (0 a 1000 pts) para recibir la moto el mismo día sin esperar acumulación de cuotas previas." /></label>
                          <input
                            type="number"
                            value={financingConfig.deliveryPolicy.minScoreImmediateDelivery}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              deliveryPolicy: { ...prev.deliveryPolicy, minScoreImmediateDelivery: Number(e.target.value) }
                            }))}
                            className={"w-full p-2 font-mono font-bold rounded-xl border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          />
                        </div>

                        <div 
                          onClick={() => handleUpdateFinancingConfig(prev => ({
                            ...prev,
                            deliveryPolicy: { ...prev.deliveryPolicy, requireHomeInspectionBeforeDelivery: !prev.deliveryPolicy.requireHomeInspectionBeforeDelivery }
                          }))}
                          className={"p-3 rounded-xl border cursor-pointer flex items-center justify-between transition " + (
                            financingConfig.deliveryPolicy.requireHomeInspectionBeforeDelivery
                              ? isDark ? "bg-zinc-950 border-emerald-500/40 text-white" : "bg-emerald-50 border-emerald-300 text-zinc-900"
                              : "bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 opacity-60 text-zinc-600 dark:text-zinc-400"
                          )}
                        >
                          <div>
                            <p className="font-bold flex items-center"><span>Inspección Domiciliaria Obligatoria</span><DimensionHelpTooltip text="Requiere que un oficial de campo visite físicamente la vivienda del cliente con la App Móvil PWA antes de autorizar el despacho de la unidad." /></p>
                            <p className="text-[10px] text-zinc-600 dark:text-zinc-400">Oficial visita residencia previa a entrega</p>
                          </div>
                          <div className={"w-7 h-3.5 rounded-full p-0.5 flex items-center " + (
                            financingConfig.deliveryPolicy.requireHomeInspectionBeforeDelivery ? "bg-emerald-500 justify-end" : "bg-zinc-400 dark:bg-zinc-700 justify-start"
                          )}>
                            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DIMENSIÓN 3: MONEDA & RÉGIMEN SENIAT */}
                    <div className={"p-5 rounded-2xl border space-y-3.5 " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200 shadow-xs")}>
                      <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <span className="text-base">🪙</span>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">3. Moneda & Tasa Oficial</h3>
                      </div>
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Tasa de Indexación Primaria</span><DimensionHelpTooltip text="Tasa cambiaria oficial de referencia para convertir las cuotas fijadas en USD a Bolívares al momento del cobro (Dólar BCV, Euro BCV o Binance USDT)." /></label>
                          <select
                            value={financingConfig.currencyAndTaxes.defaultBenchmark}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              currencyAndTaxes: { ...prev.currencyAndTaxes, defaultBenchmark: e.target.value as any }
                            }))}
                            className={"w-full p-2 rounded-xl border font-bold " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          >
                            <option value="USD_BCV">1. Dólar BCV Oficial ($)</option>
                            <option value="EUR_BCV">2. Euro BCV Oficial (€)</option>
                            <option value="USDT_BINANCE">3. Binance USDT (P2P)</option>
                          </select>
                        </div>

                        <div 
                          onClick={() => handleUpdateFinancingConfig(prev => ({
                            ...prev,
                            currencyAndTaxes: { ...prev.currencyAndTaxes, enableSeniatIgtf: !prev.currencyAndTaxes.enableSeniatIgtf }
                          }))}
                          className={"p-3 rounded-xl border cursor-pointer flex items-center justify-between transition " + (
                            financingConfig.currencyAndTaxes.enableSeniatIgtf
                              ? isDark ? "bg-zinc-950 border-blue-500/40 text-white" : "bg-blue-50 border-blue-300 text-zinc-900"
                              : "bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 opacity-60 text-zinc-600 dark:text-zinc-400"
                          )}
                        >
                          <div>
                            <p className="font-bold flex items-center"><span>Cobrar IGTF 3% (SENIAT)</span><DimensionHelpTooltip text="Aplica el 3% de Impuesto a Grandes Transacciones Financieras exigido por el SENIAT exclusivamente cuando el cliente paga en divisas en efectivo (USD Cash)." /></p>
                            <p className="text-[10px] text-zinc-600 dark:text-zinc-400">Aplica a pagos en divisas efectivo</p>
                          </div>
                          <div className={"w-7 h-3.5 rounded-full p-0.5 flex items-center " + (
                            financingConfig.currencyAndTaxes.enableSeniatIgtf ? "bg-blue-500 justify-end" : "bg-zinc-400 dark:bg-zinc-700 justify-start"
                          )}>
                            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                          </div>
                        </div>

                        <div 
                          onClick={() => handleUpdateFinancingConfig(prev => ({
                            ...prev,
                            currencyAndTaxes: { ...prev.currencyAndTaxes, allowCryptoPayments: !prev.currencyAndTaxes.allowCryptoPayments }
                          }))}
                          className={"p-3 rounded-xl border cursor-pointer flex items-center justify-between transition " + (
                            financingConfig.currencyAndTaxes.allowCryptoPayments
                              ? isDark ? "bg-zinc-950 border-amber-500/40 text-white" : "bg-amber-50 border-amber-300 text-zinc-900"
                              : "bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 opacity-60 text-zinc-600 dark:text-zinc-400"
                          )}
                        >
                          <div>
                            <p className="font-bold flex items-center"><span>Aceptar Cripto USDT</span><DimensionHelpTooltip text="Habilita la recepción y conciliación automatizada de pagos mediante Binance Pay (PayID) y depósitos en red Tron (TRC-20)." /></p>
                            <p className="text-[10px] text-zinc-600 dark:text-zinc-400">Binance Pay y Tron TRC-20</p>
                          </div>
                          <div className={"w-7 h-3.5 rounded-full p-0.5 flex items-center " + (
                            financingConfig.currencyAndTaxes.allowCryptoPayments ? "bg-amber-500 justify-end" : "bg-zinc-400 dark:bg-zinc-700 justify-start"
                          )}>
                            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DIMENSIÓN 4: TELEMETRÍA GPS & KILL-SWITCH */}
                    <div className={"p-5 rounded-2xl border space-y-3.5 " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200 shadow-xs")}>
                      <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <span className="text-base">🛰️</span>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">4. Telemetría & Kill-Switch</h3>
                      </div>
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Días de Gracia antes de Apagar Motor</span><DimensionHelpTooltip text="Días de tolerancia tras caer en mora antes de disparar el corte de encendido del motor (Kill-Switch) vía satélite." /></label>
                          <input
                            type="number"
                            value={financingConfig.telemetryGps.graceDaysBeforeKillSwitch}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              telemetryGps: { ...prev.telemetryGps, graceDaysBeforeKillSwitch: Number(e.target.value) }
                            }))}
                            className={"w-full p-2 font-mono font-bold rounded-xl border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          />
                        </div>

                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Límite de Geocerca</span><DimensionHelpTooltip text="Área geográfica autorizada de circulación. Si la moto sale del perímetro permitido (ej. cruce interestatal no autorizado), el radar emite alerta de seguridad inmediata." /></label>
                          <select
                            value={financingConfig.telemetryGps.gpsGeofenceRestriction}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              telemetryGps: { ...prev.telemetryGps, gpsGeofenceRestriction: e.target.value as any }
                            }))}
                            className={"w-full p-2 rounded-xl border font-bold " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          >
                            <option value="NATIONAL_OPEN">Nacional Abierto (Todo el país)</option>
                            <option value="METROPOLITAN_ONLY">Zona Metropolitana Únicamente</option>
                            <option value="STATE_RESTRICTED">Restringido a Estado Local</option>
                          </select>
                        </div>

                        <div 
                          onClick={() => handleUpdateFinancingConfig(prev => ({
                            ...prev,
                            telemetryGps: { ...prev.telemetryGps, autoImmobilizeOnLate: !prev.telemetryGps.autoImmobilizeOnLate }
                          }))}
                          className={"p-3 rounded-xl border cursor-pointer flex items-center justify-between transition " + (
                            financingConfig.telemetryGps.autoImmobilizeOnLate
                              ? isDark ? "bg-zinc-950 border-rose-500/40 text-white" : "bg-rose-50 border-rose-300 text-zinc-900"
                              : "bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 opacity-60 text-zinc-600 dark:text-zinc-400"
                          )}
                        >
                          <div>
                            <p className="font-bold flex items-center"><span>Inmovilización Automática</span><DimensionHelpTooltip text="Apaga el motor automáticamente al vencerse los días de gracia sin requerir que un operador lo haga manualmente desde el centro de comando." /></p>
                            <p className="text-[10px] text-zinc-600 dark:text-zinc-400">Corta encendido cumplida la gracia</p>
                          </div>
                          <div className={"w-7 h-3.5 rounded-full p-0.5 flex items-center " + (
                            financingConfig.telemetryGps.autoImmobilizeOnLate ? "bg-rose-500 justify-end" : "bg-zinc-400 dark:bg-zinc-700 justify-start"
                          )}>
                            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DIMENSIÓN 5: ESTRUCTURA LEGAL & GARANTÍAS */}
                    <div className={"p-5 rounded-2xl border space-y-3.5 " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200 shadow-xs")}>
                      <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <span className="text-base">⚖️</span>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">5. Estructura Legal & Avales</h3>
                      </div>
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Figura de Contrato Notarial</span><DimensionHelpTooltip text="Venta con Reserva de Dominio (la financiadora mantiene el título de propiedad hasta pagar la última cuota) vs Crédito Simple con Pagaré." /></label>
                          <select
                            value={financingConfig.legalFramework.contractLegalType}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              legalFramework: { ...prev.legalFramework, contractLegalType: e.target.value as any }
                            }))}
                            className={"w-full p-2 rounded-xl border font-bold " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          >
                            <option value="RESERVA_DOMINIO">Venta con Reserva de Dominio</option>
                            <option value="CREDITO_SIMPLE_PAGARE">Crédito Simple con Pagaré</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Exigencia de Fiador Solidario</span><DimensionHelpTooltip text="Política para exigir un aval/garante: según Scoring IA (< 700 pts), siempre obligatorio para el 100% de los casos, u opcional." /></label>
                          <select
                            value={financingConfig.legalFramework.requireGuarantorPolicy}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              legalFramework: { ...prev.legalFramework, requireGuarantorPolicy: e.target.value as any }
                            }))}
                            className={"w-full p-2 rounded-xl border font-bold " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          >
                            <option value="SCORE_BASED">Según Score IA (Menor a 700 pts)</option>
                            <option value="ALWAYS_REQUIRED">Siempre Obligatorio (100% de casos)</option>
                            <option value="OPTIONAL">Opcional</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Arancel Traspaso de Deuda ($ USD)</span><DimensionHelpTooltip text="Costo administrativo que cobra la financiadora cuando un deudor cede su contrato a un tercero mediante traspaso tripartito notariado." /></label>
                          <input
                            type="number"
                            value={financingConfig.legalFramework.debtAssignmentTransferFeeUSD}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              legalFramework: { ...prev.legalFramework, debtAssignmentTransferFeeUSD: Number(e.target.value) }
                            }))}
                            className={"w-full p-2 font-mono font-bold rounded-xl border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          />
                        </div>
                      </div>
                    </div>

                    {/* DIMENSIÓN 6 & 7: TALLER & COMISIONES */}
                    <div className={"p-5 rounded-2xl border space-y-3.5 " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200 shadow-xs")}>
                      <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <span className="text-base">🔧</span>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">6 & 7. Taller & Comisiones</h3>
                      </div>
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Kilometraje Primer Mantenimiento (km)</span><DimensionHelpTooltip text="Kilometraje obligatorio fijado por el fabricante para el primer cambio de aceite y revisión preventiva en taller aliado (ej. 500 km)." /></label>
                          <input
                            type="number"
                            value={financingConfig.maintenanceWarranty.mandatoryServiceIntervalKm}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              maintenanceWarranty: { ...prev.maintenanceWarranty, mandatoryServiceIntervalKm: Number(e.target.value) }
                            }))}
                            className={"w-full p-2 font-mono font-bold rounded-xl border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          />
                        </div>

                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Comisión Asesor de Ventas ($ USD)</span><DimensionHelpTooltip text="Bono fijo en dólares que recibe el asesor comercial por cada crédito vehicular formalizado y entregado exitosamente." /></label>
                          <input
                            type="number"
                            value={financingConfig.commissionsAndInvestors.salesAdvisorCommissionPerUnitUSD}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              commissionsAndInvestors: { ...prev.commissionsAndInvestors, salesAdvisorCommissionPerUnitUSD: Number(e.target.value) }
                            }))}
                            className={"w-full p-2 font-mono font-bold rounded-xl border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          />
                        </div>

                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Comisión Cobrador Campo (% Recuperado)</span><DimensionHelpTooltip text="Porcentaje de comisión que percibe el cobrador de calle sobre el dinero recuperado en moras y atrasos." /></label>
                          <input
                            type="number"
                            value={financingConfig.commissionsAndInvestors.fieldCollectorCommissionPercent}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              commissionsAndInvestors: { ...prev.commissionsAndInvestors, fieldCollectorCommissionPercent: Number(e.target.value) }
                            }))}
                            className={"w-full p-2 font-mono font-bold rounded-xl border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          />
                        </div>

                        <div>
                          <label className="text-zinc-700 dark:text-zinc-400 font-semibold flex items-center mb-1"><span>Rendimiento Inversionistas (APY %)</span><DimensionHelpTooltip text="Tasa de rendimiento anual proyectada pagada a los inversionistas que aportan capital para financiar la compra de las motos." /></label>
                          <input
                            type="number"
                            value={financingConfig.commissionsAndInvestors.investorPortfolioAPYPercent}
                            onChange={e => handleUpdateFinancingConfig(prev => ({
                              ...prev,
                              commissionsAndInvestors: { ...prev.commissionsAndInvestors, investorPortfolioAPYPercent: Number(e.target.value) }
                            }))}
                            className={"w-full p-2 font-mono font-bold rounded-xl border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900")}
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* DATOS FISCALES & SELLOS */}
                  <div className={"p-6 rounded-2xl border space-y-4 text-xs " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200")}>
                    <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-850 pb-2">
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        Identidad Legal de la Financiadora & Sello de Auditoría
                      </h3>
                      <span className="font-mono text-zinc-600 dark:text-zinc-400 text-[10px]">
                        Versión #{financingConfig.metadata.version} • {financingConfig.metadata.sha256AuditSeal.slice(0, 24)}...
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Razón Social</label>
                        <input
                          type="text"
                          value={financingConfig.metadata.companyLegalName}
                          onChange={e => handleUpdateFinancingConfig(prev => ({
                            ...prev,
                            metadata: { ...prev.metadata, companyLegalName: e.target.value }
                          }))}
                          className={"w-full p-2.5 rounded-xl border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200")}
                        />
                      </div>
                      <div>
                        <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Nombre Comercial</label>
                        <input
                          type="text"
                          value={financingConfig.metadata.companyCommercialName}
                          onChange={e => handleUpdateFinancingConfig(prev => ({
                            ...prev,
                            metadata: { ...prev.metadata, companyCommercialName: e.target.value }
                          }))}
                          className={"w-full p-2.5 rounded-xl border " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200")}
                        />
                      </div>
                      <div>
                        <label className="text-zinc-700 dark:text-zinc-400 block mb-1">RIF Fiscal</label>
                        <input
                          type="text"
                          value={financingConfig.metadata.rif}
                          onChange={e => handleUpdateFinancingConfig(prev => ({
                            ...prev,
                            metadata: { ...prev.metadata, rif: e.target.value }
                          }))}
                          className={"w-full p-2.5 rounded-xl border font-mono " + (isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200")}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================================= */}
              {/* PESTAÑA 2: GESTOR DE MÓDULOS ACTIVOS (FEATURE FLAGS)                      */}
              {/* ========================================================================= */}
              {settingsActiveTab === "MODULES" && (
                <div className={"p-6 rounded-2xl border space-y-6 " + (isDark ? "bg-zinc-900/50 border-zinc-850" : "bg-white border-zinc-200")}>
                  
                  <div className="border-b border-zinc-200 dark:border-zinc-850 pb-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <div>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Selector de Módulos Activos en el Sistema</h3>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Activa o desactiva módulos para personalizar el menú y herramientas</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setAllModules(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer"
                      >
                        ✓ Activar Todos
                      </button>
                      <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-850 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        {Object.values(activeModules).filter(Boolean).length} de {Object.keys(activeModules).length} activos
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    
                    {/* CATEGORÍA 0: 📌 PESTAÑAS DEL MENÚ LATERAL IZQUIERDO */}
                    <div className="space-y-3 md:col-span-2 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60">
                      <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center space-x-1.5">
                          <span>📌</span>
                          <span>PESTAÑAS DE NAVEGACIÓN (BARRA LATERAL IZQUIERDA)</span>
                        </h4>
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">Control de visibilidad del menú principal</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                        {[
                          { key: "crm_clients", label: "Clientes & Avales", icon: Users, color: "text-blue-500" },
                          { key: "notifs_whatsapp", label: "WhatsApp & Alertas", icon: MessageSquare, color: "text-teal-500" },
                          { key: "financial_reports", label: "Reportería & SENIAT", icon: FileSpreadsheet, color: "text-emerald-500" },
                          { key: "inventory", label: "Inventario de Vehículos", icon: Bike, color: "text-purple-500" },
                          { key: "loan_servicing", label: "Plan de Abonos (Terminal)", icon: DollarSign, color: "text-emerald-500" },
                          { key: "treasury_cash", label: "Caja & Arqueo de Turno", icon: Wallet, color: "text-amber-500" },
                          { key: "intt_legal", label: "Gestión Legal INTT", icon: FileCheck, color: "text-indigo-500" },
                          { key: "field_recovery", label: "Recuperación & Calle", icon: Navigation, color: "text-rose-500" },
                          { key: "promotions", label: "Campañas & Cupos", icon: Tag, color: "text-pink-500" },
                        ].map(item => {
                          const Icon = item.icon;
                          const isEnabled = (activeModules as any)[item.key];
                          return (
                            <div 
                              key={item.key} 
                              onClick={() => toggleModule(item.key as any)}
                              className={"p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between " + (
                                isEnabled 
                                  ? isDark ? "bg-zinc-900 border-blue-500/40 text-white" : "bg-blue-50/50 border-blue-300 text-zinc-900"
                                  : isDark ? "bg-zinc-950/40 border-zinc-850 opacity-40 text-zinc-600 dark:text-zinc-400" : "bg-zinc-100/70 border-zinc-200 opacity-50 text-zinc-400"
                              )}
                            >
                              <div className="flex items-center space-x-2.5 truncate">
                                <Icon className={"w-4 h-4 flex-shrink-0 " + item.color} />
                                <span className="font-semibold truncate text-[11px]">{item.label}</span>
                              </div>
                              <div className={"w-7 h-3.5 rounded-full p-0.5 transition-colors flex items-center " + (
                                isEnabled ? "bg-blue-500 justify-end" : "bg-zinc-400 dark:bg-zinc-700 justify-start"
                              )}>
                                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs"></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* CATEGORÍA 1: 💰 FINANZAS, COBRANZAS & CRIPTO */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                        <span>💰</span>
                        <span>FINANZAS, COBRANZAS & CRIPTO</span>
                      </h4>
                      <div className="space-y-2">
                        {[
                          { key: "loan_restructuring", label: "Reestructuración & Refinanciamiento", icon: RefreshCw, color: "text-orange-500" },
                          { key: "crypto_reconciliation", label: "Conciliador Cripto USDT (Binance/TRC-20)", icon: Coins, color: "text-amber-500" },
                          { key: "bank_push", label: "Push Bancario & Pagos Cashea", icon: Smartphone, color: "text-emerald-500" },
                          { key: "commissions", label: "Comisiones de Asesores & Cobradores", icon: Award, color: "text-yellow-500" },
                          { key: "dealers_payable", label: "Proveedores Flota & Cuentas x Pagar", icon: Store, color: "text-blue-500" },
                        ].map(item => {
                          const Icon = item.icon;
                          const isEnabled = (activeModules as any)[item.key];
                          return (
                            <div 
                              key={item.key} 
                              onClick={() => toggleModule(item.key as any)}
                              className={"p-3 rounded-xl border transition cursor-pointer flex items-center justify-between " + (
                                isEnabled 
                                  ? isDark ? "bg-zinc-950 border-emerald-500/40 text-white" : "bg-emerald-50/40 border-emerald-300 text-zinc-900"
                                  : isDark ? "bg-zinc-950/40 border-zinc-850 opacity-40 text-zinc-600 dark:text-zinc-400" : "bg-zinc-100/70 border-zinc-200 opacity-50 text-zinc-400"
                              )}
                            >
                              <div className="flex items-center space-x-2.5 truncate">
                                <Icon className={"w-4 h-4 " + item.color} />
                                <span className="font-semibold truncate">{item.label}</span>
                              </div>
                              <div className={"w-8 h-4 rounded-full p-0.5 transition-colors flex items-center " + (
                                isEnabled ? "bg-emerald-500 justify-end" : "bg-zinc-400 dark:bg-zinc-700 justify-start"
                              )}>
                                <div className="w-3 h-3 rounded-full bg-white shadow-xs"></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* CATEGORÍA 2: 🛰️ FLOTA, GPS & POST-VENTA */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center space-x-1.5">
                        <span>🛰️</span>
                        <span>FLOTA, GPS & POST-VENTA</span>
                      </h4>
                      <div className="space-y-2">
                        {[
                          { key: "gps_telemetry", label: "Radar Satelital GPS & Kill-Switch", icon: Radio, color: "text-rose-500" },
                          { key: "mechanical_workshop", label: "Taller & Mantenimientos (500 km)", icon: Wrench, color: "text-purple-500" },
                          { key: "legal_docs_allied", label: "Docs en 3 Fases & RCV Aliado", icon: FolderLock, color: "text-blue-500" },
                          { key: "field_app_pwa", label: "App Móvil de Campo (PWA)", icon: Smartphone, color: "text-emerald-500" },
                        ].map(item => {
                          const Icon = item.icon;
                          const isEnabled = (activeModules as any)[item.key];
                          return (
                            <div 
                              key={item.key} 
                              onClick={() => toggleModule(item.key as any)}
                              className={"p-3 rounded-xl border transition cursor-pointer flex items-center justify-between " + (
                                isEnabled 
                                  ? isDark ? "bg-zinc-950 border-rose-500/40 text-white" : "bg-rose-50/40 border-rose-300 text-zinc-900"
                                  : isDark ? "bg-zinc-950/40 border-zinc-850 opacity-40 text-zinc-600 dark:text-zinc-400" : "bg-zinc-100/70 border-zinc-200 opacity-50 text-zinc-400"
                              )}
                            >
                              <div className="flex items-center space-x-2.5 truncate">
                                <Icon className={"w-4 h-4 " + item.color} />
                                <span className="font-semibold truncate">{item.label}</span>
                              </div>
                              <div className={"w-8 h-4 rounded-full p-0.5 transition-colors flex items-center " + (
                                isEnabled ? "bg-rose-500 justify-end" : "bg-zinc-400 dark:bg-zinc-700 justify-start"
                              )}>
                                <div className="w-3 h-3 rounded-full bg-white shadow-xs"></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* CATEGORÍA 3: ⚖️ LEGAL, TÍTULOS & FORENSE */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center space-x-1.5">
                        <span>⚖️</span>
                        <span>LEGAL, TÍTULOS & FORENSE</span>
                      </h4>
                      <div className="space-y-2">
                        {[
                          { key: "digital_dossier", label: "Expediente Digital Forense (1-Clic)", icon: PackageCheck, color: "text-amber-500" },
                          { key: "debt_assignment", label: "Cesión de Deuda & Traspaso Tripartito", icon: UserCheck, color: "text-indigo-500" },
                          { key: "promissory_otp", label: "Pagarés Mercantiles OTP (Art. 486)", icon: FileText, color: "text-emerald-500" },
                          { key: "judicial_collection", label: "Cobro Judicial & Costas CPC 640", icon: Scale, color: "text-rose-500" },
                          { key: "forensic_audit", label: "Auditoría Forense SHA-256", icon: ShieldCheck, color: "text-purple-500" },
                        ].map(item => {
                          const Icon = item.icon;
                          const isEnabled = (activeModules as any)[item.key];
                          return (
                            <div 
                              key={item.key} 
                              onClick={() => toggleModule(item.key as any)}
                              className={"p-3 rounded-xl border transition cursor-pointer flex items-center justify-between " + (
                                isEnabled 
                                  ? isDark ? "bg-zinc-950 border-indigo-500/40 text-white" : "bg-indigo-50/40 border-indigo-300 text-zinc-900"
                                  : isDark ? "bg-zinc-950/40 border-zinc-850 opacity-40 text-zinc-600 dark:text-zinc-400" : "bg-zinc-100/70 border-zinc-200 opacity-50 text-zinc-400"
                              )}
                            >
                              <div className="flex items-center space-x-2.5 truncate">
                                <Icon className={"w-4 h-4 " + item.color} />
                                <span className="font-semibold truncate">{item.label}</span>
                              </div>
                              <div className={"w-8 h-4 rounded-full p-0.5 transition-colors flex items-center " + (
                                isEnabled ? "bg-indigo-500 justify-end" : "bg-zinc-400 dark:bg-zinc-700 justify-start"
                              )}>
                                <div className="w-3 h-3 rounded-full bg-white shadow-xs"></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* CATEGORÍA 4: 📈 ESTRATEGIA, CLIENTES & BI */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center space-x-1.5">
                        <span>📈</span>
                        <span>ESTRATEGIA, CLIENTES & BI</span>
                      </h4>
                      <div className="space-y-2">
                        {[
                          { key: "executive_bi", label: "BI Ejecutivo & Flujo 30/60/90", icon: TrendingUp, color: "text-emerald-500" },
                          { key: "credit_scoring", label: "Scoring Crediticio Predictivo IA", icon: Brain, color: "text-indigo-500" },
                          { key: "investor_portal", label: "Portal del Inversionista (Dividendos)", icon: Building2, color: "text-purple-500" },
                          { key: "smart_communications", label: "WhatsApp 1a1 & Notificaciones In-App", icon: MessageSquare, color: "text-teal-500" },
                          { key: "promotions_referrals", label: "Cupones & Programa de Referidos", icon: Ticket, color: "text-pink-500" },
                          { key: "public_simulator", label: "Simulador Web Público", icon: Calculator, color: "text-purple-500" },
                        ].map(item => {
                          const Icon = item.icon;
                          const isEnabled = (activeModules as any)[item.key];
                          return (
                            <div 
                              key={item.key} 
                              onClick={() => toggleModule(item.key as any)}
                              className={"p-3 rounded-xl border transition cursor-pointer flex items-center justify-between " + (
                                isEnabled 
                                  ? isDark ? "bg-zinc-950 border-purple-500/40 text-white" : "bg-purple-50/40 border-purple-300 text-zinc-900"
                                  : isDark ? "bg-zinc-950/40 border-zinc-850 opacity-40 text-zinc-600 dark:text-zinc-400" : "bg-zinc-100/70 border-zinc-200 opacity-50 text-zinc-400"
                              )}
                            >
                              <div className="flex items-center space-x-2.5 truncate">
                                <Icon className={"w-4 h-4 " + item.color} />
                                <span className="font-semibold truncate">{item.label}</span>
                              </div>
                              <div className={"w-8 h-4 rounded-full p-0.5 transition-colors flex items-center " + (
                                isEnabled ? "bg-purple-500 justify-end" : "bg-zinc-400 dark:bg-zinc-700 justify-start"
                              )}>
                                <div className="w-3 h-3 rounded-full bg-white shadow-xs"></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE SEGURIDAD CRIPTOGRÁFICA */}
      {isSecurityConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={() => setIsSecurityConfirmModalOpen(false)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl w-full max-w-lg p-6 sm:p-7 flex flex-col shadow-2xl shadow-zinc-900/15 overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans space-y-5 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
                    Confirmar Guardado de Políticas
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Sello de Auditoría Criptográfica & Autorización Gerencial
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsSecurityConfirmModalOpen(false)}
                className="p-1.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs">
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                Resumen de Impacto en el Sistema:
              </p>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                <li>Inicial base: <strong>{financingConfig.financialTerms.defaultDownPaymentPercent}%</strong> • Interés: <strong>{financingConfig.financialTerms.defaultAnnualInterestRate}%</strong> • Mora: <strong>{financingConfig.financialTerms.lateFeeConfig.calculationType === "FIXED_USD" ? "$" + financingConfig.financialTerms.lateFeeConfig.value + " USD" : financingConfig.financialTerms.lateFeeConfig.value + "%"} ({financingConfig.financialTerms.lateFeeConfig.frequency.toLowerCase()})</strong></li>
                <li>Régimen de Entrega: <strong>{financingConfig.deliveryPolicy.deliveryPolicyType}</strong> (Hito: {financingConfig.deliveryPolicy.requiredQuotasToDeliver} cuotas)</li>
                <li>Moneda: <strong>{financingConfig.currencyAndTaxes.defaultBenchmark}</strong> • Gracia GPS: <strong>{financingConfig.telemetryGps.graceDaysBeforeKillSwitch} días</strong></li>
                <li>Arancel de Traspaso: <strong>${financingConfig.legalFramework.debtAssignmentTransferFeeUSD} USD</strong> • APY: <strong>{financingConfig.commissionsAndInvestors.investorPortfolioAPYPercent}%</strong></li>
              </ul>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <span>Autorizado por: <strong className="text-emerald-500">{userRole.replace("_", " ")}</strong></span>
              <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">SHA-256 Enabled</span>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSecurityConfirmModalOpen(false)}
                className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-zinc-300 font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSaveConfig}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-emerald-950/30 cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar & Aplicar</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* MODALES INTERACTIVOS */}
      <DebtAssignmentModal
        isOpen={isDebtModalOpen}
        onClose={() => setIsDebtModalOpen(false)}
        contracts={contracts}
        bcvRate={bcvRate}
      />

      <PromotionsReferralsModal
        isOpen={isPromoModalOpen}
        onClose={() => setIsPromoModalOpen(false)}
        bcvRate={bcvRate}
      />

      <LoanRestructuringModal
        isOpen={isRestructureModalOpen}
        onClose={() => setIsRestructureModalOpen(false)}
        contracts={contracts}
        bcvRate={bcvRate}
      />

      <CryptoReconciliationModal
        isOpen={isCryptoModalOpen}
        onClose={() => setIsCryptoModalOpen(false)}
        contracts={contracts}
        bcvRate={bcvRate}
      />

      <InvestorPortalModal
        isOpen={isInvestorModalOpen}
        onClose={() => setIsInvestorModalOpen(false)}
        bcvRate={bcvRate}
      />

      <DigitalDossierModal
        isOpen={isDigitalDossierModalOpen}
        onClose={() => setIsDigitalDossierModalOpen(false)}
        contracts={contracts}
        bcvRate={bcvRate}
      />

      <SmartCommunicationsModal
        isOpen={isSmartCommsModalOpen}
        onClose={() => setIsSmartCommsModalOpen(false)}
        contracts={contracts}
        bcvRate={bcvRate}
      />

      <ExecutiveBIModal
        isOpen={isBIModalOpen}
        onClose={() => setIsBIModalOpen(false)}
        contracts={contracts}
        bcvRate={bcvRate}
      />

      <LegalDocsAndAlliedModal
        isOpen={isLegalDocsModalOpen}
        onClose={() => setIsLegalDocsModalOpen(false)}
      />

      <GPSCommandCenterModal
        isOpen={isGPSModalOpen}
        onClose={() => setIsGPSModalOpen(false)}
      />

      <CreditScoringModal
        isOpen={isCreditScoringModalOpen}
        onClose={() => setIsCreditScoringModalOpen(false)}
      />

      <MaintenanceWarrantyModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
      />

      <CommissionsModal
        isOpen={isCommissionsModalOpen}
        onClose={() => setIsCommissionsModalOpen(false)}
        bcvRate={bcvRate}
      />

      <BankPushReconciliationModal
        isOpen={isBankPushModalOpen}
        onClose={() => setIsBankPushModalOpen(false)}
        onPaymentApproved={() => setContracts(LocalDB.getAllContracts())}
      />

      <DealersPayableModal
        isOpen={isDealersPayableModalOpen}
        onClose={() => setIsDealersPayableModalOpen(false)}
      />

      <PromissoryNoteModal
        isOpen={isPromissoryModalOpen}
        onClose={() => setIsPromissoryModalOpen(false)}
        contracts={contracts}
        initialContractNumber={selectedContract?.contractNumber}
      />

      <JudicialCollectionModal
        isOpen={isJudicialModalOpen}
        onClose={() => setIsJudicialModalOpen(false)}
        contracts={contracts}
        bcvRate={bcvRate}
      />

      <ForensicAuditModal
        isOpen={isForensicModalOpen}
        onClose={() => setIsForensicModalOpen(false)}
      />

      <TelematicsGpsModal
        isOpen={isTelematicsModalOpen}
        onClose={() => setIsTelematicsModalOpen(false)}
      />

      <BulkDataModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onDataImported={() => setContracts(LocalDB.getAllContracts())}
      />

      <WhatsappBroadcastModal
        isOpen={isWhatsappModalOpen}
        onClose={() => setIsWhatsappModalOpen(false)}
        contracts={contracts}
        initialContract={selectedContract}
        initialTemplate={whatsappInitialTemplate}
        bcvRate={bcvRate}
      />

      <ManageUsersModal
        isOpen={isManageUsersModalOpen}
        onClose={() => setIsManageUsersModalOpen(false)}
        currentUserRole={userRole}
        onUserRoleChange={(newRole) => setUserRole(newRole)}
      />

      <KpiDrillDownModal 
        isOpen={isKpiModalOpen}
        onClose={() => setIsKpiModalOpen(false)}
        kpiType={selectedKpi}
        contracts={contracts}
        onSelectContract={(contractId) => setSelectedContractId(contractId)}
        onNavigateToSection={(section) => setCurrentSection(section)}
        onOpenPrintDoc={(type, contractId) => {
          setSelectedContractId(contractId);
          openPrintModal(type);
        }}
      />

      <NewClientModal 
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onClientCreated={(newContract) => {
          setContracts(LocalDB.getAllContracts());
          setSelectedContractId(newContract.id);
        }}
      />

      <NewVehicleModal 
        isOpen={isNewVehicleModalOpen}
        onClose={() => setIsNewVehicleModalOpen(false)}
        onVehicleCreated={() => {
          setVehicles(LocalDB.getAllVehicles());
        }}
      />

      <NewLoanModal 
        isOpen={isNewLoanModalOpen}
        onClose={() => setIsNewLoanModalOpen(false)}
        onLoanCreated={(newContract) => {
          setContracts(LocalDB.getAllContracts());
          setSelectedContractId(newContract.id);
          setCurrentSection("loan_servicing");
        }}
      />

      <CashierShiftModal 
        isOpen={isCashierModalOpen}
        onClose={() => setIsCashierModalOpen(false)}
        onAuditCompleted={(auditResult) => {
          setCashierAuditResult(auditResult);
        }}
      />

      <PrintDocumentModal 
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        docType={printDocType}
        contract={selectedContract}
        receiptData={printReceiptData}
        bcvRate={bcvRate}
      />
    </div>
  );
}
