// src/domain/usecases/GetHealthInsights.ts
import { IHealthRepository } from '../repositories/IHealthRepository';
import { HealthInsight } from '../entities/HealthInsight';

export class GetHealthInsights {
  constructor(private healthRepository: IHealthRepository) {}

  async execute(date?: string): Promise<HealthInsight[]> {
    return await this.healthRepository.getHealthInsights(date);
  }
}
