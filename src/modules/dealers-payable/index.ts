"use client";

import { LoanContract, VehicleSpec } from '../../types';
import { BcvEngine } from '../bcv-engine';

export type DealerUnitStatus = 
  | 'PENDIENTE_CONFIRMACION_VIN'
  | 'EN_ALISTAMIENTO_TALLER'
  | 'LISTA_PARA_RETIRO'
  | 'RETIRADA_POR_CLIENTE';

export type PayableStatus = 'PENDIENTE_PAGO' | 'PAGO_PARCIAL' | 'LIQUIDADO_TOTAL';

export interface DealerPartner {
  id: string;
  commercialName: string;
  legalName: string;
  rif: string;
  city: string;
  address: string;
  contactName: string;
  contactRole: string;
  contactPhone: string;
  paymentTerms: string; // Ej: "Pago contra retiro de unidad"
  totalUnitsDeliveredCount: number;
  totalPayableUSD: number;
  totalPaidUSD: number;
}

export interface DealerOrderTracking {
  id: string;
  dealerId: string;
  dealerName: string;
  contactPhone: string;
  contactName: string;
  contractNumber: string;
  clientName: string;
  clientDocId: string;
  vehicleModel: string;
  vehicleColor: string;
  vinChassis?: string;
  engineSerial?: string;
  dealerPriceUSD: number;
  status: DealerUnitStatus;
  daysWaiting: number;
  payableStatus: PayableStatus;
  paymentReference?: string;
  orderDate: string;
  deliveryDate?: string;
}

export class DealersPayableEngine {
  private static dealers: DealerPartner[] = [
    {
      id: "DLR-001",
      commercialName: "Bera Motors Catia",
      legalName: "Inversiones Bera Capital C.A.",
      rif: "J-40192841-1",
      city: "Caracas",
      address: "Av. Sucre, Centro Comercial Catia",
      contactName: "Carlos Mendoza",
      contactRole: "Gerente de Ventas",
      contactPhone: "0414-2291048",
      paymentTerms: "Contado contra entrega",
      totalUnitsDeliveredCount: 14,
      totalPayableUSD: 1100.00,
      totalPaidUSD: 13500.00
    },
    {
      id: "DLR-002",
      commercialName: "Empire Keeway La Bandera",
      legalName: "Distribuidora EK Caracas C.A.",
      rif: "J-31920491-2",
      city: "Caracas",
      address: "Av. Nueva Granada, sector La Bandera",
      contactName: "Franklin Barreto",
      contactRole: "Jefe de Despacho",
      contactPhone: "0412-8819203",
      paymentTerms: "Crédito 5 días",
      totalUnitsDeliveredCount: 8,
      totalPayableUSD: 1200.00,
      totalPaidUSD: 8400.00
    },
    {
      id: "DLR-003",
      commercialName: "Motos Toro Valencia",
      legalName: "Comercializadora Toro Carabobo C.A.",
      rif: "J-50291048-9",
      city: "Valencia",
      address: "Av. Bolívar Norte, frente al CC Camoruco",
      contactName: "Valentina Salazar",
      contactRole: "Coordinadora de Entregas",
      contactPhone: "0424-4491029",
      paymentTerms: "Pago anticipado 50% / 50% al retiro",
      totalUnitsDeliveredCount: 6,
      totalPayableUSD: 0.00,
      totalPaidUSD: 6900.00
    }
  ];

  private static orders: DealerOrderTracking[] = [
    {
      id: "ORD-2026-001",
      dealerId: "DLR-001",
      dealerName: "Bera Motors Catia",
      contactPhone: "0414-2291048",
      contactName: "Carlos Mendoza",
      contractNumber: "CTR-2026-001",
      clientName: "José Gregorio Castillo",
      clientDocId: "V-18492019",
      vehicleModel: "Bera SBR 150cc",
      vehicleColor: "Azul Eléctrico",
      vinChassis: "8B8BERA2026SBR8491",
      engineSerial: "162FMJ-948102",
      dealerPriceUSD: 1100.00,
      status: "RETIRADA_POR_CLIENTE",
      daysWaiting: 0,
      payableStatus: "LIQUIDADO_TOTAL",
      paymentReference: "TRF-BANESCO-849201",
      orderDate: "2026-08-10",
      deliveryDate: "2026-08-12"
    },
    {
      id: "ORD-2026-002",
      dealerId: "DLR-002",
      dealerName: "Empire Keeway La Bandera",
      contactPhone: "0412-8819203",
      contactName: "Franklin Barreto",
      contractNumber: "CTR-2026-002",
      clientName: "Carlos Eduardo Pérez",
      clientDocId: "V-20192844",
      vehicleModel: "Empire Keeway EK Express 150",
      vehicleColor: "Rojo Escarlata",
      vinChassis: "8EK2026EXPRESS0092",
      dealerPriceUSD: 1200.00,
      status: "LISTA_PARA_RETIRO",
      daysWaiting: 2,
      payableStatus: "PENDIENTE_PAGO",
      orderDate: "2026-08-22"
    },
    {
      id: "ORD-2026-003",
      dealerId: "DLR-001",
      dealerName: "Bera Motors Catia",
      contactPhone: "0414-2291048",
      contactName: "Carlos Mendoza",
      contractNumber: "CTR-2026-003",
      clientName: "María Elena Gómez",
      clientDocId: "V-22849102",
      vehicleModel: "Bera Kavak 150cc",
      vehicleColor: "Negro Mate",
      dealerPriceUSD: 1150.00,
      status: "EN_ALISTAMIENTO_TALLER",
      daysWaiting: 4,
      payableStatus: "PENDIENTE_PAGO",
      orderDate: "2026-08-20"
    }
  ];

  public static getAllDealers(): DealerPartner[] {
    return [...this.dealers];
  }

  public static getAllOrders(): DealerOrderTracking[] {
    return [...this.orders];
  }

  /**
   * Genera el enlace y mensaje de WhatsApp de seguimiento directo al vendedor del concesionario
   */
  public static generateDealerFollowupWhatsApp(order: DealerOrderTracking): { phoneUrl: string; message: string } {
    const cleanPhone = "58" + order.contactPhone.replace(/[^0-9]/g, '').replace(/^0/, '');
    
    let text = "";
    if (order.status === "PENDIENTE_CONFIRMACION_VIN") {
      text = "Hola " + order.contactName + " (" + order.dealerName + "), te escribimos del departamento de operaciones de financiamiento. Queremos consultar si ya tienen asignado el serial de chasis (VIN) y motor para la " + order.vehicleModel + " del cliente " + order.clientName + " (CI: " + order.clientDocId + "). ¡Quedamos atentos para programar la entrega!";
    } else if (order.status === "EN_ALISTAMIENTO_TALLER") {
      text = "Hola " + order.contactName + " (" + order.dealerName + "), un saludo. Te escribimos para hacer seguimiento a la " + order.vehicleModel + " del cliente " + order.clientName + " (Contrato #" + order.contractNumber + "). ¿Cómo va el alistamiento de taller (batería, espejos y verificación técnica)? El cliente está listo para pasar a retirar.";
    } else if (order.status === "LISTA_PARA_RETIRO") {
      text = "Hola " + order.contactName + " (" + order.dealerName + "), te confirmamos que el cliente " + order.clientName + " (CI: " + order.clientDocId + ") estará pasando por la tienda hoy con su cédula laminada y comprobante de autorización para retirar la " + order.vehicleModel + ". Por favor coordinar la entrega y la firma del acta de recepción.";
    } else {
      text = "Hola " + order.contactName + " (" + order.dealerName + "), te escribimos para solicitar la copia de la factura fiscal y confirmación de recepción final de la " + order.vehicleModel + " entregada al cliente " + order.clientName + ". ¡Muchas gracias!";
    }

    const phoneUrl = "https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent(text);
    return { phoneUrl, message: text };
  }

  /**
   * Registra la liquidación o pago realizado a un concesionario
   */
  public static recordPaymentToDealer(orderId: string, reference: string, paymentMethod: string): DealerOrderTracking {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error("Orden de concesionario no encontrada.");
    }

    order.payableStatus = "LIQUIDADO_TOTAL";
    order.paymentReference = reference + " (" + paymentMethod + ")";

    // Actualizar balance del concesionario
    const dealer = this.dealers.find(d => d.id === order.dealerId);
    if (dealer) {
      dealer.totalPayableUSD = Math.max(0, dealer.totalPayableUSD - order.dealerPriceUSD);
      dealer.totalPaidUSD += order.dealerPriceUSD;
    }

    return order;
  }

  /**
   * Cambia el estatus de preparación de la unidad en tienda
   */
  public static updateUnitStatus(orderId: string, newStatus: DealerUnitStatus, vin?: string): DealerOrderTracking {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error("Orden no encontrada.");
    }

    order.status = newStatus;
    if (vin) order.vinChassis = vin;
    if (newStatus === "RETIRADA_POR_CLIENTE" && !order.deliveryDate) {
      order.deliveryDate = new Date().toISOString().slice(0, 10);
    }

    return order;
  }
}
