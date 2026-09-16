"use client";

import { LoanContract, VehicleSpec } from '../../types';
import { LocalDB } from '../local-db';

export type GpsConnectionStatus = 'ONLINE' | 'OFFLINE' | 'BATTERY_TAMPER' | 'GEOFENCE_ALERT' | 'IMMOBILIZED';

export interface GpsDevice {
  imei: string;
  simCardNumber: string;
  carrier: 'DIGITEL' | 'MOVISTAR' | 'MOVILNET';
  vehicleVin: string;
  contractNumber: string;
  clientName: string;
  status: GpsConnectionStatus;
  isEngineLocked: boolean;
  batteryVoltage: number; // Ej: 12.6V
  latitude: number;
  longitude: number;
  locationName: string;
  speedKmh: number;
  lastPingTime: string;
  geofenceRadiusKm: number;
  isOutsideGeofence: boolean;
}

export interface RcvPolicy {
  id: string;
  policyNumber: string;
  insurer: 'SEGUROS_CARACAS' | 'MERCANTIL_SEGUROS' | 'PIRAMIDE' | 'MAPFRE' | 'LA_ORIENTAL';
  vehicleVin: string;
  contractNumber: string;
  clientName: string;
  startDate: string;
  expirationDate: string;
  costUSD: number;
  status: 'VIGENTE' | 'POR_VENCER' | 'VENCIDA';
  daysToExpiration: number;
}

export interface TelematicsLog {
  id: string;
  timestamp: string;
  operatorName: string;
  action: 'ENGINE_CUT_OFF' | 'ENGINE_RESTORE' | 'BATTERY_TAMPER_ALERT' | 'GEOFENCE_BREACH' | 'RCV_RENEWAL';
  targetImei: string;
  vehicleVin: string;
  contractNumber: string;
  sha256Seal: string;
}

export class TelematicsEngine {
  private static devices: GpsDevice[] = [
    {
      imei: "860492019284001",
      simCardNumber: "+584129948201",
      carrier: "DIGITEL",
      vehicleVin: "8B8BERA2026SBR8491",
      contractNumber: "CTR-2026-001",
      clientName: "José Gregorio Castillo",
      status: "ONLINE",
      isEngineLocked: false,
      batteryVoltage: 12.8,
      latitude: 10.4806,
      longitude: -66.9036,
      locationName: "Av. Sucre, Catia, Caracas",
      speedKmh: 42,
      lastPingTime: "Hace 15 seg",
      geofenceRadiusKm: 50,
      isOutsideGeofence: false
    },
    {
      imei: "860492019284002",
      simCardNumber: "+584143391029",
      carrier: "MOVISTAR",
      vehicleVin: "8EK2026EXPRESS0092",
      contractNumber: "CTR-2026-002",
      clientName: "Carlos Eduardo Pérez",
      status: "ONLINE",
      isEngineLocked: false,
      batteryVoltage: 12.4,
      latitude: 10.2469,
      longitude: -67.5958,
      locationName: "Av. Las Delicias, Maracay, Aragua",
      speedKmh: 0,
      lastPingTime: "Hace 1 min",
      geofenceRadiusKm: 60,
      isOutsideGeofence: false
    },
    {
      imei: "860492019284003",
      simCardNumber: "+584167729104",
      carrier: "DIGITEL",
      vehicleVin: "8B8BERA2026KVK7712",
      contractNumber: "CTR-2026-003",
      clientName: "María Elena Gómez",
      status: "IMMOBILIZED",
      isEngineLocked: true,
      batteryVoltage: 11.9,
      latitude: 10.1620,
      longitude: -67.9320,
      locationName: "Autopista Regional del Centro, Los Guayos",
      speedKmh: 0,
      lastPingTime: "Hace 3 min",
      geofenceRadiusKm: 40,
      isOutsideGeofence: false
    },
    {
      imei: "860492019284004",
      simCardNumber: "+584241029482",
      carrier: "MOVILNET",
      vehicleVin: "8TVS2026HLX5519",
      contractNumber: "CTR-2026-004",
      clientName: "Wilmer Alexander Rondón",
      status: "BATTERY_TAMPER",
      isEngineLocked: false,
      batteryVoltage: 3.7, // Batería de respaldo interna
      latitude: 10.3800,
      longitude: -66.9800,
      locationName: "Carrizal, Altos Mirandinos",
      speedKmh: 0,
      lastPingTime: "Hace 5 min",
      geofenceRadiusKm: 50,
      isOutsideGeofence: true
    }
  ];

  private static rcvPolicies: RcvPolicy[] = [
    {
      id: "rcv-001",
      policyNumber: "RCV-SC-2026-8849",
      insurer: "SEGUROS_CARACAS",
      vehicleVin: "8B8BERA2026SBR8491",
      contractNumber: "CTR-2026-001",
      clientName: "José Gregorio Castillo",
      startDate: "2026-01-15",
      expirationDate: "2027-01-15",
      costUSD: 35.00,
      status: "VIGENTE",
      daysToExpiration: 144
    },
    {
      id: "rcv-002",
      policyNumber: "RCV-MER-2026-1192",
      insurer: "MERCANTIL_SEGUROS",
      vehicleVin: "8EK2026EXPRESS0092",
      contractNumber: "CTR-2026-002",
      clientName: "Carlos Eduardo Pérez",
      startDate: "2026-02-10",
      expirationDate: "2026-09-10",
      costUSD: 35.00,
      status: "POR_VENCER",
      daysToExpiration: 17
    },
    {
      id: "rcv-003",
      policyNumber: "RCV-PIR-2025-9941",
      insurer: "PIRAMIDE",
      vehicleVin: "8B8BERA2026KVK7712",
      contractNumber: "CTR-2026-003",
      clientName: "María Elena Gómez",
      startDate: "2025-08-01",
      expirationDate: "2026-08-01",
      costUSD: 35.00,
      status: "VENCIDA",
      daysToExpiration: -23
    }
  ];

  private static logs: TelematicsLog[] = [
    {
      id: "LOG-TEL-001",
      timestamp: "2026-08-24 09:15:00",
      operatorName: "Yon Aiker (Gerente General)",
      action: "ENGINE_CUT_OFF",
      targetImei: "860492019284003",
      vehicleVin: "8B8BERA2026KVK7712",
      contractNumber: "CTR-2026-003",
      sha256Seal: "SHA256:454E47494E455F4355545F435452303033"
    }
  ];

  public static getAllDevices(): GpsDevice[] {
    return [...this.devices];
  }

  public static getAllRcvPolicies(): RcvPolicy[] {
    return [...this.rcvPolicies];
  }

  public static getLogs(): TelematicsLog[] {
    return [...this.logs];
  }

  /**
   * Ejecuta el comando de corte o restauración de motor remoto (Kill-Switch)
   */
  public static executeEngineCommand(
    imei: string,
    action: 'CUT_OFF' | 'RESTORE',
    operatorName: string
  ): { success: boolean; newStatus: GpsConnectionStatus; log: TelematicsLog } {
    const device = this.devices.find(d => d.imei === imei);
    if (!device) {
      throw new Error("Dispositivo GPS con IMEI " + imei + " no encontrado.");
    }

    const isCut = action === 'CUT_OFF';
    device.isEngineLocked = isCut;
    device.status = isCut ? 'IMMOBILIZED' : 'ONLINE';
    if (isCut) device.speedKmh = 0;

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const actionType = isCut ? 'ENGINE_CUT_OFF' : 'ENGINE_RESTORE';
    const rawData = imei + "|" + actionType + "|" + operatorName + "|" + timestamp;
    const sha256Seal = "SHA256:" + Buffer.from(rawData).toString('hex').slice(0, 32).toUpperCase();

    const logEntry: TelematicsLog = {
      id: "LOG-TEL-" + (this.logs.length + 1).toString().padStart(3, '0'),
      timestamp,
      operatorName,
      action: actionType,
      targetImei: imei,
      vehicleVin: device.vehicleVin,
      contractNumber: device.contractNumber,
      sha256Seal
    };

    this.logs.unshift(logEntry);

    return {
      success: true,
      newStatus: device.status,
      log: logEntry
    };
  }

  /**
   * Registra la renovación de una póliza RCV
   */
  public static renewRcvPolicy(policyId: string, newExpirationDate: string): RcvPolicy {
    const policy = this.rcvPolicies.find(p => p.id === policyId);
    if (!policy) {
      throw new Error("Póliza no encontrada.");
    }

    policy.expirationDate = newExpirationDate;
    policy.status = "VIGENTE";
    policy.daysToExpiration = 365;

    return policy;
  }
}
