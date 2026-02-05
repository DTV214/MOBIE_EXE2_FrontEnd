import { IMealFoodRepository } from '../../repositories/meal-food/IMealFoodRepository';
import { MealFoodDetail } from '../../entities/MealFoodDetail';

export class AddFoodToMealUseCase {
  constructor(private mealFoodRepository: IMealFoodRepository) {}

  async execute(payload: {
    quantity: number;
    foodItemId: number;
    mealId: number;
  }): Promise<MealFoodDetail> {
    return await this.mealFoodRepository.addFoodToMeal(payload);
  }
}
