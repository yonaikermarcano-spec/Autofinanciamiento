"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  RotateCcw,
  ShieldCheck, 
  UserPlus, 
  Users, 
  KeyRound, 
  Download, 
  Fingerprint,
  Check,
  Minus,
  Search,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";
import { 
  AuthSecurityModule, 
  SystemUser, 
  UserRole, 
  PermissionKey, 
  ROLE_PERMISSIONS, 
  AuditLogEntry 
} from "../../modules/auth-security";
import { toast } from "../common/GoogleSnackbar";

export default function ManageUsersModal({
  isOpen,
  onClose,
  currentUserRole,
  onUserRoleChange
}: {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
  onUserRoleChange: (role: UserRole) => void;
}) {
  const [activeTab, setActiveTab] = useState<"USERS" | "MATRIX" | "AUDIT">("USERS");
  const [users, setUsers] = useState<SystemUser[]>(AuthSecurityModule.getUsers());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(AuthSecurityModule.getAuditLogs());
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, PermissionKey[]>>(() => AuthSecurityModule.getRolePermissions());
  const [permissionSuccessMsg, setPermissionSuccessMsg] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const applyTogglePermission = (role: UserRole, permission: PermissionKey) => {
    const updated = AuthSecurityModule.toggleRolePermission(role, permission);
    setRolePermissions({ ...updated });
    setAuditLogs(AuthSecurityModule.getAuditLogs());
    
    const isGranted = (updated[role] || []).includes(permission);
    const msg = `Permiso ${isGranted ? "concedido" : "revocado"} para el rol ${role.replace("_", " ")}`;
    setPermissionSuccessMsg(msg);
    toast.info(msg);
    setTimeout(() => setPermissionSuccessMsg(null), 3000);
  };

  const handleTogglePermission = (role: UserRole, permission: PermissionKey) => {
    // Protection: don't let admin lock out user management
    if (role === "GERENTE_GENERAL" && permission === "MANAGE_USERS_SETTINGS" && (rolePermissions[role] || []).includes(permission)) {
      setConfirmAction({
        title: "Atención de Seguridad",
        message: "¿Seguro que deseas revocar la gestión de usuarios para el rol de Gerente General? Podrías bloquear el acceso a este panel.",
        onConfirm: () => {
          applyTogglePermission(role, permission);
          setConfirmAction(null);
        }
      });
      return;
    }
    applyTogglePermission(role, permission);
  };

  const handleResetPermissions = () => {
    setConfirmAction({
      title: "Restaurar Permisos de Fábrica",
      message: "¿Deseas restaurar la matriz de permisos RBAC a los valores por defecto del sistema?",
      onConfirm: () => {
        const defaults = AuthSecurityModule.resetRolePermissionsToDefaults();
        setRolePermissions({ ...defaults });
        setAuditLogs(AuthSecurityModule.getAuditLogs());
        toast.info("Matriz de permisos restaurada a los valores de fábrica.");
        setConfirmAction(null);
      }
    });
  };
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [auditSearch, setAuditSearch] = useState("");

  // Formulario nuevo usuario
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("ASESOR_VENTAS");
  const [newUserDepartment, setNewUserDepartment] = useState("Ventas & Comercial");
  const [newUserPin, setNewUserPin] = useState("");
  const [showPin, setShowPin] = useState(false);

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

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || newUserPin.length !== 4) {
      toast.error("Por favor completa todos los campos requeridos y asegúrate de que el PIN tenga 4 dígitos.");
      return;
    }

    AuthSecurityModule.createUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      pin: newUserPin,
      department: newUserDepartment.trim()
    });

    setUsers(AuthSecurityModule.getUsers());
    setAuditLogs(AuthSecurityModule.getAuditLogs());
    setIsCreatingUser(false);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPin("");
    toast.success("Operador creado exitosamente con credenciales y hash criptográfico.");
  };

  const handleToggleStatus = (userId: string) => {
    AuthSecurityModule.toggleUserStatus(userId);
    setUsers(AuthSecurityModule.getUsers());
    setAuditLogs(AuthSecurityModule.getAuditLogs());
  };

  const handleExportAuditLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `autolending_security_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLogs = auditLogs.filter(l => {
    if (!auditSearch.trim()) return true;
    const term = auditSearch.toLowerCase().trim();
    return (
      l.userName.toLowerCase().includes(term) ||
      l.action.toLowerCase().includes(term) ||
      l.details.toLowerCase().includes(term) ||
      l.module.toLowerCase().includes(term) ||
      l.sha256Hash.toLowerCase().includes(term)
    );
  });

  const PERMISSION_LABELS: Record<PermissionKey, { label: string; desc: string }> = {
    VIEW_DASHBOARD_KPI: { label: "Ver Dashboard & 10 KPIs", desc: "Acceso a métricas ejecutivas de cartera" },
    VIEW_TREASURY_VAULT: { label: "Bóveda & Runway de Tesorería", desc: "Supervisión de fondos comprometidos y capital libre" },
    VIEW_CRM_CLIENTS: { label: "Ver Directorio de Clientes", desc: "Consulta 360° de contratos y avales" },
    CREATE_CLIENT: { label: "Registrar Nuevos Clientes", desc: "Carga de expedientes y fiadores solidarios" },
    VIEW_INVENTORY: { label: "Ver Inventario de Vehículos", desc: "Consulta de motos/carros en stock y patio" },
    CREATE_VEHICLE: { label: "Registrar Unidades en Stock", desc: "Carga de seriales VIN, motor y costos dealer" },
    PROCESS_PAYMENTS: { label: "Terminal de Recaudación", desc: "Cobro de cuotas, IGTF, IVA y envío de WhatsApp" },
    PERFORM_CASHIER_AUDIT: { label: "Realizar Arqueo Ciego de Caja", desc: "Cierre de turno con detección de diferencias" },
    APPROVE_REFUND: { label: "Aprobar Liquidación Reembolso 70/30", desc: "Autorización de devolución de fondos por gerencia" },
    TRIGGER_FIELD_RECOVERY: { label: "Gestionar Recuperación en Calle", desc: "Órdenes de retención y visitas domiciliarias" },
    PRINT_LEGAL_DOCS: { label: "Imprimir Documentos Notariales", desc: "Emisión de contratos, finiquitos y descargos INTT" },
    MANAGE_USERS_SETTINGS: { label: "Gestión de Usuarios & Configuración", desc: "Administración de roles, PINs y parámetros multi-tenant" }
  };

  const allPermissions = Object.keys(PERMISSION_LABELS) as PermissionKey[];
  const allRoles: UserRole[] = ["GERENTE_GENERAL", "CAJERO", "ASESOR_VENTAS", "COBRADOR_CAMPO", "AUDITOR_LEGAL"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl w-full max-w-5xl h-[86vh] max-h-[820px] min-h-[620px] flex flex-col shadow-2xl shadow-zinc-900/15 overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans"
      >
        
        {/* Header Resend Style */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-zinc-100 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Seguridad & Control de Accesos (RBAC)</h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Administración de operadores, matriz de permisos y bitácora criptográfica inmutable</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pestañas Segmentadas */}
        <div className="px-6 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-white dark:bg-zinc-900">
          <div className="flex items-center space-x-1.5">
            {[
              { id: "USERS", label: "Operadores del Sistema", count: users.length, icon: Users },
              { id: "MATRIX", label: "Matriz de Permisos RBAC", count: allPermissions.length, icon: KeyRound },
              { id: "AUDIT", label: "Bitácora Criptográfica", count: auditLogs.length, icon: Fingerprint }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={"px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-2 " + (
                    isActive 
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs" 
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span className={"text-[10px] font-mono px-1.5 py-0.2 rounded-full border " + (
                    isActive 
                      ? "bg-zinc-800 text-white border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-200" 
                      : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                  )}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {activeTab === "USERS" && !isCreatingUser && (
            <button
              onClick={() => setIsCreatingUser(true)}
              className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Registrar Operador</span>
            </button>
          )}

          {activeTab === "AUDIT" && (
            <button
              onClick={handleExportAuditLogs}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span>Exportar Bitácora</span>
            </button>
          )}
        </div>

        {/* CONTENIDO SCROLLEABLE UNIFICADO */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* PESTAÑA 1: OPERADORES DEL SISTEMA */}
          {activeTab === "USERS" && (
            <div className="space-y-4">
              
              {/* Formulario de Registro */}
              {isCreatingUser && (
                <form onSubmit={handleCreateUser} className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 animate-in fade-in duration-150">
                  <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2.5">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                      <UserPlus className="w-4 h-4 text-emerald-500" />
                      <span>Alta de Nuevo Operador Interno</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsCreatingUser(false)}
                      className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Nombre Completo del Operador</label>
                      <input 
                        type="text"
                        required
                        placeholder="Ej. Andrés Quintero"
                        value={newUserName}
                        onChange={e => setNewUserName(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-600 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Correo Corporativo / Usuario</label>
                      <input 
                        type="email"
                        required
                        placeholder="andres.ventas@autolending.ve"
                        value={newUserEmail}
                        onChange={e => setNewUserEmail(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-700 dark:text-zinc-400 block mb-1">Rol & Nivel de Permisos</label>
                      <select
                        value={newUserRole}
                        onChange={e => setNewUserRole(e.target.value as UserRole)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-600 font-semibold"
                      >
                        {allRoles.map(r => (
                          <option key={r} value={r}>
                            {r.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-zinc-700 dark:text-zinc-400 block mb-1">PIN de Seguridad (4 Dígitos)</label>
                      <div className="relative">
                        <input 
                          type={showPin ? "text" : "password"}
                          maxLength={4}
                          required
                          placeholder="••••"
                          value={newUserPin}
                          onChange={e => setNewUserPin(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 pr-9 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono text-center tracking-widest"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPin(!showPin)}
                          className="absolute right-2.5 top-2 text-zinc-600 dark:text-zinc-400 hover:text-white"
                        >
                          {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-sm"
                    >
                      Guardar & Generar Credenciales
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de Usuarios */}
              <div className="space-y-3">
                {users.map(u => {
                  const isCurrent = u.role === currentUserRole;
                  return (
                    <div 
                      key={u.id}
                      className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-850 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-sm text-zinc-800 dark:text-zinc-200">
                          {u.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <strong className="text-zinc-900 dark:text-zinc-100 text-sm font-semibold">{u.name}</strong>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold">
                              {u.role.replace("_", " ")}
                            </span>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px] mt-0.5">
                            {u.email} • {u.department} • Último login: {u.lastLogin}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isCurrent ? (
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-xl font-bold flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Sesión Activa</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onUserRoleChange(u.role);
                              onClose();
                            }}
                            className="bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer"
                          >
                            Asumir Rol
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u.id)}
                          className={"px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer border " + (
                            u.active
                              ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                          )}
                        >
                          {u.active ? "Activo" : "Bloqueado"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* PESTAÑA 2: MATRIZ DE PERMISOS RBAC (TOTALMENTE PERSONALIZABLE) */}
          {activeTab === "MATRIX" && (
            <div className="space-y-4">
              
              <div className="flex flex-wrap justify-between items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                    <KeyRound className="w-4 h-4 text-purple-500" />
                    <span>Control Granular de Permisos por Nivel Jerárquico</span>
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                    Haz clic en cualquier casilla de la matriz para conceder o revocar permisos en tiempo real a cualquier rol.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleResetPermissions}
                    className="bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                    <span>Restaurar Valores de Fábrica</span>
                  </button>
                </div>
              </div>

              {permissionSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{permissionSuccessMsg}</span>
                </div>
              )}

              <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/80 text-zinc-600 dark:text-zinc-400 font-bold uppercase text-[10px]">
                      <th className="p-3.5 pl-4">Módulo / Permiso</th>
                      {allRoles.map(r => (
                        <th key={r} className="p-3.5 text-center">{r.replace("_", " ")}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60 font-sans">
                    {allPermissions.map(perm => (
                      <tr key={perm} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/30 transition">
                        <td className="p-3.5 pl-4">
                          <strong className="text-zinc-900 dark:text-zinc-100 block font-semibold">{PERMISSION_LABELS[perm].label}</strong>
                          <span className="text-[11px] text-zinc-600 dark:text-zinc-400">{PERMISSION_LABELS[perm].desc}</span>
                        </td>
                        {allRoles.map(r => {
                          const allowed = (rolePermissions[r] || []).includes(perm);
                          return (
                            <td key={r} className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleTogglePermission(r, perm)}
                                title={`Clic para ${allowed ? "revocar" : "conceder"} este permiso a ${r.replace("_", " ")}`}
                                className={"inline-flex items-center justify-center w-8 h-8 rounded-xl transition cursor-pointer " + (
                                  allowed 
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30" 
                                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30"
                                )}
                              >
                                {allowed ? (
                                  <Check className="w-4 h-4 font-bold" />
                                ) : (
                                  <Minus className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-[11px] text-zinc-600 dark:text-zinc-400 pt-1">
                <span>🛡️ Cada cambio queda sellado con un bloque criptográfico SHA-256 en la Bitácora.</span>
                <span className="font-mono text-emerald-500 font-semibold">● Matriz Reactiva en Vivo</span>
              </div>

            </div>
          )}

          {/* PESTAÑA 3: BITÁCORA CRIPTOGRÁFICA */}
          {activeTab === "AUDIT" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-600 dark:text-zinc-400 absolute left-3 top-2.5" />
                <input 
                  type="text"
                  placeholder="Filtrar eventos por usuario, acción, módulo o hash SHA-256..."
                  value={auditSearch}
                  onChange={e => setAuditSearch(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="space-y-2">
                {filteredLogs.map(log => (
                  <div 
                    key={log.id} 
                    className="bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 text-[11px]">
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-500 font-bold font-mono">[{log.id}]</span>
                        <strong className="text-zinc-900 dark:text-zinc-100 font-sans">{log.userName}</strong>
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 px-1.5 py-0.2 rounded font-sans font-semibold">
                          {log.userRole}
                        </span>
                      </div>
                      <span>{log.timestamp}</span>
                    </div>

                    <p className="text-zinc-800 dark:text-zinc-200 font-sans text-xs">{log.details}</p>

                    <div className="flex items-center justify-between text-[10px] text-zinc-600 dark:text-zinc-400 pt-1 border-t border-zinc-200 dark:border-zinc-800/60">
                      <span>Módulo: <strong className="text-zinc-700 dark:text-zinc-300">{log.module}</strong> • IP: {log.ipAddress}</span>
                      <span className="text-zinc-600 dark:text-zinc-400 font-mono">{log.sha256Hash}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {confirmAction && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl text-zinc-900 dark:text-zinc-100 font-sans animate-in zoom-in-95">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-500/10 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{confirmAction.title}</h4>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {confirmAction.message}
              </p>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmAction.onConfirm}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-google-blue-600 hover:bg-google-blue-700 text-white transition cursor-pointer shadow-xs active:scale-95"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
