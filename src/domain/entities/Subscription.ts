// src/domain/entities/Subscription.ts
export type SubscriptionPlanType = 'basic' | 'premium';
export type PaymentMethodType = 'card' | 'bank_transfer' | 'e_wallet';

export interface SubscriptionPlan {
  id: string;
  type: SubscriptionPlanType;
  name: string;
  nameVietnamese: string;
  price: number; // Price in VND
  duration: number; // Duration in months
  originalPrice?: number; // For discount calculation
  discount?: number; // Percentage discount
  features: string[];
  isPopular?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  cardNumber?: string; // Last 4 digits for display
  cardHolderName?: string;
  expiryDate?: string; // Format: MM/YY
  bankName?: string;
  eWalletProvider?: string; // e.g., "MoMo", "ZaloPay"
  isDefault?: boolean;
}

export interface PaymentTransaction {
  id: string;
  planId: string;
  paymentMethodId: string;
  amount: number;
  currency: string; // "VND"
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string; // e.g., "TXN-2024-001234"
  createdAt: string;
  completedAt?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planType: SubscriptionPlanType;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
  paymentMethodId?: string;
  transactions: PaymentTransaction[];
}
