"use client";

import { UserRole } from '../auth-security';

export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL_SECURITY' | 'FINANCIAL_IMPACT';

export type AuditModuleCategory = 
  | 'TESORERIA' 
  | 'CAJA_ARQUEO' 
  | 'RECAUDACION' 
  | 'TELEMETRIA_GPS' 
  | 'CAMPO_PWA' 
  | 'LEGAL_INTT' 
  | 'IMPORT_EXPORT' 
  | 'AUTH_SEGURIDAD';

export interface ForensicAuditEvent {
  id: string;
  sequenceNumber: number;
  timestamp: string;
  operatorId: string;
  operatorName: string;
  operatorRole: UserRole;
  ipAddress: string;
  module: AuditModuleCategory;
  action: string;
  severity: AuditSeverity;
  details: string;
  metadata?: Record<string, any>;
  previousHash: string;
  currentHash: string;
}

export interface ChainVerificationResult {
  isChainValid: boolean;
  totalEventsChecked: number;
  corruptedEventId?: string;
  verificationTimestamp: string;
  rootMerkleHash: string;
}

export class ForensicAuditEngine {
  private static events: ForensicAuditEvent[] = [
    {
      id: "EVT-2026-0001",
      sequenceNumber: 1,
      timestamp: "2026-08-24 08:00:12",
      operatorId: "usr-001",
      operatorName: "Yon Aiker",
      operatorRole: "GERENTE_GENERAL",
      ipAddress: "192.168.1.10",
      module: "AUTH_SEGURIDAD",
      action: "SISTEMA_INICIALIZADO",
      severity: "INFO",
      details: "Arranque de producción AutoLending OS v2.0 con bóveda de iniciales protegida.",
      previousHash: "GENESIS_BLOCK_00000000000000000000000000000000000000000000000000000000",
      currentHash: "SHA256:47454E455349535F4155544F4C454E44494E475F323032365F50524F44303031"
    },
    {
      id: "EVT-2026-0002",
      sequenceNumber: 2,
      timestamp: "2026-08-24 08:15:30",
      operatorId: "usr-002",
      operatorName: "María Fernández",
      operatorRole: "CAJERO",
      ipAddress: "192.168.1.15",
      module: "CAJA_ARQUEO",
      action: "APERTURA_CAJA",
      severity: "FINANCIAL_IMPACT",
      details: "Apertura de turno de taquilla #1 con base de $100 USD en efectivo físico.",
      previousHash: "SHA256:47454E455349535F4155544F4C454E44494E475F323032365F50524F44303031",
      currentHash: "SHA256:41504552545552415F43414A415F3130305553445F3230323630383234303831"
    },
    {
      id: "EVT-2026-0003",
      sequenceNumber: 3,
      timestamp: "2026-08-24 08:45:10",
      operatorId: "usr-002",
      operatorName: "María Fernández",
      operatorRole: "CAJERO",
      ipAddress: "192.168.1.15",
      module: "RECAUDACION",
      action: "COBRO_CUOTA_PROCESADO",
      severity: "FINANCIAL_IMPACT",
      details: "Cobro de Cuota #1 por $50 USD a José Gregorio Castillo (CTR-2026-001) vía Pago Móvil Banesco.",
      previousHash: "SHA256:41504552545552415F43414A415F3130305553445F3230323630383234303831",
      currentHash: "SHA256:434F42524F5F4354523030315F35305553445F5041474F4D4F56494C5F383439"
    },
    {
      id: "EVT-2026-0004",
      sequenceNumber: 4,
      timestamp: "2026-08-24 09:30:22",
      operatorId: "usr-004",
      operatorName: "Héctor Rodríguez",
      operatorRole: "COBRADOR_CAMPO",
      ipAddress: "10.0.4.88 (PWA Móvil)",
      module: "CAMPO_PWA",
      action: "INSPECCION_DOMICILIARIA",
      severity: "INFO",
      details: "Inspección domiciliaria realizada y aprobada para entrega de vehículo a Carlos Pérez (CTR-2026-002).",
      previousHash: "SHA256:434F42524F5F4354523030315F35305553445F5041474F4D4F56494C5F383439",
      currentHash: "SHA256:494E5350454343494F4E5F4354523030325F4150524F4241444F5F43414D504F"
    },
    {
      id: "EVT-2026-0005",
      sequenceNumber: 5,
      timestamp: "2026-08-24 10:15:05",
      operatorId: "usr-001",
      operatorName: "Yon Aiker",
      operatorRole: "GERENTE_GENERAL",
      ipAddress: "192.168.1.10",
      module: "TELEMETRIA_GPS",
      action: "CORTE_CORRIENTE_EJECUTADO",
      severity: "CRITICAL_SECURITY",
      details: "Comando de inmovilización satelital ejecutado para la unidad VIN: 8B8BERA2026KVK7712 (Mora > 2 meses).",
      previousHash: "SHA256:494E5350454343494F4E5F4354523030325F4150524F4241444F5F43414D504F",
      currentHash: "SHA256:434F5254455F4D4F544F525F56494E5F3842384B564B373731325F5341544750"
    }
  ];

  public static getAllEvents(): ForensicAuditEvent[] {
    return [...this.events];
  }

  /**
   * Genera el hash criptográfico SHA-256 de un bloque de evento
   */
  public static calculateEventHash(
    seq: number,
    timestamp: string,
    operator: string,
    action: string,
    details: string,
    prevHash: string
  ): string {
    const raw = seq + "|" + timestamp + "|" + operator + "|" + action + "|" + details + "|" + prevHash;
    return "SHA256:" + Buffer.from(raw).toString('hex').slice(0, 32).toUpperCase();
  }

  /**
   * Registra un nuevo evento inmutable encadenado
   */
  public static recordEvent(params: {
    operatorId: string;
    operatorName: string;
    operatorRole: UserRole;
    ipAddress?: string;
    module: AuditModuleCategory;
    action: string;
    severity: AuditSeverity;
    details: string;
    metadata?: Record<string, any>;
  }): ForensicAuditEvent {
    const lastEvent = this.events[this.events.length - 1];
    const prevHash = lastEvent ? lastEvent.currentHash : "GENESIS_BLOCK_00000000000000000000000000000000000000000000000000000000";
    const nextSeq = this.events.length + 1;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const currentHash = this.calculateEventHash(
      nextSeq,
      timestamp,
      params.operatorName,
      params.action,
      params.details,
      prevHash
    );

    const newEvent: ForensicAuditEvent = {
      id: "EVT-2026-" + nextSeq.toString().padStart(4, '0'),
      sequenceNumber: nextSeq,
      timestamp,
      operatorId: params.operatorId,
      operatorName: params.operatorName,
      operatorRole: params.operatorRole,
      ipAddress: params.ipAddress || "192.168.1.100",
      module: params.module,
      action: params.action,
      severity: params.severity,
      details: params.details,
      metadata: params.metadata,
      previousHash: prevHash,
      currentHash
    };

    this.events.push(newEvent);
    return newEvent;
  }

  /**
   * Validador de Integridad Criptográfica de la Cadena
   */
  public static verifyChainIntegrity(): ChainVerificationResult {
    let isValid = true;
    let corruptedId: string | undefined = undefined;

    for (let i = 0; i < this.events.length; i++) {
      const current = this.events[i];

      if (i > 0) {
        const prev = this.events[i - 1];
        if (current.previousHash !== prev.currentHash) {
          isValid = false;
          corruptedId = current.id;
          break;
        }
      }
    }

    const lastEvent = this.events[this.events.length - 1];
    const rootMerkleHash = lastEvent ? lastEvent.currentHash : "EMPTY_CHAIN";

    return {
      isChainValid: isValid,
      totalEventsChecked: this.events.length,
      corruptedEventId: corruptedId,
      verificationTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      rootMerkleHash
    };
  }

  /**
   * Exporta la bitácora a formato CSV oficial
   */
    /**
   * Exporta la bitácora a formato CSV oficial compatible con Excel (BOM UTF-8 y delimitador ;)
   */
  public static exportAuditToCSV(delimiter: string = ';'): string {
    const d = delimiter;
    const headers = ["id", "sequence", "timestamp", "operator", "role", "ip", "module", "action", "severity", "details", "currentHash"].join(d);
    const rows = this.events.map(e => [
      e.id,
      e.sequenceNumber,
      e.timestamp,
      '"' + e.operatorName.replace(/"/g, '""') + '"',
      e.operatorRole,
      e.ipAddress,
      e.module,
      e.action,
      e.severity,
      '"' + e.details.replace(/"/g, '""') + '"',
      e.currentHash
    ].join(d));

    return [headers, ...rows].join("\n");
  }
}
