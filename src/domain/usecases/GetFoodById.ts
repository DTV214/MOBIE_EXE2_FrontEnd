// src/domain/usecases/GetFoodById.ts
import { IMealRepository } from '../repositories/IMealRepository';
import { Food } from '../entities/Food';

export class GetFoodById {
  constructor(private mealRepository: IMealRepository) {}

  async execute(id: string): Promise<Food | null> {
    return await this.mealRepository.getFoodById(id);
  }
}
