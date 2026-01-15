// src/domain/usecases/GetPaymentMethods.ts
import { ISubscriptionRepository } from '../repositories/ISubscriptionRepository';
import { PaymentMethod } from '../entities/Subscription';

export class GetPaymentMethods {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  async execute(): Promise<PaymentMethod[]> {
    return await this.subscriptionRepository.getPaymentMethods();
  }
}
