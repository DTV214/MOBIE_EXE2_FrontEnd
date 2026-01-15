// src/data/repositories/MockSubscriptionRepository.ts
import { ISubscriptionRepository } from '../../domain/repositories/ISubscriptionRepository';
import {
  SubscriptionPlan,
  PaymentMethod,
  PaymentTransaction,
  Subscription,
} from '../../domain/entities/Subscription';

// Mock subscription plans
const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic-monthly',
    type: 'basic',
    name: 'Basic Plan',
    nameVietnamese: 'Gói cơ bản',
    price: 50000,
    duration: 1,
    features: [
      '50 lần chat mỗi tuần',
      'Theo dõi sức khỏe cơ bản',
      'Gợi ý dinh dưỡng',
    ],
  },
  {
    id: 'premium-6months',
    type: 'premium',
    name: 'Premium Plan',
    nameVietnamese: 'Gói Cao Cấp',
    price: 500000,
    duration: 6,
    originalPrice: 300000, // 50k/month * 6 = 300k
    discount: 40,
    features: [
      'AI Chatbox không giới hạn',
      'Hỗ trợ 24/7',
      'Thiết kế pháp đề sức khỏe',
      'Theo dõi chi tiết',
      'Báo cáo sức khỏe hàng tuần',
    ],
    isPopular: true,
  },
  {
    id: 'premium-monthly',
    type: 'premium',
    name: 'Premium Plan',
    nameVietnamese: 'Gói Cao Cấp',
    price: 100000,
    duration: 1,
    features: [
      'AI Chatbox không giới hạn',
      'Hỗ trợ 24/7',
      'Thiết kế pháp đề sức khỏe',
    ],
  },
];

// Mock payment methods
const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card-1',
    type: 'card',
    cardNumber: '4532',
    cardHolderName: 'CARDHOLDER NAME',
    expiryDate: '12/26',
    isDefault: true,
  },
];

export class MockSubscriptionRepository implements ISubscriptionRepository {
  private subscriptions: Subscription[] = [];
  private paymentMethods: PaymentMethod[] = [...MOCK_PAYMENT_METHODS];
  private transactions: PaymentTransaction[] = [];

  async getAllPlans(): Promise<SubscriptionPlan[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    return MOCK_PLANS;
  }

  async getPlanById(id: string): Promise<SubscriptionPlan | null> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    return MOCK_PLANS.find(p => p.id === id) || null;
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    return this.paymentMethods;
  }

  async addPaymentMethod(
    method: Omit<PaymentMethod, 'id'>,
  ): Promise<PaymentMethod> {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    const newMethod: PaymentMethod = {
      ...method,
      id: `method-${Date.now()}`,
    };
    this.paymentMethods.push(newMethod);
    return newMethod;
  }

  async removePaymentMethod(id: string): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    this.paymentMethods = this.paymentMethods.filter(m => m.id !== id);
  }

  async createTransaction(
    transactionData: Omit<PaymentTransaction, 'id' | 'createdAt'>,
  ): Promise<PaymentTransaction> {
    await new Promise<void>(resolve => setTimeout(resolve, 1000)); // Simulate payment processing
    
    const transaction: PaymentTransaction = {
      ...transactionData,
      id: `TXN-2024-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      createdAt: new Date().toISOString(),
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
    
    this.transactions.push(transaction);
    return transaction;
  }

  async getTransactionById(id: string): Promise<PaymentTransaction | null> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    return this.transactions.find(t => t.id === id) || null;
  }

  async getCurrentSubscription(userId: string): Promise<Subscription | null> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    return (
      this.subscriptions.find(
        s => s.userId === userId && s.isActive,
      ) || null
    );
  }

  async createSubscription(
    subscriptionData: Omit<Subscription, 'id'>,
  ): Promise<Subscription> {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    
    const subscription: Subscription = {
      ...subscriptionData,
      id: `sub-${Date.now()}`,
    };
    
    this.subscriptions.push(subscription);
    return subscription;
  }

  async updateSubscription(
    id: string,
    updates: Partial<Subscription>,
  ): Promise<Subscription> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    const index = this.subscriptions.findIndex(s => s.id === id);
    if (index !== -1) {
      this.subscriptions[index] = {
        ...this.subscriptions[index],
        ...updates,
      };
      return this.subscriptions[index];
    }
    throw new Error('Subscription not found');
  }

  async cancelSubscription(id: string): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    const subscription = this.subscriptions.find(s => s.id === id);
    if (subscription) {
      subscription.isActive = false;
      subscription.autoRenew = false;
    }
  }
}
