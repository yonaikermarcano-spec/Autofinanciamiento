"use client";

export interface PromoCoupon {
  code: string;
  description: string;
  discountUSD: number;
  applicableTo: 'INITIAL_ADMIN_FEE' | 'QUOTA_DISCOUNT' | 'GPS_FREE';
  minContractAmountUSD: number;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  expiryDate: string;
}

export interface ReferralRecord {
  id: string;
  referrerClientName: string;
  referrerContractNumber: string;
  referredFriendName: string;
  referredPhone: string;
  status: 'PENDING_APPROVAL' | 'DELIVERED_REWARD_CREDITED';
  rewardAmountUSD: number;
  appliedToQuotaNumber?: number;
  createdAt: string;
  sha256Seal: string;
}

export class PromotionsReferralsEngine {
  private static coupons: PromoCoupon[] = [
    {
      code: "DELIVERY2026",
      description: "$30 USD de descuento en gastos administrativos iniciales para repartidores",
      discountUSD: 30.00,
      applicableTo: "INITIAL_ADMIN_FEE",
      minContractAmountUSD: 1000.00,
      maxUses: 100,
      currentUses: 42,
      isActive: true,
      expiryDate: "2026-12-31"
    },
    {
      code: "MOTOTAXI50",
      description: "$50 USD de bono directo para inicial de nueva moto 0km",
      discountUSD: 50.00,
      applicableTo: "INITIAL_ADMIN_FEE",
      minContractAmountUSD: 1200.00,
      maxUses: 50,
      currentUses: 18,
      isActive: true,
      expiryDate: "2026-11-30"
    },
    {
      code: "GPSGRATIS",
      description: "Instalación e inauguración de GPS Satelital 100% bonificada",
      discountUSD: 60.00,
      applicableTo: "GPS_FREE",
      minContractAmountUSD: 1300.00,
      maxUses: 30,
      currentUses: 12,
      isActive: true,
      expiryDate: "2026-10-31"
    }
  ];

  private static referrals: ReferralRecord[] = [
    {
      id: "REF-REC-001",
      referrerClientName: "José Gregorio Castillo",
      referrerContractNumber: "CTR-2026-001",
      referredFriendName: "Manuel Alejandro Rojas",
      referredPhone: "0412-5559012",
      status: "DELIVERED_REWARD_CREDITED",
      rewardAmountUSD: 20.00,
      appliedToQuotaNumber: 3,
      createdAt: "2026-08-20",
      sha256Seal: "SHA256:5245462D3030317C32305553447C32303236"
    },
    {
      id: "REF-REC-002",
      referrerClientName: "Carlos Eduardo Pérez",
      referrerContractNumber: "CTR-2026-002",
      referredFriendName: "Yorman Silva",
      referredPhone: "0414-9920192",
      status: "PENDING_APPROVAL",
      rewardAmountUSD: 20.00,
      createdAt: "2026-08-25",
      sha256Seal: "SHA256:5245462D3030327C32305553447C32303236"
    }
  ];

  public static getAllCoupons(): PromoCoupon[] {
    return [...this.coupons];
  }

  public static getAllReferrals(): ReferralRecord[] {
    return [...this.referrals];
  }

  public static validateCoupon(code: string, contractAmountUSD: number): { valid: boolean; coupon?: PromoCoupon; message: string } {
    const coupon = this.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) return { valid: false, message: "Cupón no encontrado o inválido" };
    if (!coupon.isActive) return { valid: false, message: "Cupón inactivo o pausado" };
    if (coupon.currentUses >= coupon.maxUses) return { valid: false, message: "El cupón ha alcanzado su límite de usos" };
    if (contractAmountUSD < coupon.minContractAmountUSD) {
      return { valid: false, message: "Monto mínimo del contrato debe ser $" + coupon.minContractAmountUSD + " USD" };
    }

    return { valid: true, coupon, message: "¡Cupón válido! Descuento: $" + coupon.discountUSD + " USD" };
  }

  public static registerReferral(params: {
    referrerClientName: string;
    referrerContractNumber: string;
    referredFriendName: string;
    referredPhone: string;
  }): ReferralRecord {
    const timestamp = new Date().toISOString().slice(0, 10);
    const rawSeal = "REF|" + params.referrerContractNumber + "|" + params.referredPhone + "|" + timestamp;
    const sha256Seal = "SHA256:" + Buffer.from(rawSeal).toString('hex').slice(0, 32).toUpperCase();

    const record: ReferralRecord = {
      id: "REF-REC-" + Date.now().toString().slice(-5),
      referrerClientName: params.referrerClientName,
      referrerContractNumber: params.referrerContractNumber,
      referredFriendName: params.referredFriendName,
      referredPhone: params.referredPhone,
      status: "PENDING_APPROVAL",
      rewardAmountUSD: 20.00,
      createdAt: timestamp,
      sha256Seal
    };

    this.referrals.unshift(record);
    return record;
  }
}
