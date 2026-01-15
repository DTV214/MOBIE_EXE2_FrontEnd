// src/domain/usecases/GetHeartRateTrend.ts
import { IHealthRepository } from '../repositories/IHealthRepository';
import { HeartRateTrend } from '../entities/HeartRateData';

export class GetHeartRateTrend {
  constructor(private healthRepository: IHealthRepository) {}

  async execute(period: '7days' | '30days' | '3months'): Promise<HeartRateTrend> {
    return await this.healthRepository.getHeartRateTrend(period);
  }
}
