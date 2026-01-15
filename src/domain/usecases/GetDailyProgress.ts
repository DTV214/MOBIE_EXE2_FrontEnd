// src/domain/usecases/GetDailyProgress.ts
import { IHealthRepository } from '../repositories/IHealthRepository';
import { DailyProgress } from '../entities/HealthMetric';

export class GetDailyProgress {
  constructor(private healthRepository: IHealthRepository) {}

  async execute(date?: string): Promise<DailyProgress> {
    if (date) {
      return await this.healthRepository.getDailyProgress(date);
    }
    return await this.healthRepository.getTodayProgress();
  }
}
