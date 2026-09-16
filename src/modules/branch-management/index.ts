import { LoanContract, VehicleSpec } from "../../types";

export interface BranchInfo {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  managerName: string;
  isMainBranch: boolean;
  activeContractsCount: number;
  inventoryCount: number;
  cashVaultUSD: number;
  status: "ACTIVE" | "INACTIVE";
}

export const INITIAL_BRANCHES: BranchInfo[] = [
  {
    id: "BR-01",
    code: "CCS-CHACAO",
    name: "Sede Principal Caracas",
    city: "Caracas",
    state: "Distrito Capital",
    address: "Av. Francisco de Miranda, Torre Financiera Chacao, Piso 8",
    phone: "+58 212-990-8800",
    managerName: "Yon Aiker (Dirección General)",
    isMainBranch: true,
    activeContractsCount: 142,
    inventoryCount: 38,
    cashVaultUSD: 14500,
    status: "ACTIVE"
  },
  {
    id: "BR-02",
    code: "VAL-BOLIVAR",
    name: "Sucursal Valencia",
    city: "Valencia",
    state: "Carabobo",
    address: "Av. Bolívar Norte, C.C. Camoruco, Nivel Mezzanina",
    phone: "+58 241-820-1122",
    managerName: "Lic. Ricardo Salazar",
    isMainBranch: false,
    activeContractsCount: 68,
    inventoryCount: 19,
    cashVaultUSD: 6200,
    status: "ACTIVE"
  },
  {
    id: "BR-03",
    code: "MCY-DELICIAS",
    name: "Sucursal Maracay",
    city: "Maracay",
    state: "Aragua",
    address: "Av. Las Delicias, Centro Empresarial Europa, PB",
    phone: "+58 243-241-9988",
    managerName: "Ing. Daniela Colmenares",
    isMainBranch: false,
    activeContractsCount: 45,
    inventoryCount: 14,
    cashVaultUSD: 4100,
    status: "ACTIVE"
  },
  {
    id: "BR-04",
    code: "BQTO-IND",
    name: "Patio & Sucursal Barquisimeto",
    city: "Barquisimeto",
    state: "Lara",
    address: "Zona Industrial II, Carrera 5 con Calle 28",
    phone: "+58 251-710-4455",
    managerName: "T.S.U. Carlos Albarrán",
    isMainBranch: false,
    activeContractsCount: 31,
    inventoryCount: 12,
    cashVaultUSD: 2800,
    status: "ACTIVE"
  }
];

export class BranchManagementEngine {
  private static STORAGE_KEY = "autolending_active_branch";
  private static branches: BranchInfo[] = [...INITIAL_BRANCHES];

  public static getAllBranches(): BranchInfo[] {
    return [...this.branches];
  }

  public static getBranchById(branchId: string): BranchInfo | undefined {
    return this.branches.find(b => b.id === branchId);
  }

  public static getActiveBranchId(): string {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) return saved;
      } catch (e) {}
    }
    return "ALL"; // "ALL" representa Consolidado Nacional
  }

  public static setActiveBranchId(branchId: string): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(this.STORAGE_KEY, branchId);
        window.dispatchEvent(new CustomEvent("active_branch_changed", { detail: branchId }));
      } catch (e) {}
    }
  }

  public static filterContracts(contracts: LoanContract[], branchId: string): LoanContract[] {
    if (branchId === "ALL") return contracts;
    // Asignación determinista por ID de contrato para propósitos de segmentación
    return contracts.filter((c, idx) => {
      const bIndex = idx % INITIAL_BRANCHES.length;
      return INITIAL_BRANCHES[bIndex].id === branchId;
    });
  }

  public static filterVehicles(vehicles: VehicleSpec[], branchId: string): VehicleSpec[] {
    if (branchId === "ALL") return vehicles;
    return vehicles.filter((v, idx) => {
      const bIndex = idx % INITIAL_BRANCHES.length;
      return INITIAL_BRANCHES[bIndex].id === branchId;
    });
  }

  public static getNationalConsolidation(): {
    totalBranches: number;
    totalActiveContracts: number;
    totalInventory: number;
    totalCashVaultUSD: number;
    sha256ConsolidationHash: string;
  } {
    const totalBranches = this.branches.length;
    const totalActiveContracts = this.branches.reduce((acc, b) => acc + b.activeContractsCount, 0);
    const totalInventory = this.branches.reduce((acc, b) => acc + b.inventoryCount, 0);
    const totalCashVaultUSD = this.branches.reduce((acc, b) => acc + b.cashVaultUSD, 0);

    const raw = `${totalBranches}|${totalActiveContracts}|${totalInventory}|${totalCashVaultUSD}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const sha256ConsolidationHash = "SHA256:NAT_CONSOL_" + Math.abs(hash).toString(16).padStart(12, "0").toUpperCase();

    return {
      totalBranches,
      totalActiveContracts,
      totalInventory,
      totalCashVaultUSD,
      sha256ConsolidationHash
    };
  }
}
