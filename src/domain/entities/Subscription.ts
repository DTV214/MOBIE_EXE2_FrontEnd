// src/domain/entities/Subscription.ts

// === Backend API Response Types ===

/** Service plan from GET /api/public/service-plans */
export interface ServicePlan {
  id: number;
  name: string;
  description: string;
  price: number;
  periodValue: number;
  periodUnit: 'MONTH' | 'YEAR';
  features: string[];
}

/** Active subscription from GET /api/subscriptions/me */
export interface ActiveSubscription {
  id: number;
  servicePlanId: number;
  servicePlanName: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  features: string[];
}

/** SePay purchase response from POST /api/subscriptions/purchase-sepay */
export interface SepayPurchaseResult {
  transactionId: number;
  qrCodeUrl: string;
  accountNumber: string;
  accountHolder: string;
  bankName: string;
  amount: number;
  content: string;
  expiresAt: string;
  message: string;
}

/** Transaction history from GET /api/subscriptions/transactions */
export interface TransactionHistory {
  id: number;
  servicePlanName: string;
  amount: number;
  paymentMethod: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';
  createdAt: string;
  completedAt?: string;
}

/** Transaction status from GET /api/subscriptions/transactions/{id}/status */
export interface TransactionStatus {
  transactionId: number;
  status: 'PENDING' | 'COMPLETED' | 'SUCCESS' | 'FAILED' | 'EXPIRED';
  message: string;
}

// === Health Report ===
export interface HealthReport {
  period: string;
  startDate: string;
  endDate: string;
  daysLogged: number;
  avgCaloriesIn: number;
  avgCaloriesOut: number;
  calorieBalance: number;
  avgSteps: number;
  totalMeals: number;
  totalExercises: number;
  weightKg?: number;
  bmiValue?: number;
  bmiStatus?: string;
  healthGoal?: string;
  healthTips?: string[];
  dailyDetails?: DailyDetail[];
}

export interface DailyDetail {
  date: string;
  caloriesIn: number;
  caloriesOut: number;
  steps: number;
  mealCount: number;
  exerciseCount: number;
}

// === Dashboard Pro ===
export interface DashboardPro {
  streakDays: number;
  goalProgress: number;
  healthGoal?: string;
  weeklyCalorieTrend: DayTrend[];
  weeklyStepsTrend: DayTrend[];
  topExercises: ExerciseRank[];
  nutritionBreakdown: NutritionBreakdown;
}

export interface DayTrend {
  date: string;
  caloriesIn: number;
  caloriesOut: number;
  steps: number;
}

export interface ExerciseRank {
  activity: string;
  count: number;
  totalCalories: number;
}

export interface NutritionBreakdown {
  breakfastCount: number;
  lunchCount: number;
  dinnerCount: number;
  snackCount: number;
}

// === Legacy types (kept for backward compatibility with existing screens) ===
export type SubscriptionPlanType = 'basic' | 'premium';
export type PaymentMethodType = 'card' | 'bank_transfer' | 'e_wallet';

export interface SubscriptionPlan {
  id: string;
  type: SubscriptionPlanType;
  name: string;
  nameVietnamese: string;
  price: number;
  duration: number;
  originalPrice?: number;
  discount?: number;
  features: string[];
  isPopular?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  bankName?: string;
  eWalletProvider?: string;
  isDefault?: boolean;
}

export interface PaymentTransaction {
  id: string;
  planId: string;
  paymentMethodId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
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
