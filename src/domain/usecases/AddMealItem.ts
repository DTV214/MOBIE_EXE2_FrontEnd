// src/domain/usecases/AddMealItem.ts
import { IMealRepository } from '../repositories/IMealRepository';
import { MealItem } from '../entities/Food';

export class AddMealItem {
  constructor(private mealRepository: IMealRepository) {}

  async execute(mealItem: MealItem): Promise<void> {
    await this.mealRepository.addMealItem(mealItem);
  }
}
