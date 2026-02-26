import { IMealFoodRepository } from "../../repositories/meal-food/IMealFoodRepository";

export class RemoveFoodFromMealUseCase {
  constructor(private mealFoodRepository: IMealFoodRepository) {}
  async execute(id: number) {
    return await this.mealFoodRepository.removeFoodFromMeal(id);
  }
}
