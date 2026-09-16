import { LoanContract, VehicleSpec, PromoCampaign } from '../../types';
import { FinancialCore } from '../financial-core';

export interface LocalDatabaseState {
  contracts: LoanContract[];
  vehicles: VehicleSpec[];
  promotions: PromoCampaign[];
}

export class LocalDB {
  private static state: LocalDatabaseState = {
    vehicles: [
      {
        id: "veh-001",
        type: "MOTO",
        brand: "Bera",
        model: "SBR 150cc",
        year: 2026,
        color: "Azul Eléctrico",
        vinChassis: "8B8BERA2026SBR8491",
        engineSerial: "162FMJ-948102",
        plate: "AI8X92M",
        dealerPriceUSD: 1100,
        dealerPriceOriginalUSD: 1100,
        isDealerPriceFrozen: true,
        retailPriceUSD: 1450,
        isPriceLocked: false,
        status: "DELIVERED"
      },
      {
        id: "veh-002",
        type: "MOTO",
        brand: "Empire Keeway",
        model: "EK Express 150",
        year: 2026,
        color: "Rojo Escarlata",
        vinChassis: "8EK2026EXPRESS0092",
        engineSerial: "157FMI-881920",
        plate: "EN TRÁMITE",
        dealerPriceUSD: 1200,
        dealerPriceOriginalUSD: 1200,
        isDealerPriceFrozen: false,
        retailPriceUSD: 1550,
        isPriceLocked: true,
        status: "ASSIGNED"
      },
      {
        id: "veh-003",
        type: "MOTO",
        brand: "Bera",
        model: "Kavak 150cc",
        year: 2026,
        color: "Negro Mate",
        vinChassis: "8B8BERA2026KVK7712",
        engineSerial: "162FMJ-330192",
        plate: "AE3K81P",
        dealerPriceUSD: 1150,
        dealerPriceOriginalUSD: 1150,
        isDealerPriceFrozen: true,
        retailPriceUSD: 1500,
        isPriceLocked: false,
        status: "DELIVERED"
      },
      {
        id: "veh-004",
        type: "CARRO",
        brand: "Chery",
        model: "Arauca 1.3L",
        year: 2025,
        color: "Plata Brillante",
        vinChassis: "8CH2025ARAUCA4491",
        engineSerial: "SQR473F-90182",
        plate: "AH729LA",
        dealerPriceUSD: 5200,
        dealerPriceOriginalUSD: 5200,
        isDealerPriceFrozen: true,
        retailPriceUSD: 6800,
        isPriceLocked: true,
        status: "RELEASED"
      },
      {
        id: "veh-005",
        type: "MOTO",
        brand: "Toro",
        model: "TR-150 Fox",
        year: 2026,
        color: "Blanco Perla",
        vinChassis: "8TR2026FOX00881",
        engineSerial: "156FMI-772190",
        plate: "EN TRÁMITE",
        dealerPriceUSD: 1050,
        dealerPriceOriginalUSD: 1050,
        isDealerPriceFrozen: false,
        retailPriceUSD: 1400,
        isPriceLocked: false,
        status: "IN_STOCK"
      },
      {
        id: "veh-006",
        type: "MOTO",
        brand: "Bera",
        model: "Meru 150cc",
        year: 2026,
        color: "Gris Nardo",
        vinChassis: "8B8BERA2026MRU9921",
        engineSerial: "162FMJ-551029",
        plate: "EN TRÁMITE",
        dealerPriceUSD: 1120,
        dealerPriceOriginalUSD: 1120,
        isDealerPriceFrozen: false,
        retailPriceUSD: 1480,
        isPriceLocked: false,
        status: "IN_STOCK"
      }
    ],
    contracts: [
      // 1. ENTREGADO & ACTIVO PUNTUAL
      {
        id: "ctr-001",
        tenantId: "tenant-autolending",
        contractNumber: "CTR-VEH-2026-089",
        clientId: "cli-001",
        clientName: "Carlos Eduardo Mendoza",
        clientDocId: "V-18.942.301",
        clientPhone: "+58 412-555-8921",
        clientAddress: "Av. Francisco de Miranda, Chacao, Caracas",
        guarantor: {
          name: "Elena Mendoza",
          docId: "V-20.192.481",
          phone: "+58 414-990-1289",
          address: "Av. Francisco de Miranda, Caracas",
          relationship: "Hermana"
        },
        vehicle: {
          id: "veh-001",
          type: "MOTO",
          brand: "Bera",
          model: "SBR 150cc",
          year: 2026,
          color: "Azul Eléctrico",
          vinChassis: "8B8BERA2026SBR8491",
          engineSerial: "162FMJ-948102",
          plate: "AI8X92M",
          dealerPriceUSD: 1100,
          dealerPriceOriginalUSD: 1100,
          isDealerPriceFrozen: true,
          retailPriceUSD: 1450,
          isPriceLocked: false,
          status: "DELIVERED"
        },
        concessionairePriceUSD: 1100,
        isDealerPriceFrozen: true,
        companyPriceUSD: 1450,
        lateFeesPendingUSD: 0,
        lateFeesPaidUSD: 0,
        ivaPendingUSD: 12.80,
        ivaPaidUSD: 6.40,
        igtfPendingUSD: 0,
        igtfPaidUSD: 1.50,
        quotasPendingCount: 4,
        quotasPendingAmountUSD: 747.36,
        quotasPaidCount: 2,
        quotasPaidAmountUSD: 373.68,
        quotasPaidPercent: 33.3,
        deliveryStatus: "ENTREGADO",
        refundStatus: "SIN_REEMBOLSO",
        documentsStatus: "EXPEDIENTE_COMPLETO",
        physicalInvoiceStatus: "EMITIDA_EN_BOVEDA",
        vehicleRegistrationStatus: "PLACAS_ASIGNADAS",
        overallProgressPercent: 68.3,
        initialCosts: {
          vehicleDownPaymentUSD: 435,
          adminFeeUSD: 50,
          gpsSetupFeeUSD: 120,
          inttProcessingFeeUSD: 80,
          rcvInsuranceFeeUSD: 35,
          totalInitialRequiredUSD: 720
        },
        financedAmountUSD: 1015,
        interestRateAnnual: 18,
        frequency: "MONTHLY",
        totalQuotas: 6,
        deliveryMilestone: {
          type: "IMMEDIATE",
          isDelivered: true,
          deliveredDate: "2026-06-15"
        },
        schedule: [
          {
            quotaNumber: 1,
            dueDate: "2026-07-15",
            capitalUSD: 169.17,
            interestUSD: 15.23,
            ivaUSD: 2.44,
            igtfUSD: 1.50,
            totalQuotaUSD: 186.84,
            paidAmountUSD: 186.84,
            remainingAmountUSD: 0,
            status: "PAID",
            paidDate: "2026-07-14",
            receiptNumber: "REC-CTR-089-Q1",
            paymentMethod: "CASH_USD",
            paymentReference: "EFECTIVO-BOVEDA-01",
            whatsappSent: true
          },
          {
            quotaNumber: 2,
            dueDate: "2026-08-15",
            capitalUSD: 169.17,
            interestUSD: 15.23,
            ivaUSD: 2.44,
            totalQuotaUSD: 186.84,
            paidAmountUSD: 186.84,
            remainingAmountUSD: 0,
            status: "PAID",
            paidDate: "2026-08-14",
            receiptNumber: "REC-CTR-089-Q2",
            paymentMethod: "PAGO_MOVIL",
            paymentReference: "PM-881920",
            whatsappSent: true
          },
          {
            quotaNumber: 3,
            dueDate: "2026-09-15",
            capitalUSD: 169.17,
            interestUSD: 15.23,
            ivaUSD: 2.44,
            totalQuotaUSD: 186.84,
            paidAmountUSD: 0,
            remainingAmountUSD: 186.84,
            status: "PENDING",
            whatsappSent: false
          }
        ],
        totalPaidUSD: 373.68,
        totalOutstandingUSD: 747.36,
        status: "ACTIVE",
        creationDate: "2026-06-10"
      },

      // 2. POR VISITAR (Alcanzó 3 cuotas puntuales, listo para visita domiciliaria a cliente y fiador)
      {
        id: "ctr-002",
        tenantId: "tenant-autolending",
        contractNumber: "CTR-VEH-2026-094",
        clientId: "cli-002",
        clientName: "Mariana Rivas Colmenares",
        clientDocId: "V-24.108.992",
        clientPhone: "+58 414-789-0123",
        clientAddress: "Av. Urdaneta, La Candelaria, Caracas",
        guarantor: {
          name: "Roberto Rivas",
          docId: "V-15.302.190",
          phone: "+58 424-331-9988",
          address: "La Candelaria, Caracas",
          relationship: "Padre"
        },
        vehicle: {
          id: "veh-002",
          type: "MOTO",
          brand: "Empire Keeway",
          model: "EK Express 150",
          year: 2026,
          color: "Rojo Escarlata",
          vinChassis: "8EK2026EXPRESS0092",
          engineSerial: "157FMI-881920",
          plate: "EN TRÁMITE",
          dealerPriceUSD: 1200,
          dealerPriceOriginalUSD: 1200,
          isDealerPriceFrozen: false,
          retailPriceUSD: 1550,
          isPriceLocked: true,
          status: "ASSIGNED"
        },
        concessionairePriceUSD: 1200,
        isDealerPriceFrozen: false,
        companyPriceUSD: 1550,
        lateFeesPendingUSD: 0,
        lateFeesPaidUSD: 0,
        ivaPendingUSD: 14.50,
        ivaPaidUSD: 7.80,
        igtfPendingUSD: 0,
        igtfPaidUSD: 0,
        quotasPendingCount: 3,
        quotasPendingAmountUSD: 599.13,
        quotasPaidCount: 3,
        quotasPaidAmountUSD: 599.13,
        quotasPaidPercent: 50.0,
        deliveryStatus: "POR_VISITAR",
        refundStatus: "SIN_REEMBOLSO",
        documentsStatus: "EXPEDIENTE_COMPLETO",
        physicalInvoiceStatus: "PENDIENTE_EMISION",
        vehicleRegistrationStatus: "TRAMITE_INTT_EN_CURSO",
        overallProgressPercent: 65.0,
        initialCosts: {
          vehicleDownPaymentUSD: 465,
          adminFeeUSD: 50,
          gpsSetupFeeUSD: 120,
          inttProcessingFeeUSD: 80,
          rcvInsuranceFeeUSD: 35,
          totalInitialRequiredUSD: 750
        },
        financedAmountUSD: 1085,
        interestRateAnnual: 18,
        frequency: "MONTHLY",
        totalQuotas: 6,
        deliveryMilestone: {
          type: "ACCUMULATED_QUOTAS",
          requiredQuotasToDeliver: 3,
          isDelivered: false
        },
        schedule: [
          {
            quotaNumber: 1,
            dueDate: "2026-06-01",
            capitalUSD: 180.83,
            interestUSD: 16.28,
            ivaUSD: 2.60,
            totalQuotaUSD: 199.71,
            paidAmountUSD: 199.71,
            remainingAmountUSD: 0,
            status: "PAID",
            paidDate: "2026-05-30",
            receiptNumber: "REC-094-Q1",
            paymentMethod: "PAGO_MOVIL",
            whatsappSent: true
          },
          {
            quotaNumber: 2,
            dueDate: "2026-07-01",
            capitalUSD: 180.83,
            interestUSD: 16.28,
            ivaUSD: 2.60,
            totalQuotaUSD: 199.71,
            paidAmountUSD: 199.71,
            remainingAmountUSD: 0,
            status: "PAID",
            paidDate: "2026-06-29",
            receiptNumber: "REC-094-Q2",
            paymentMethod: "PAGO_MOVIL",
            whatsappSent: true
          },
          {
            quotaNumber: 3,
            dueDate: "2026-08-01",
            capitalUSD: 180.83,
            interestUSD: 16.28,
            ivaUSD: 2.60,
            totalQuotaUSD: 199.71,
            paidAmountUSD: 199.71,
            remainingAmountUSD: 0,
            status: "PAID",
            paidDate: "2026-07-31",
            receiptNumber: "REC-094-Q3",
            paymentMethod: "PAGO_MOVIL",
            whatsappSent: true
          }
        ],
        totalPaidUSD: 599.13,
        totalOutstandingUSD: 599.13,
        status: "POR_VISITAR",
        creationDate: "2026-05-10"
      },

      // 3. POR RECUPERAR (Moto entregada y 2 meses sin pagar -> Equipo de recuperación en campo)
      {
        id: "ctr-003",
        tenantId: "tenant-autolending",
        contractNumber: "CTR-VEH-2026-041",
        clientId: "cli-003",
        clientName: "José Gregorio Castillo",
        clientDocId: "V-14.890.112",
        clientPhone: "+58 416-221-4455",
        clientAddress: "Catia, Calle El Carmen, Local 12, Caracas",
        guarantor: {
          name: "Manuel Castillo",
          docId: "V-12.441.900",
          phone: "+58 412-887-1122",
          address: "Catia, Caracas",
          relationship: "Hermano"
        },
        vehicle: {
          id: "veh-003",
          type: "MOTO",
          brand: "Bera",
          model: "Kavak 150cc",
          year: 2026,
          color: "Negro Mate",
          vinChassis: "8B8BERA2026KVK7712",
          engineSerial: "162FMJ-330192",
          plate: "AE3K81P",
          dealerPriceUSD: 1150,
          dealerPriceOriginalUSD: 1150,
          isDealerPriceFrozen: true,
          retailPriceUSD: 1500,
          isPriceLocked: false,
          status: "DELIVERED"
        },
        concessionairePriceUSD: 1150,
        isDealerPriceFrozen: true,
        companyPriceUSD: 1500,
        lateFeesPendingUSD: 10.00,
        lateFeesPaidUSD: 0,
        ivaPendingUSD: 18.20,
        ivaPaidUSD: 4.80,
        igtfPendingUSD: 0,
        igtfPaidUSD: 0,
        quotasPendingCount: 4,
        quotasPendingAmountUSD: 773.08,
        quotasPaidCount: 2,
        quotasPaidAmountUSD: 386.54,
        quotasPaidPercent: 33.3,
        deliveryStatus: "POR_RECUPERAR",
        refundStatus: "SIN_REEMBOLSO",
        documentsStatus: "EXPEDIENTE_COMPLETO",
        physicalInvoiceStatus: "EMITIDA_EN_BOVEDA",
        vehicleRegistrationStatus: "PLACAS_ASIGNADAS",
        overallProgressPercent: 51.6,
        initialCosts: {
          vehicleDownPaymentUSD: 450,
          adminFeeUSD: 50,
          gpsSetupFeeUSD: 120,
          inttProcessingFeeUSD: 80,
          rcvInsuranceFeeUSD: 35,
          totalInitialRequiredUSD: 735
        },
        financedAmountUSD: 1050,
        interestRateAnnual: 18,
        frequency: "MONTHLY",
        totalQuotas: 6,
        deliveryMilestone: {
          type: "IMMEDIATE",
          isDelivered: true,
          deliveredDate: "2026-04-10"
        },
        schedule: [
          {
            quotaNumber: 1,
            dueDate: "2026-05-10",
            capitalUSD: 175.00,
            interestUSD: 15.75,
            ivaUSD: 2.52,
            totalQuotaUSD: 193.27,
            paidAmountUSD: 193.27,
            remainingAmountUSD: 0,
            status: "PAID",
            paidDate: "2026-05-09",
            receiptNumber: "REC-CTR-041-Q1",
            paymentMethod: "PAGO_MOVIL",
            whatsappSent: true
          },
          {
            quotaNumber: 2,
            dueDate: "2026-06-10",
            capitalUSD: 175.00,
            interestUSD: 15.75,
            ivaUSD: 2.52,
            totalQuotaUSD: 193.27,
            paidAmountUSD: 193.27,
            remainingAmountUSD: 0,
            status: "PAID",
            paidDate: "2026-06-11",
            receiptNumber: "REC-CTR-041-Q2",
            paymentMethod: "PAGO_MOVIL",
            whatsappSent: true
          },
          {
            quotaNumber: 3,
            dueDate: "2026-07-10",
            capitalUSD: 175.00,
            interestUSD: 15.75,
            ivaUSD: 2.52,
            totalQuotaUSD: 193.27,
            paidAmountUSD: 0,
            remainingAmountUSD: 193.27,
            status: "OVERDUE",
            whatsappSent: false
          },
          {
            quotaNumber: 4,
            dueDate: "2026-08-10",
            capitalUSD: 175.00,
            interestUSD: 15.75,
            ivaUSD: 2.52,
            totalQuotaUSD: 193.27,
            paidAmountUSD: 0,
            remainingAmountUSD: 193.27,
            status: "OVERDUE",
            whatsappSent: false
          }
        ],
        totalPaidUSD: 386.54,
        totalOutstandingUSD: 773.08,
        status: "POR_RECUPERAR",
        creationDate: "2026-04-01"
      },

      // 4. EXPIRADO (Sin moto y > 3 meses impagos -> Suspendido permanente sin derecho a retiro)
      {
        id: "ctr-004",
        tenantId: "tenant-autolending",
        contractNumber: "CTR-VEH-2026-012",
        clientId: "cli-004",
        clientName: "Luis Alberto Ramos",
        clientDocId: "V-21.340.512",
        clientPhone: "+58 412-990-3344",
        clientAddress: "Petare, Barrio Unión, Caracas",
        guarantor: {
          name: "Carmen Ramos",
          docId: "V-13.882.110",
          phone: "+58 414-220-1122",
          address: "Petare, Caracas",
          relationship: "Madre"
        },
        vehicle: {
          id: "veh-005",
          type: "MOTO",
          brand: "Toro",
          model: "TR-150 Fox",
          year: 2026,
          color: "Blanco Perla",
          vinChassis: "8TR2026FOX00881",
          engineSerial: "156FMI-772190",
          plate: "EN TRÁMITE",
          dealerPriceUSD: 1050,
          dealerPriceOriginalUSD: 1050,
          isDealerPriceFrozen: false,
          retailPriceUSD: 1400,
          isPriceLocked: false,
          status: "IN_STOCK"
        },
        concessionairePriceUSD: 1050,
        isDealerPriceFrozen: false,
        companyPriceUSD: 1400,
        lateFeesPendingUSD: 15.00,
        lateFeesPaidUSD: 0,
        ivaPendingUSD: 22.40,
        ivaPaidUSD: 0,
        igtfPendingUSD: 0,
        igtfPaidUSD: 0,
        quotasPendingCount: 6,
        quotasPendingAmountUSD: 980.00,
        quotasPaidCount: 0,
        quotasPaidAmountUSD: 0,
        quotasPaidPercent: 0,
        deliveryStatus: "ACUMULANDO_CUOTAS",
        refundStatus: "SIN_REEMBOLSO",
        isExpiredPermanently: true,
        documentsStatus: "PENDIENTE_RECEPCION",
        physicalInvoiceStatus: "PENDIENTE_EMISION",
        vehicleRegistrationStatus: "NO_INICIADO",
        overallProgressPercent: 2.0,
        initialCosts: {
          vehicleDownPaymentUSD: 420,
          adminFeeUSD: 50,
          gpsSetupFeeUSD: 120,
          inttProcessingFeeUSD: 80,
          rcvInsuranceFeeUSD: 35,
          totalInitialRequiredUSD: 705
        },
        financedAmountUSD: 980,
        interestRateAnnual: 18,
        frequency: "MONTHLY",
        totalQuotas: 6,
        deliveryMilestone: {
          type: "ACCUMULATED_QUOTAS",
          requiredQuotasToDeliver: 3,
          isDelivered: false
        },
        schedule: [
          {
            quotaNumber: 1,
            dueDate: "2026-05-01",
            capitalUSD: 163.33,
            interestUSD: 14.70,
            ivaUSD: 2.35,
            totalQuotaUSD: 180.38,
            paidAmountUSD: 0,
            remainingAmountUSD: 180.38,
            status: "OVERDUE",
            whatsappSent: false
          },
          {
            quotaNumber: 2,
            dueDate: "2026-06-01",
            capitalUSD: 163.33,
            interestUSD: 14.70,
            ivaUSD: 2.35,
            totalQuotaUSD: 180.38,
            paidAmountUSD: 0,
            remainingAmountUSD: 180.38,
            status: "OVERDUE",
            whatsappSent: false
          },
          {
            quotaNumber: 3,
            dueDate: "2026-07-01",
            capitalUSD: 163.33,
            interestUSD: 14.70,
            ivaUSD: 2.35,
            totalQuotaUSD: 180.38,
            paidAmountUSD: 0,
            remainingAmountUSD: 180.38,
            status: "OVERDUE",
            whatsappSent: false
          }
        ],
        totalPaidUSD: 420.00, // Pagó la inicial pero abandonó el crédito
        totalOutstandingUSD: 980.00,
        status: "EXPIRADO",
        creationDate: "2026-04-15"
      },

      // 5. POR REEMBOLSAR (Justificación aprobada: retención 30% gastos, devolución 70% restante)
      {
        id: "ctr-005",
        tenantId: "tenant-autolending",
        contractNumber: "CTR-VEH-2026-055",
        clientId: "cli-005",
        clientName: "Ana Patricia Gómez",
        clientDocId: "V-26.789.441",
        clientPhone: "+58 414-331-5566",
        clientAddress: "El Valle, Calle 4, Caracas",
        guarantor: {
          name: "Jorge Gómez",
          docId: "V-16.550.901",
          phone: "+58 424-110-8899",
          address: "El Valle, Caracas",
          relationship: "Padre"
        },
        vehicle: {
          id: "veh-006",
          type: "MOTO",
          brand: "Bera",
          model: "Meru 150cc",
          year: 2026,
          color: "Gris Nardo",
          vinChassis: "8B8BERA2026MRU9921",
          engineSerial: "162FMJ-551029",
          plate: "EN TRÁMITE",
          dealerPriceUSD: 1120,
          dealerPriceOriginalUSD: 1120,
          isDealerPriceFrozen: false,
          retailPriceUSD: 1480,
          isPriceLocked: false,
          status: "IN_STOCK"
        },
        concessionairePriceUSD: 1120,
        isDealerPriceFrozen: false,
        companyPriceUSD: 1480,
        lateFeesPendingUSD: 0,
        lateFeesPaidUSD: 0,
        ivaPendingUSD: 0,
        ivaPaidUSD: 4.80,
        igtfPendingUSD: 0,
        igtfPaidUSD: 0,
        quotasPendingCount: 0,
        quotasPendingAmountUSD: 0,
        quotasPaidCount: 1,
        quotasPaidAmountUSD: 500.00,
        quotasPaidPercent: 16.6,
        deliveryStatus: "PENDIENTE_INICIAL",
        refundStatus: "POR_REEMBOLSAR",
        refundDetails: {
          totalPaidUSD: 500.00,
          companyRetention30PercentUSD: 150.00,
          clientRefund70PercentUSD: 350.00,
          approvedByManagement: true,
          reason: "Informe médico certificado por intervención quirúrgica. Aprobado por Gerencia General."
        },
        documentsStatus: "EXPEDIENTE_COMPLETO",
        physicalInvoiceStatus: "PENDIENTE_EMISION",
        vehicleRegistrationStatus: "NO_INICIADO",
        overallProgressPercent: 15.0,
        initialCosts: {
          vehicleDownPaymentUSD: 444,
          adminFeeUSD: 50,
          gpsSetupFeeUSD: 120,
          inttProcessingFeeUSD: 80,
          rcvInsuranceFeeUSD: 35,
          totalInitialRequiredUSD: 729
        },
        financedAmountUSD: 1036,
        interestRateAnnual: 18,
        frequency: "MONTHLY",
        totalQuotas: 6,
        deliveryMilestone: {
          type: "ACCUMULATED_QUOTAS",
          requiredQuotasToDeliver: 3,
          isDelivered: false
        },
        schedule: [
          {
            quotaNumber: 1,
            dueDate: "2026-07-01",
            capitalUSD: 172.67,
            interestUSD: 15.54,
            ivaUSD: 2.49,
            totalQuotaUSD: 190.70,
            paidAmountUSD: 500.00,
            remainingAmountUSD: 0,
            status: "PAID",
            paidDate: "2026-06-25",
            receiptNumber: "REC-055-Q1",
            paymentMethod: "PAGO_MOVIL",
            whatsappSent: true
          }
        ],
        totalPaidUSD: 500.00,
        totalOutstandingUSD: 0,
        status: "POR_REEMBOLSAR",
        creationDate: "2026-06-15"
      },

      // 6. POR ENTREGAR / ACUMULANDO CUOTAS
      {
        id: "ctr-006",
        tenantId: "tenant-autolending",
        contractNumber: "CTR-VEH-2026-077",
        clientId: "cli-006",
        clientName: "David Alejandro Zambrano",
        clientDocId: "V-22.450.812",
        clientPhone: "+58 412-881-2299",
        clientAddress: "San Bernardino, Caracas",
        guarantor: {
          name: "Beatriz Zambrano",
          docId: "V-14.220.190",
          phone: "+58 414-900-1122",
          address: "San Bernardino, Caracas",
          relationship: "Tía"
        },
        vehicle: {
          id: "veh-001",
          type: "MOTO",
          brand: "Bera",
          model: "SBR 150cc",
          year: 2026,
          color: "Azul Eléctrico",
          vinChassis: "8B8BERA2026SBR8491",
          engineSerial: "162FMJ-948102",
          plate: "EN TRÁMITE",
          dealerPriceUSD: 1100,
          dealerPriceOriginalUSD: 1100,
          isDealerPriceFrozen: false,
          retailPriceUSD: 1450,
          isPriceLocked: false,
          status: "ASSIGNED"
        },
        concessionairePriceUSD: 1100,
        isDealerPriceFrozen: false,
        companyPriceUSD: 1450,
        lateFeesPendingUSD: 0,
        lateFeesPaidUSD: 0,
        ivaPendingUSD: 19.50,
        ivaPaidUSD: 3.90,
        igtfPendingUSD: 0,
        igtfPaidUSD: 0,
        quotasPendingCount: 5,
        quotasPendingAmountUSD: 850.00,
        quotasPaidCount: 1,
        quotasPaidAmountUSD: 170.00,
        quotasPaidPercent: 16.6,
        deliveryStatus: "ACUMULANDO_CUOTAS",
        refundStatus: "SIN_REEMBOLSO",
        documentsStatus: "EXPEDIENTE_COMPLETO",
        physicalInvoiceStatus: "PENDIENTE_EMISION",
        vehicleRegistrationStatus: "TRAMITE_INTT_EN_CURSO",
        overallProgressPercent: 35.0,
        initialCosts: {
          vehicleDownPaymentUSD: 435,
          adminFeeUSD: 50,
          gpsSetupFeeUSD: 120,
          inttProcessingFeeUSD: 80,
          rcvInsuranceFeeUSD: 35,
          totalInitialRequiredUSD: 720
        },
        financedAmountUSD: 1015,
        interestRateAnnual: 18,
        frequency: "MONTHLY",
        totalQuotas: 6,
        deliveryMilestone: {
          type: "ACCUMULATED_QUOTAS",
          requiredQuotasToDeliver: 3,
          isDelivered: false
        },
        schedule: [
          {
            quotaNumber: 1,
            dueDate: "2026-08-01",
            capitalUSD: 169.17,
            interestUSD: 15.23,
            ivaUSD: 2.44,
            totalQuotaUSD: 186.84,
            paidAmountUSD: 186.84,
            remainingAmountUSD: 0,
            status: "PAID",
            paidDate: "2026-07-28",
            receiptNumber: "REC-077-Q1",
            paymentMethod: "PAGO_MOVIL",
            whatsappSent: true
          },
          {
            quotaNumber: 2,
            dueDate: "2026-09-01",
            capitalUSD: 169.17,
            interestUSD: 15.23,
            ivaUSD: 2.44,
            totalQuotaUSD: 186.84,
            paidAmountUSD: 0,
            remainingAmountUSD: 186.84,
            status: "PENDING",
            whatsappSent: false
          }
        ],
        totalPaidUSD: 186.84,
        totalOutstandingUSD: 828.16,
        status: "ACTIVE",
        creationDate: "2026-07-15"
      }
    ],
    promotions: [
      {
        id: "promo-001",
        code: "BERA-EXPRESS-48H",
        title: "Combo Bera SBR + Casco DOT",
        description: "Inicial reducida al 25% + Casco certificado incluido en las primeras 48 horas.",
        discountPercent: 5,
        reducedDownPaymentUSD: 350,
        startDate: "2026-08-20",
        expirationDate: "2026-08-28 23:59:59",
        maxSlots: 15,
        usedSlots: 9,
        isActive: true,
        termsAndConditions: "Promoción válida únicamente durante la vigencia especificada o hasta agotarse los 15 cupos asignados."
      },
      {
        id: "promo-002",
        code: "KEEWAY-FLEX-AGOSTO",
        title: "Keeway Express Cero Gastos Adm",
        description: "100% de descuento en el fee administrativo ($50 de ahorro directo).",
        discountPercent: 0,
        startDate: "2026-08-01",
        expirationDate: "2026-08-31 23:59:59",
        maxSlots: 20,
        usedSlots: 14,
        isActive: true,
        termsAndConditions: "Aplica para pagos de inicial de contado."
      }
    ]
  };

  public static getAllContracts(): LoanContract[] {
    return this.state.contracts.map(c => FinancialCore.recalculateContractSummary(c));
  }

  public static getContractById(id: string): LoanContract | undefined {
    const c = this.state.contracts.find(item => item.id === id);
    return c ? FinancialCore.recalculateContractSummary(c) : undefined;
  }

  public static getContractByDocId(docId: string): LoanContract | undefined {
    const c = this.state.contracts.find(item => item.clientDocId.toLowerCase().includes(docId.toLowerCase()));
    return c ? FinancialCore.recalculateContractSummary(c) : undefined;
  }

  public static addContract(contract: LoanContract): void {
    const summaryContract = FinancialCore.recalculateContractSummary(contract);
    this.state.contracts.push(summaryContract);
  }

  public static updateContract(updated: LoanContract): void {
    const summaryContract = FinancialCore.recalculateContractSummary(updated);
    const index = this.state.contracts.findIndex(c => c.id === summaryContract.id);
    if (index !== -1) {
      this.state.contracts[index] = summaryContract;
    }
  }

  public static getAllVehicles(): VehicleSpec[] {
    return [...this.state.vehicles];
  }

  public static addVehicle(vehicle: VehicleSpec): void {
    this.state.vehicles.push(vehicle);
  }

  public static updateVehiclePrice(vehicleId: string, newDealerPriceUSD: number): void {
    const veh = this.state.vehicles.find(v => v.id === vehicleId);
    if (veh) {
      veh.dealerPriceUSD = newDealerPriceUSD;
      this.state.contracts.forEach(c => {
        if (c.vehicle?.id === vehicleId && !c.isDealerPriceFrozen) {
          c.concessionairePriceUSD = newDealerPriceUSD;
        }
      });
    }
  }

  public static getAllPromotions(): PromoCampaign[] {
    return [...this.state.promotions];
  }
}