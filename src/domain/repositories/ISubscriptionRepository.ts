// src/domain/repositories/ISubscriptionRepository.ts
import {
  SubscriptionPlan,
  PaymentMethod,
  PaymentTransaction,
  Subscription,
} from '../entities/Subscription';

export interface ISubscriptionRepository {
  // Plans
  getAllPlans(): Promise<SubscriptionPlan[]>;
  getPlanById(id: string): Promise<SubscriptionPlan | null>;
  
  // Payment Methods
  getPaymentMethods(): Promise<PaymentMethod[]>;
  addPaymentMethod(method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod>;
  removePaymentMethod(id: string): Promise<void>;
  
  // Transactions
  createTransaction(transaction: Omit<PaymentTransaction, 'id' | 'createdAt'>): Promise<PaymentTransaction>;
  getTransactionById(id: string): Promise<PaymentTransaction | null>;
  
  // Subscriptions
  getCurrentSubscription(userId: string): Promise<Subscription | null>;
  createSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription>;
  updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription>;
  cancelSubscription(id: string): Promise<void>;
}
