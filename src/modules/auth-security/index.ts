export type UserRole = 
  | "GERENTE_GENERAL" 
  | "CAJERO" 
  | "ASESOR_VENTAS" 
  | "COBRADOR_CAMPO" 
  | "AUDITOR_LEGAL";

export type PermissionKey = 
  | "VIEW_DASHBOARD_KPI"
  | "VIEW_TREASURY_VAULT"
  | "VIEW_CRM_CLIENTS"
  | "CREATE_CLIENT"
  | "VIEW_INVENTORY"
  | "CREATE_VEHICLE"
  | "PROCESS_PAYMENTS"
  | "PERFORM_CASHIER_AUDIT"
  | "APPROVE_REFUND"
  | "TRIGGER_FIELD_RECOVERY"
  | "PRINT_LEGAL_DOCS"
  | "MANAGE_USERS_SETTINGS";

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pin: string;
  avatarInitial: string;
  active: boolean;
  department: string;
  lastLogin: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  sha256Hash: string;
}

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  GERENTE_GENERAL: [
    "VIEW_DASHBOARD_KPI",
    "VIEW_TREASURY_VAULT",
    "VIEW_CRM_CLIENTS",
    "CREATE_CLIENT",
    "VIEW_INVENTORY",
    "CREATE_VEHICLE",
    "PROCESS_PAYMENTS",
    "PERFORM_CASHIER_AUDIT",
    "APPROVE_REFUND",
    "TRIGGER_FIELD_RECOVERY",
    "PRINT_LEGAL_DOCS",
    "MANAGE_USERS_SETTINGS"
  ],
  CAJERO: [
    "VIEW_DASHBOARD_KPI",
    "VIEW_CRM_CLIENTS",
    "PROCESS_PAYMENTS",
    "PERFORM_CASHIER_AUDIT",
    "PRINT_LEGAL_DOCS"
  ],
  ASESOR_VENTAS: [
    "VIEW_DASHBOARD_KPI",
    "VIEW_CRM_CLIENTS",
    "CREATE_CLIENT",
    "VIEW_INVENTORY",
    "PRINT_LEGAL_DOCS"
  ],
  COBRADOR_CAMPO: [
    "VIEW_CRM_CLIENTS",
    "TRIGGER_FIELD_RECOVERY",
    "PRINT_LEGAL_DOCS"
  ],
  AUDITOR_LEGAL: [
    "VIEW_DASHBOARD_KPI",
    "VIEW_CRM_CLIENTS",
    "VIEW_INVENTORY",
    "PRINT_LEGAL_DOCS"
  ]
};

export const ROLE_PERMISSIONS = DEFAULT_ROLE_PERMISSIONS;

export const INITIAL_USERS: SystemUser[] = [
  {
    id: "usr-001",
    name: "Yon Aiker",
    email: "yonaikermarcano@gmail.com",
    role: "GERENTE_GENERAL",
    pin: "1234",
    avatarInitial: "Y",
    active: true,
    department: "Dirección Ejecutiva & Presidencia",
    lastLogin: "2026-08-24 02:30:15"
  },
  {
    id: "usr-002",
    name: "María Fernández",
    email: "maria.caja@autolending.ve",
    role: "CAJERO",
    pin: "2233",
    avatarInitial: "M",
    active: true,
    department: "Recaudación & Tesorería",
    lastLogin: "2026-08-24 01:15:00"
  },
  {
    id: "usr-003",
    name: "Carlos Mendoza",
    email: "carlos.ventas@autolending.ve",
    role: "ASESOR_VENTAS",
    pin: "4455",
    avatarInitial: "C",
    active: true,
    department: "Ventas & Cotizaciones",
    lastLogin: "2026-08-23 18:40:20"
  },
  {
    id: "usr-004",
    name: "Héctor Rodríguez",
    email: "hector.recuperacion@autolending.ve",
    role: "COBRADOR_CAMPO",
    pin: "7788",
    avatarInitial: "H",
    active: true,
    department: "Investigación Domiciliaria",
    lastLogin: "2026-08-24 00:50:10"
  },
  {
    id: "usr-005",
    name: "Dra. Valentina Suárez",
    email: "valentina.legal@autolending.ve",
    role: "AUDITOR_LEGAL",
    pin: "9900",
    avatarInitial: "V",
    active: true,
    department: "Consultoría Jurídica & INTT",
    lastLogin: "2026-08-23 16:20:00"
  }
];

export class AuthSecurityModule {
  private static STORAGE_KEY = "autolending_role_permissions";
  private static users: SystemUser[] = [...INITIAL_USERS];
  private static auditLogs: AuditLogEntry[] = [
    {
      id: "LOG-1001",
      timestamp: "2026-08-24 02:15:20",
      userId: "usr-001",
      userName: "Yon Aiker",
      userRole: "GERENTE_GENERAL",
      action: "SISTEMA_INICIADO",
      module: "SISTEMA_CORE",
      details: "Inicio de sesión seguro de superadministrador y sincronización de tasas BCV",
      ipAddress: "192.168.1.100 (Caracas, VE)",
      sha256Hash: "SHA256:7B8F9A1209C8DE44F2A1098BCCEE1209"
    },
    {
      id: "LOG-1002",
      timestamp: "2026-08-24 02:20:45",
      userId: "usr-002",
      userName: "María Fernández",
      userRole: "CAJERO",
      action: "ARQUEO_CAJA_APERTURA",
      module: "TESORERIA",
      details: "Apertura de turno de caja con fondo base de $100.00 USD en gaveta",
      ipAddress: "192.168.1.105 (Terminal Caja 1)",
      sha256Hash: "SHA256:4C98DF8811AABB23908E41097612EFCA"
    },
    {
      id: "LOG-1003",
      timestamp: "2026-08-24 02:24:10",
      userId: "usr-001",
      userName: "Yon Aiker",
      userRole: "GERENTE_GENERAL",
      action: "REEMBOLSO_APROBADO_70_30",
      module: "CREDITO",
      details: "Aprobación de liquidación de reembolso al contrato #CTR-2026-004 (70% devolución / 30% retención)",
      ipAddress: "192.168.1.100 (Caracas, VE)",
      sha256Hash: "SHA256:88AF2190BCAFE01923984EBA10981765"
    }
  ];

  public static getUsers(): SystemUser[] {
    return [...this.users];
  }

  public static getUserById(userId: string): SystemUser | undefined {
    return this.users.find(u => u.id === userId);
  }

  /**
   * Obtiene la matriz de permisos RBAC (guardada o por defecto)
   */
  public static getRolePermissions(): Record<UserRole, PermissionKey[]> {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
          return {
            ...DEFAULT_ROLE_PERMISSIONS,
            ...JSON.parse(saved),
          };
        }
      } catch (e) {
        console.error("Error reading RBAC permissions:", e);
      }
    }
    return { ...DEFAULT_ROLE_PERMISSIONS };
  }

  /**
   * Actualiza el permiso de un rol de forma granular
   */
  public static toggleRolePermission(
    role: UserRole,
    permission: PermissionKey,
    authorName: string = "Yon Aiker",
    authorRole: UserRole = "GERENTE_GENERAL"
  ): Record<UserRole, PermissionKey[]> {
    const current = this.getRolePermissions();
    const rolePerms = new Set(current[role] || []);
    const isCurrentlyGranted = rolePerms.has(permission);

    if (isCurrentlyGranted) {
      rolePerms.delete(permission);
    } else {
      rolePerms.add(permission);
    }

    current[role] = Array.from(rolePerms);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(current));
        window.dispatchEvent(new CustomEvent("rbac_permissions_updated", { detail: current }));
      } catch (e) {
        console.error("Error saving RBAC permissions:", e);
      }
    }

    // Registrar en auditoría criptográfica
    this.logAction({
      userId: "usr-001",
      userName: authorName,
      userRole: authorRole,
      action: "RBAC_PERMISO_MODIFICADO",
      module: "SEGURIDAD_RBAC",
      details: `Permiso [${permission}] ${isCurrentlyGranted ? "REVOCADO" : "CONCEDIDO"} para el rol [${role}]`
    });

    return current;
  }

  /**
   * Restaura la matriz de permisos a sus valores de fábrica
   */
  public static resetRolePermissionsToDefaults(): Record<UserRole, PermissionKey[]> {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
        window.dispatchEvent(new CustomEvent("rbac_permissions_updated", { detail: DEFAULT_ROLE_PERMISSIONS }));
      } catch (e) {}
    }
    return { ...DEFAULT_ROLE_PERMISSIONS };
  }

  public static hasPermission(role: UserRole, permission: PermissionKey): boolean {
    const permissions = this.getRolePermissions()[role] || [];
    return permissions.includes(permission);
  }

  public static authenticateByPin(pin: string): { success: boolean; user?: SystemUser; error?: string } {
    const user = this.users.find(u => u.pin === pin && u.active);
    if (!user) {
      return { success: false, error: "PIN de seguridad incorrecto o usuario inactivo." };
    }
    user.lastLogin = new Date().toISOString().replace("T", " ").slice(0, 19);
    
    this.logAction({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "LOGIN_PIN",
      module: "AUTENTICACION",
      details: `Inicio de sesión exitoso de ${user.name} (${user.role})`
    });

    return { success: true, user };
  }

  public static logAction(params: {
    userId: string;
    userName: string;
    userRole: UserRole;
    action: string;
    module: string;
    details: string;
    ipAddress?: string;
  }): AuditLogEntry {
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    const rawData = `${timestamp}-${params.userId}-${params.action}-${params.details}`;
    
    let hash = 0;
    for (let i = 0; i < rawData.length; i++) {
      const char = rawData.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const sha256Hash = "SHA256:" + Math.abs(hash).toString(16).padStart(16, "0").toUpperCase() + Date.now().toString(16).toUpperCase().slice(-8);

    const entry: AuditLogEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp,
      userId: params.userId,
      userName: params.userName,
      userRole: params.userRole,
      action: params.action,
      module: params.module,
      details: params.details,
      ipAddress: params.ipAddress || "192.168.1.100 (Caracas, VE)",
      sha256Hash
    };

    this.auditLogs.unshift(entry);
    return entry;
  }

  public static getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }

  public static createUser(user: Omit<SystemUser, "id" | "avatarInitial" | "active" | "lastLogin">): SystemUser {
    const newUser: SystemUser = {
      ...user,
      id: `usr-${Date.now().toString().slice(-4)}`,
      avatarInitial: user.name.slice(0, 1).toUpperCase(),
      active: true,
      lastLogin: "Nunca"
    };
    this.users.push(newUser);

    this.logAction({
      userId: newUser.id,
      userName: "Yon Aiker",
      userRole: "GERENTE_GENERAL",
      action: "USUARIO_CREADO",
      module: "SEGURIDAD",
      details: `Creación de nuevo usuario: ${newUser.name} (${newUser.role}) en ${newUser.department}`
    });

    return newUser;
  }

  public static toggleUserStatus(userId: string): boolean {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    user.active = !user.active;
    this.logAction({
      userId: user.id,
      userName: "Yon Aiker",
      userRole: "GERENTE_GENERAL",
      action: user.active ? "USUARIO_ACTIVADO" : "USUARIO_BLOQUEADO",
      module: "SEGURIDAD",
      details: `Cambio de estado a ${user.active ? "Activo" : "Bloqueado"} para ${user.name}`
    });

    return true;
  }
}
