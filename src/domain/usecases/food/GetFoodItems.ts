import { IFoodRepository } from '../../repositories/food/IFoodRepository';
import { FoodPage } from '../../entities/Food';

export class GetFoodItemsUseCase {
  constructor(private foodRepository: IFoodRepository) {}

  async execute(params: {
    search?: string;
    status?: string;
    foodTypeId?: number;
    page: number;
    size: number;
  }): Promise<FoodPage> {
    return await this.foodRepository.getFoodItems(params);
  }
}
