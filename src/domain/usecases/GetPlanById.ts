// src/domain/usecases/GetPlanById.ts
import { ISubscriptionRepository } from '../repositories/ISubscriptionRepository';
import { SubscriptionPlan } from '../entities/Subscription';

export class GetPlanById {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  async execute(id: string): Promise<SubscriptionPlan | null> {
    return await this.subscriptionRepository.getPlanById(id);
  }
}
