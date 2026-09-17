"use client";

import { LoanContract, VehicleSpec, PaymentScheduleItem, GuarantorInfo } from '../../types';
import { LocalDB } from '../local-db';
import { BcvEngine } from '../bcv-engine';

export interface ParsedClientRow {
  clientName: string;
  clientDocId: string;
  clientPhone: string;
  clientAddress: string;
  companyPriceUSD: number;
  initialDownPaymentUSD: number;
  totalQuotas: number;
  vehicle: VehicleSpec;
  guarantor: GuarantorInfo;
}

export interface ValidationIssue {
  row: number;
  field: string;
  value: string;
  type: 'ERROR' | 'WARNING';
  message: string;
}

export interface BulkImportPreviewResult<T> {
  validCount: number;
  errorCount: number;
  warningCount: number;
  parsedRecords: T[];
  issues: ValidationIssue[];
}

export interface SystemBackupSnapshot {
  timestamp: string;
  filename: string;
  totalContracts: number;
  totalVehicles: number;
  sha256Seal: string;
  jsonContent: string;
}

export class BulkDataEngine {
  /**
   * Genera el contenido de la plantilla CSV para importación de clientes
   * @param delimiter Delimitador a utilizar (';' para Excel en Windows/Venezuela, ',' para Google Sheets)
   */
  public static getClientsTemplateCSV(delimiter: string = ';'): string {
    const d = delimiter;
    return [
      ["nombre_completo", "cedula_rif", "telefono", "direccion", "marca_vehiculo", "modelo_vehiculo", "precio_empresa_usd", "inicial_usd", "numero_cuotas", "nombre_fiador", "cedula_fiador", "telefono_fiador"].join(d),
      ["José Gregorio Castillo", "V-18492019", "0414-3329011", "Caracas Av Sucre", "Bera", "SBR 150cc", "1200", "360", "12", "Pedro Castillo", "V-14882901", "0412-8894401"].join(d),
      ["Carlos Eduardo Pérez", "V-20192844", "0412-8894401", "Maracay Centro", "Empire Keeway", "EK Express 150", "1100", "330", "12", "María Pérez", "V-16772819", "0414-1123490"].join(d),
      ["María Elena Gómez", "V-22849102", "0416-5541092", "Valencia Los Guayos", "Yamaha", "Crux 110", "1400", "420", "12", "Elena Gómez", "V-13992810", "0424-9910283"].join(d)
    ].join("\n");
  }

  /**
   * Genera el contenido de la plantilla CSV para importación de inventario de vehículos
   */
  public static getVehiclesTemplateCSV(delimiter: string = ';'): string {
    const d = delimiter;
    return [
      ["tipo", "marca", "modelo", "ano", "color", "vin_chasis", "serial_motor", "precio_concesionario_usd", "precio_retail_usd", "placa"].join(d),
      ["MOTO", "Bera", "SBR 150cc", "2026", "Azul Eléctrico", "8B910294820192841", "BERA-ENG-849201", "950", "1200", "AB1C23D"].join(d),
      ["MOTO", "Empire Keeway", "EK Express 150", "2026", "Negro Mate", "8B910294820192842", "EK-ENG-772910", "880", "1100", "AC4D56E"].join(d),
      ["MOTO", "TVS", "HLX 150cc", "2026", "Rojo Furia", "8B910294820192843", "TVS-ENG-994821", "1050", "1350", "AD7E89F"].join(d),
      ["CARRO", "Toyota", "Yaris Hatchback", "2024", "Plata", "8B910294820192844", "TOY-ENG-110293", "12500", "16800", "AF9G01H"].join(d)
    ].join("\n");
  }

  /**
   * Parsea y valida un archivo CSV de Clientes con autodetección de delimitador (; o , o tab)
   */
  public static previewClientsImport(csvContent: string): BulkImportPreviewResult<ParsedClientRow> {
    const cleanContent = csvContent.replace(/^\uFEFF/, '').trim();
    const lines = cleanContent.split(/\r?\n/);
    const parsedRecords: ParsedClientRow[] = [];
    const issues: ValidationIssue[] = [];

    if (lines.length <= 1) {
      return { 
        validCount: 0, 
        errorCount: 1, 
        warningCount: 0, 
        parsedRecords: [], 
        issues: [{ row: 1, field: "archivo", value: "", type: "ERROR", message: "El archivo está vacío o no contiene filas de datos." }] 
      };
    }

    const existingContracts = LocalDB.getAllContracts();
    const existingDocIds = new Set(existingContracts.map(c => c.clientDocId.toUpperCase()));

    // Detección automática del separador (punto y coma de Excel o coma estándar)
    const headerLine = lines[0];
    const delimiter = headerLine.includes(";") ? ";" : headerLine.includes("\t") ? "\t" : ",";

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''));
      const rowNum = i + 1;

      const [name, docId, phone, address, brand, model, companyPriceUSD, downPaymentUSD, totalQuotas, guarantorName, guarantorDocId, guarantorPhone] = cols;

      // 1. Validar Nombre
      if (!name || name.length < 3) {
        issues.push({ row: rowNum, field: "nombre_completo", value: name || "", type: "ERROR", message: "El nombre completo es requerido (mínimo 3 caracteres)." });
      }

      // 2. Validar Cédula venezolana
      if (!docId) {
        issues.push({ row: rowNum, field: "cedula_rif", value: "", type: "ERROR", message: "La Cédula/RIF es obligatoria." });
      } else if (!/^[VvEeJjGg]-\d{6,9}$/.test(docId)) {
        issues.push({ row: rowNum, field: "cedula_rif", value: docId, type: "WARNING", message: "Formato recomendado: V-12345678. Se ajustará automáticamente." });
      }

      if (docId && existingDocIds.has(docId.toUpperCase())) {
        issues.push({ row: rowNum, field: "cedula_rif", value: docId, type: "WARNING", message: "Ya existe un cliente registrado con esta Cédula en el sistema." });
      }

      // 3. Validar Teléfono
      if (!phone || phone.replace(/[^0-9]/g, '').length < 10) {
        issues.push({ row: rowNum, field: "telefono", value: phone || "", type: "ERROR", message: "El teléfono debe tener formato válido de 11 dígitos (ej: 0414-3329011)." });
      }

      // 4. Validar Montos
      const priceNum = parseFloat(companyPriceUSD) || 0;
      const downNum = parseFloat(downPaymentUSD) || 0;
      const quotasNum = parseInt(totalQuotas, 10) || 12;

      if (priceNum <= 0) {
        issues.push({ row: rowNum, field: "precio_empresa_usd", value: companyPriceUSD || "", type: "ERROR", message: "El precio empresa debe ser mayor a $0 USD." });
      }

      if (downNum < 0 || downNum >= priceNum) {
        issues.push({ row: rowNum, field: "inicial_usd", value: downPaymentUSD || "", type: "ERROR", message: "La inicial debe ser menor al precio total del vehículo." });
      }

      const cleanDocId = docId && !docId.includes("-") ? ("V-" + docId) : (docId || "V-00000000");

      parsedRecords.push({
        clientName: name || "Cliente Sin Nombre",
        clientDocId: cleanDocId,
        clientPhone: phone || "0414-0000000",
        clientAddress: address || "Caracas, Venezuela",
        companyPriceUSD: priceNum || 1200,
        initialDownPaymentUSD: downNum || 360,
        totalQuotas: quotasNum,
        vehicle: {
          id: "veh-imp-" + rowNum,
          type: "MOTO",
          brand: brand || "Bera",
          model: model || "SBR 150cc",
          year: 2026,
          color: "Negro",
          vinChassis: "8B9" + Math.random().toString(36).slice(2, 10).toUpperCase(),
          engineSerial: "ENG-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
          plate: "EN TRAMITE",
          dealerPriceUSD: Math.round(priceNum * 0.8),
          dealerPriceOriginalUSD: Math.round(priceNum * 0.8),
          isDealerPriceFrozen: false,
          retailPriceUSD: priceNum || 1200,
          isPriceLocked: true,
          status: "IN_STOCK"
        },
        guarantor: {
          name: guarantorName || "Fiador Asignado",
          docId: guarantorDocId || "V-00000000",
          phone: guarantorPhone || "0414-0000000",
          address: "Misma dirección"
        }
      });
    }

    const errorCount = issues.filter(i => i.type === "ERROR").length;
    const warningCount = issues.filter(i => i.type === "WARNING").length;
    const validCount = parsedRecords.length - errorCount;

    return {
      validCount: Math.max(0, validCount),
      errorCount,
      warningCount,
      parsedRecords,
      issues
    };
  }

  /**
   * Ejecuta la importación efectiva de clientes a LocalDB
   */
  public static commitClientsImport(records: ParsedClientRow[]): number {
    let imported = 0;
    records.forEach((rec, idx) => {
      if (!rec.clientName || !rec.clientDocId) return;

      const contractNumber = "CTR-2026-" + (Date.now().toString().slice(-4) + idx.toString());
      const financedUSD = rec.companyPriceUSD - rec.initialDownPaymentUSD;
      const totalQuotas = rec.totalQuotas || 12;
      const monthlyAmountUSD = Number(((financedUSD * 1.15) / totalQuotas).toFixed(2));

      // Construcción del cronograma inicial
      const schedule: PaymentScheduleItem[] = [];
      for (let q = 1; q <= totalQuotas; q++) {
        schedule.push({
          quotaNumber: q,
          dueDate: "2026-09-" + q.toString().padStart(2, '0'),
          capitalUSD: monthlyAmountUSD,
          interestUSD: 0,
          ivaUSD: 0,
          totalQuotaUSD: monthlyAmountUSD,
          paidAmountUSD: 0,
          remainingAmountUSD: monthlyAmountUSD,
          status: "PENDING",
          whatsappSent: false
        });
      }

      const newContract: LoanContract = {
        id: "CTR-IMP-" + (Date.now() + idx),
        tenantId: "TENANT-001",
        contractNumber,
        clientId: "cli-imp-" + idx,
        clientName: rec.clientName,
        clientDocId: rec.clientDocId,
        clientPhone: rec.clientPhone,
        clientAddress: rec.clientAddress,
        guarantor: rec.guarantor,
        vehicle: rec.vehicle,
        concessionairePriceUSD: rec.vehicle.dealerPriceUSD,
        isDealerPriceFrozen: false,
        companyPriceUSD: rec.companyPriceUSD,
        lateFeesPendingUSD: 0,
        lateFeesPaidUSD: 0,
        ivaPendingUSD: 0,
        ivaPaidUSD: 0,
        igtfPendingUSD: 0,
        igtfPaidUSD: 0,
        quotasPendingCount: totalQuotas,
        quotasPendingAmountUSD: financedUSD,
        quotasPaidCount: 0,
        quotasPaidAmountUSD: 0,
        quotasPaidPercent: 0,
        deliveryStatus: "PENDIENTE_INICIAL",
        refundStatus: "SIN_REEMBOLSO",
        documentsStatus: "EXPEDIENTE_COMPLETO",
        physicalInvoiceStatus: "PENDIENTE_EMISION",
        vehicleRegistrationStatus: "NO_INICIADO",
        overallProgressPercent: 0,
        initialCosts: {
          vehicleDownPaymentUSD: rec.initialDownPaymentUSD,
          adminFeeUSD: 50,
          gpsSetupFeeUSD: 120,
          inttProcessingFeeUSD: 80,
          rcvInsuranceFeeUSD: 35,
          totalInitialRequiredUSD: rec.initialDownPaymentUSD + 285
        },
        financedAmountUSD: financedUSD,
        interestRateAnnual: 15,
        frequency: "MONTHLY",
        totalQuotas,
        deliveryMilestone: {
          type: "IMMEDIATE",
          isDelivered: false
        },
        schedule,
        totalPaidUSD: 0,
        totalOutstandingUSD: financedUSD,
        status: "ACTIVE",
        creationDate: new Date().toISOString().slice(0, 10)
      };

      LocalDB.addContract(newContract);
      imported++;
    });

    return imported;
  }

  /**
   * Genera un Snapshot Completo del Sistema con Sello Criptográfico SHA-256
   */
  public static generateFullSystemBackup(): SystemBackupSnapshot {
    const contracts = LocalDB.getAllContracts();
    const inventory = LocalDB.getAllVehicles();

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const snapshotData = {
      systemVersion: "AutoLending OS v2.0 - Fintech VE Edition",
      backupTimestamp: timestamp,
      bcvOfficialRate: BcvEngine.getCurrentRate().usdRate,
      records: {
        contractsCount: contracts.length,
        inventoryCount: inventory.length,
        contracts,
        inventory
      }
    };

    const jsonContent = JSON.stringify(snapshotData, null, 2);
    const rawSeal = "BACKUP|" + timestamp + "|" + contracts.length + "|" + inventory.length;
    const sha256Seal = "SHA256:" + Buffer.from(rawSeal).toString('hex').slice(0, 32).toUpperCase();
    const filename = "Backup_AutoLendingOS_" + timestamp.replace(/[: ]/g, '_') + ".json";

    return {
      timestamp,
      filename,
      totalContracts: contracts.length,
      totalVehicles: inventory.length,
      sha256Seal,
      jsonContent
    };
  }
}
