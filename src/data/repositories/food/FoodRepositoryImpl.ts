import { Food, FoodPage } from '../../../domain/entities/Food';
import { IFoodRepository } from '../../../domain/repositories/food/IFoodRepository';
import axiosInstance from '../../apis/axiosInstance';
import { ApiResponse } from '../../dtos/daily-log/MealLogDTO';
import { FoodDTO, FoodPageDTO } from '../../dtos/food/FoodDTO';

export class FoodRepositoryImpl implements IFoodRepository {
  async getFoodItems(params: {
    search?: string;
    status?: string;
    foodTypeId?: number;
    page: number;
    size: number;
  }): Promise<FoodPage> {
    console.log('--- [REPO] Searching Food Items with params:', params);

    const response = await axiosInstance.get<ApiResponse<FoodPageDTO>>(
      '/api/public/foods/items',
      { params }, // Axios sẽ tự build query string: ?search=...&page=...
    );

    const dto = response.data.data;

    // Map DTO sang Entity FoodPage
    return {
      content: dto.content.map(item => this.mapToFoodEntity(item)),
      totalPages: dto.totalPages,
      totalElements: dto.totalElements,
      size: dto.size,
      number: dto.number,
    };
  }

  private mapToFoodEntity(dto: FoodDTO): Food {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      calo: dto.calo,
      servingUnit: dto.servingUnit,
      standardServingSize: dto.standardServingSize,
      foodTypeName: dto.foodTypeName,
      imageUrl: dto.imageUrl, // Backend có thể trả null
      status: dto.status,
    };
  }
}
