"use client";

import { LoanContract } from '../../types';

export type DeviceStatus = 'ONLINE_MOVING' | 'ONLINE_PARKED' | 'IMMOBILIZED' | 'OFFLINE';
export type GeofenceZone = 'GRAN_CARACAS' | 'EJE_CENTRAL_VALENCIA_MARACAY' | 'ZONA_NO_AUTORIZADA_FRONTERA';

export interface GPSDeviceTracker {
  id: string;
  contractNumber: string;
  clientName: string;
  clientPhone: string;
  vehicleModel: string;
  plate: string;
  imei: string;
  simCardNumber: string;
  status: DeviceStatus;
  isEngineCut: boolean;
  batteryLevelPercent: number;
  currentSpeedKmH: number;
  latitude: number;
  longitude: number;
  locationAddress: string;
  geofenceZone: GeofenceZone;
  isGeofenceBreached: boolean;
  lastPingTime: string;
  historyLogs: {
    timestamp: string;
    action: string;
    operator: string;
    sha256Seal: string;
  }[];
}

export class GPSTelemetryEngine {
  private static devices: GPSDeviceTracker[] = [
    {
      id: "GPS-BERA-001",
      contractNumber: "CTR-2026-001",
      clientName: "José Gregorio Castillo",
      clientPhone: "0414-3329011",
      vehicleModel: "Bera SBR 150cc",
      plate: "AI8X92M",
      imei: "860492019284001",
      simCardNumber: "0412-0019281",
      status: "ONLINE_MOVING",
      isEngineCut: false,
      batteryLevelPercent: 94,
      currentSpeedKmH: 42,
      latitude: 10.5061,
      longitude: -66.9146,
      locationAddress: "Av. Sucre, Catia, Caracas",
      geofenceZone: "GRAN_CARACAS",
      isGeofenceBreached: false,
      lastPingTime: "Hace 15 segundos",
      historyLogs: [
        {
          timestamp: "2026-08-25 09:10:00",
          action: "PING_SISTEMA_ACTIVO",
          operator: "Sistema Automático",
          sha256Seal: "SHA256:50494E475F4155544F"
        }
      ]
    },
    {
      id: "GPS-EK-002",
      contractNumber: "CTR-2026-002",
      clientName: "Carlos Eduardo Pérez",
      clientPhone: "0412-8894401",
      vehicleModel: "Empire Keeway EK Express",
      plate: "AK4M10P",
      imei: "860492019284002",
      simCardNumber: "0416-5592018",
      status: "ONLINE_PARKED",
      isEngineCut: false,
      batteryLevelPercent: 88,
      currentSpeedKmH: 0,
      latitude: 10.2469,
      longitude: -67.5958,
      locationAddress: "Av. Bolívar Centro, Maracay, Aragua",
      geofenceZone: "EJE_CENTRAL_VALENCIA_MARACAY",
      isGeofenceBreached: false,
      lastPingTime: "Hace 1 minuto",
      historyLogs: []
    },
    {
      id: "GPS-TORO-003",
      contractNumber: "CTR-2026-003",
      clientName: "Marcos Antonio Díaz",
      clientPhone: "0424-7719201",
      vehicleModel: "Motos Toro León 150cc",
      plate: "AM9K22R",
      imei: "860492019284003",
      simCardNumber: "0414-9920193",
      status: "IMMOBILIZED",
      isEngineCut: true,
      batteryLevelPercent: 78,
      currentSpeedKmH: 0,
      latitude: 10.4880,
      longitude: -66.8792,
      locationAddress: "Distribuidor Altamira, Autopista Fco Fajardo",
      geofenceZone: "GRAN_CARACAS",
      isGeofenceBreached: true,
      lastPingTime: "Hace 40 segundos",
      historyLogs: [
        {
          timestamp: "2026-08-24 16:30:00",
          action: "CORTE_DE_MOTOR_EJECUTADO (Mora > 60 Días)",
          operator: "Seguridad y Control",
          sha256Seal: "SHA256:494D4D4F42494C495A45445F303033"
        }
      ]
    }
  ];

  public static getAllDevices(): GPSDeviceTracker[] {
    return [...this.devices];
  }

  /**
   * Ejecuta la inmovilización remota satelital (Kill-Switch) del motor
   */
  public static executeKillSwitch(deviceId: string, reason: string, operator: string): GPSDeviceTracker {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device) throw new Error("Dispositivo GPS no encontrado.");

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const rawSeal = "KILL_SWITCH|" + device.imei + "|" + device.plate + "|" + timestamp;
    const sha256Seal = "SHA256:" + Buffer.from(rawSeal).toString('hex').slice(0, 32).toUpperCase();

    device.isEngineCut = true;
    device.status = "IMMOBILIZED";
    device.currentSpeedKmH = 0;
    device.historyLogs.unshift({
      timestamp,
      action: "CORTE_DE_MOTOR_REMOTA: " + reason,
      operator,
      sha256Seal
    });

    return device;
  }

  /**
   * Desbloquea y restablece el encendido del motor
   */
  public static restoreEngine(deviceId: string, operator: string): GPSDeviceTracker {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device) throw new Error("Dispositivo GPS no encontrado.");

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const rawSeal = "RESTORE_ENGINE|" + device.imei + "|" + timestamp;
    const sha256Seal = "SHA256:" + Buffer.from(rawSeal).toString('hex').slice(0, 32).toUpperCase();

    device.isEngineCut = false;
    device.status = "ONLINE_PARKED";
    device.historyLogs.unshift({
      timestamp,
      action: "RESTABLECIMIENTO_DE_ENCENDIDO_AUTORIZADO",
      operator,
      sha256Seal
    });

    return device;
  }

  /**
   * Genera el enlace de navegación en Google Maps / Waze para el cobrador de calle
   */
  public static generateNavigationUrl(latitude: number, longitude: number): { googleMapsUrl: string; wazeUrl: string } {
    return {
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=" + latitude + "," + longitude,
      wazeUrl: "https://waze.com/ul?ll=" + latitude + "," + longitude + "&navigate=yes"
    };
  }
}
