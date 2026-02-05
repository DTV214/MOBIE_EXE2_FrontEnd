import { FoodPage } from '../../entities/Food';

export interface IFoodRepository {
  /**
   * Tìm kiếm món ăn có phân trang và lọc theo trạng thái/loại
   * Khớp với API: /api/public/foods/items
   */
  getFoodItems(params: {
    search?: string;
    status?: string;
    foodTypeId?: number;
    page: number;
    size: number;
  }): Promise<FoodPage>;
}
