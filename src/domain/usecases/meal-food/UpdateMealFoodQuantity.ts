import { IMealFoodRepository } from "../../repositories/meal-food/IMealFoodRepository";

// UpdateMealFoodQuantity.ts
export class UpdateMealFoodQuantityUseCase {
  constructor(private mealFoodRepository: IMealFoodRepository) {}
  async execute(id: number, quantity: number) {
    return await this.mealFoodRepository.updateFoodQuantity(id, quantity);
  }
}
