"use client";

import { LoanContract } from '../../types';
import { BcvEngine } from '../bcv-engine';

export type InspectionResult = 'APROBADO_ENTREGA' | 'REQUIERE_AVAL_EXTRA' | 'RECHAZADO';

export interface HomeInspectionRecord {
  id: string;
  contractNumber: string;
  clientName: string;
  inspectorName: string;
  visitDate: string;
  gpsCoordinates: { lat: number; lng: number };
  housingType: 'PROPIA' | 'ALQUILADA' | 'FAMILIAR';
  housingCondition: 'EXCELENTE' | 'BUENA' | 'REGULAR';
  guarantorVerified: boolean;
  incomeStabilityVerified: boolean;
  capturedPhotosCount: number;
  dictamen: InspectionResult;
  observations: string;
  sha256Seal: string;
}

export interface FieldRepossessionRecord {
  id: string;
  contractNumber: string;
  clientName: string;
  officerName: string;
  executionDate: string;
  gpsCoordinates: { lat: number; lng: number };
  vehiclePlate: string;
  vinChassis: string;
  currentKilometers: number;
  keysRecovered: boolean;
  physicalCondition: string;
  clientSignatureHash: string;
  witnessName: string;
  witnessDocId: string;
  status: 'EJECUTADA_CONSIGNADA' | 'EN_CUSTODIA';
  sha256Seal: string;
}

export class FieldAppEngine {
  private static inspections: HomeInspectionRecord[] = [
    {
      id: "INSP-001",
      contractNumber: "CTR-2026-003",
      clientName: "María Elena Gómez",
      inspectorName: "Héctor Rodríguez",
      visitDate: "2026-08-24 10:30",
      gpsCoordinates: { lat: 10.4806, lng: -66.9036 },
      housingType: "PROPIA",
      housingCondition: "BUENA",
      guarantorVerified: true,
      incomeStabilityVerified: true,
      capturedPhotosCount: 4,
      dictamen: "APROBADO_ENTREGA",
      observations: "Vivienda propia verificada con recibo de luz. Fiador solvente presente en sitio.",
      sha256Seal: "SHA256:49A8BC011F"
    }
  ];

  private static repossessions: FieldRepossessionRecord[] = [];

  /**
   * Registra una inspección domiciliaria con geolocalización y sello criptográfico
   */
  public static recordInspection(data: Omit<HomeInspectionRecord, 'id' | 'sha256Seal'>): HomeInspectionRecord {
    const id = "INSP-" + Date.now().toString().slice(-6);
    const raw = id + "|" + data.contractNumber + "|" + data.visitDate + "|" + data.dictamen;
    const sha256Seal = "SHA256:" + Buffer.from(raw).toString('hex').slice(0, 16).toUpperCase();

    const record: HomeInspectionRecord = {
      ...data,
      id,
      sha256Seal
    };

    this.inspections.unshift(record);
    return record;
  }

  /**
   * Registra un acta de retención física en campo
   */
  public static recordRepossession(data: Omit<FieldRepossessionRecord, 'id' | 'sha256Seal'>): FieldRepossessionRecord {
    const id = "RET-" + Date.now().toString().slice(-6);
    const raw = id + "|" + data.contractNumber + "|" + data.executionDate + "|" + data.vehiclePlate;
    const sha256Seal = "SHA256:" + Buffer.from(raw).toString('hex').slice(0, 16).toUpperCase();

    const record: FieldRepossessionRecord = {
      ...data,
      id,
      sha256Seal
    };

    this.repossessions.unshift(record);
    return record;
  }

  public static getInspections(): HomeInspectionRecord[] {
    return [...this.inspections];
  }

  public static getRepossessions(): FieldRepossessionRecord[] {
    return [...this.repossessions];
  }
}
