// src/domain/usecases/GetTransactionById.ts
import { ISubscriptionRepository } from '../repositories/ISubscriptionRepository';
import { PaymentTransaction } from '../entities/Subscription';

export class GetTransactionById {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  async execute(id: string): Promise<PaymentTransaction | null> {
    return await this.subscriptionRepository.getTransactionById(id);
  }
}
