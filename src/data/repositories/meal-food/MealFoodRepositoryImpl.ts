import { MealFoodDetail } from '../../../domain/entities/MealFoodDetail';
import { IMealFoodRepository } from '../../../domain/repositories/meal-food/IMealFoodRepository';
import axiosInstance from '../../apis/axiosInstance';
import { ApiResponse } from '../../dtos/daily-log/MealLogDTO';
import { MealFoodResponseDTO } from '../../dtos/meal-food/MealFoodDTO';

export class MealFoodRepositoryImpl implements IMealFoodRepository {
  async getFoodsByMealId(mealId: number): Promise<MealFoodDetail[]> {
    console.log(`--- [REPO] GET Meal Foods for mealId: ${mealId}`);
    const response = await axiosInstance.get<
      ApiResponse<MealFoodResponseDTO[]>
    >(`/api/meal-foods/meal/${mealId}`);
    return (response.data.data || []).map(dto => this.mapToEntity(dto));
  }

  async addFoodToMeal(payload: {
    quantity: number;
    foodItemId: number;
    mealId: number;
  }): Promise<MealFoodDetail> {
    console.log('--- [REPO] POST Add Food to Meal:', payload);
    const response = await axiosInstance.post<ApiResponse<MealFoodResponseDTO>>(
      '/api/meal-foods',
      payload,
    );
    return this.mapToEntity(response.data.data);
  }

  async updateFoodQuantity(
    id: number,
    quantity: number,
  ): Promise<MealFoodDetail> {
    console.log(`--- [REPO] PUT Update Quantity for ID: ${id} to ${quantity}`);
    const response = await axiosInstance.put<ApiResponse<MealFoodResponseDTO>>(
      `/api/meal-foods/${id}`,
      { quantity }, // Chỉ gửi quantity theo Swagger
    );
    return this.mapToEntity(response.data.data);
  }

  async removeFoodFromMeal(id: number): Promise<void> {
    console.log(`--- [REPO] DELETE Food from Meal, ID: ${id}`);
    await axiosInstance.delete(`/api/meal-foods/${id}`);
  }

  private mapToEntity(dto: MealFoodResponseDTO): MealFoodDetail {
    return {
      id: dto.id,
      mealLogId: dto.mealLogId,
      foodItemId: dto.foodItemId,
      foodItemName: dto.foodItemName,
      quantity: dto.quantity,
      calories: dto.calories,
    };
  }
}
