import { IMealFoodRepository } from '../../repositories/meal-food/IMealFoodRepository';
import { MealFoodDetail } from '../../entities/MealFoodDetail';

export class GetMealFoodsByMealIdUseCase {
  constructor(private mealFoodRepository: IMealFoodRepository) {}

  async execute(mealId: number): Promise<MealFoodDetail[]> {
    return await this.mealFoodRepository.getFoodsByMealId(mealId);
  }
}
