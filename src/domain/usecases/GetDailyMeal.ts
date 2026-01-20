// src/domain/usecases/GetDailyMeal.ts
import { IMealRepository } from '../repositories/IMealRepository';
import { DailyMeal } from '../entities/Food';

export class GetDailyMeal {
  constructor(private mealRepository: IMealRepository) {}

  async execute(date?: string): Promise<DailyMeal> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return await this.mealRepository.getDailyMeal(targetDate);
  }
}
