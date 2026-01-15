// src/domain/usecases/GetHealthTips.ts
import { IHealthRepository } from '../repositories/IHealthRepository';
import { HealthTip } from '../entities/HealthInsight';

export class GetHealthTips {
  constructor(private healthRepository: IHealthRepository) {}

  async execute(limit?: number): Promise<HealthTip[]> {
    return await this.healthRepository.getHealthTips(limit);
  }
}
