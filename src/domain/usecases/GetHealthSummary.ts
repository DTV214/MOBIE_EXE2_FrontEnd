// src/domain/usecases/GetHealthSummary.ts
import { IHealthRepository } from '../repositories/IHealthRepository';
import { HealthSummary } from '../entities/HealthSummary';

export class GetHealthSummary {
  constructor(private healthRepository: IHealthRepository) {}

  async execute(date?: string): Promise<HealthSummary> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return await this.healthRepository.getHealthSummary(targetDate);
  }
}
