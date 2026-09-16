import { LoanContract } from '../../types';

export interface RepossessionOrder {
  orderId: string;
  contractNumber: string;
  clientName: string;
  clientDocId: string;
  clientPhone: string;
  lastKnownAddress: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleColor: string;
  vehiclePlate: string;
  vinChassis: string;
  gpsImei: string;
  lastGpsCoordinates: { lat: number; lng: number };
  immobilizerActive: boolean;
  totalOverdueUSD: number;
  overdueQuotasCount: number;
  issuedAt: string;
  status: 'PENDING_FIELD_TEAM' | 'IN_TRANSIT' | 'REPOSSESSED' | 'CANCELLED_SETTLED';
}

export class GpsRecoveryModule {
  /**
   * Evalúa el nivel de escalamiento de mora y dispara acciones GPS
   */
  public static evaluateDefaultEscalation(params: {
    contract: LoanContract;
    daysOverdue: number;
    unpaidQuotasCount: number;
  }): {
    escalationLevel: 'GRACE_PERIOD' | 'SURCHARGE_REMINDER' | 'GPS_WARNING' | 'ENGINE_IMMOBILIZED' | 'REPOSSESSION_ORDER';
    actionDescription: string;
    shouldImmobilizeEngine: boolean;
    shouldIssueRepossessionOrder: boolean;
  } {
    if (params.daysOverdue <= 3) {
      return {
        escalationLevel: 'GRACE_PERIOD',
        actionDescription: 'En período de gracia (0 a 3 días). No se aplican penalidades.',
        shouldImmobilizeEngine: false,
        shouldIssueRepossessionOrder: false
      };
    } else if (params.daysOverdue <= 10) {
      return {
        escalationLevel: 'SURCHARGE_REMINDER',
        actionDescription: 'Mora leve (4 a 10 días). Recargo diario aplicado y recordatorios automáticos por WhatsApp.',
        shouldImmobilizeEngine: false,
        shouldIssueRepossessionOrder: false
      };
    } else if (params.daysOverdue <= 20) {
      return {
        escalationLevel: 'GPS_WARNING',
        actionDescription: 'Advertencia formal de restricción satelital emitida al WhatsApp del cliente.',
        shouldImmobilizeEngine: false,
        shouldIssueRepossessionOrder: false
      };
    } else if (params.daysOverdue <= 30 || params.unpaidQuotasCount < 2) {
      return {
        escalationLevel: 'ENGINE_IMMOBILIZED',
        actionDescription: '🔴 Comando de corte de encendido por GPS transmitido. El motor no arrancará al apagarse.',
        shouldImmobilizeEngine: true,
        shouldIssueRepossessionOrder: false
      };
    } else {
      return {
        escalationLevel: 'REPOSSESSION_ORDER',
        actionDescription: '🚨 ORDEN DE DECOMISO Y RETENCIÓN EN CAMPO EMITIDA. Despacho a equipo de recuperación con GPS en vivo.',
        shouldImmobilizeEngine: true,
        shouldIssueRepossessionOrder: true
      };
    }
  }

  /**
   * Genera una Orden de Retención y Ficha de Decomiso en Campo
   */
  public static generateRepossessionOrder(params: {
    contract: LoanContract;
    totalOverdueUSD: number;
    overdueQuotasCount: number;
    currentGpsLocation?: { lat: number; lng: number };
  }): RepossessionOrder {
    return {
      orderId: `REP-ORD-${Date.now().toString().slice(-6)}`,
      contractNumber: params.contract.contractNumber,
      clientName: params.contract.clientName,
      clientDocId: params.contract.clientDocId,
      clientPhone: params.contract.clientPhone,
      lastKnownAddress: params.contract.clientAddress,
      vehicleBrand: params.contract.vehicle.brand,
      vehicleModel: params.contract.vehicle.model,
      vehicleColor: params.contract.vehicle.color,
      vehiclePlate: params.contract.vehicle.plate || 'EN TRÁMITE',
      vinChassis: params.contract.vehicle.vinChassis,
      gpsImei: params.contract.vehicle.gpsImei || '864920194820194',
      lastGpsCoordinates: params.currentGpsLocation || { lat: 10.4806, lng: -66.9036 }, // Caracas por defecto
      immobilizerActive: true,
      totalOverdueUSD: params.totalOverdueUSD,
      overdueQuotasCount: params.overdueQuotasCount,
      issuedAt: new Date().toISOString(),
      status: 'PENDING_FIELD_TEAM'
    };
  }
}