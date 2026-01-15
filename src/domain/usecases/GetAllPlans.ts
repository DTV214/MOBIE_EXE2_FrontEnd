// src/domain/usecases/GetAllPlans.ts
import { ISubscriptionRepository } from '../repositories/ISubscriptionRepository';
import { SubscriptionPlan } from '../entities/Subscription';

export class GetAllPlans {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  async execute(): Promise<SubscriptionPlan[]> {
    return await this.subscriptionRepository.getAllPlans();
  }
}
