// src/domain/usecases/RemoveMealItem.ts
import { IMealRepository } from '../repositories/IMealRepository';

export class RemoveMealItem {
  constructor(private mealRepository: IMealRepository) {}

  async execute(mealItemId: string): Promise<void> {
    await this.mealRepository.removeMealItem(mealItemId);
  }
}
