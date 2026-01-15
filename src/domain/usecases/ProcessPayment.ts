// src/domain/usecases/ProcessPayment.ts
import { ISubscriptionRepository } from '../repositories/ISubscriptionRepository';
import { PaymentTransaction, Subscription } from '../entities/Subscription';

export interface ProcessPaymentRequest {
  planId: string;
  paymentMethodId: string;
  autoRenew: boolean;
  userId: string;
}

export class ProcessPayment {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  async execute(request: ProcessPaymentRequest): Promise<{
    transaction: PaymentTransaction;
    subscription: Subscription;
  }> {
    // Get plan details
    const plan = await this.subscriptionRepository.getPlanById(request.planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    // Create transaction
    const transaction = await this.subscriptionRepository.createTransaction({
      planId: request.planId,
      paymentMethodId: request.paymentMethodId,
      amount: plan.price,
      currency: 'VND',
      status: 'pending',
    });

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration);

    // Create subscription
    const subscription = await this.subscriptionRepository.createSubscription({
      userId: request.userId,
      planId: request.planId,
      planType: plan.type,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: true,
      autoRenew: request.autoRenew,
      paymentMethodId: request.paymentMethodId,
      transactions: [transaction],
    });

    return { transaction, subscription };
  }
}
