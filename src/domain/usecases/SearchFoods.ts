// src/domain/usecases/SearchFoods.ts
import { IMealRepository } from '../repositories/IMealRepository';
import { Food } from '../entities/Food';

export class SearchFoods {
  constructor(private mealRepository: IMealRepository) {}

  async execute(query: string): Promise<Food[]> {
    if (!query.trim()) {
      return await this.mealRepository.getAllFoods();
    }
    return await this.mealRepository.searchFoods(query);
  }
}
