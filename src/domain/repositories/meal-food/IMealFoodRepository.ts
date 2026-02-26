import { MealFoodDetail } from '../../entities/MealFoodDetail';

export interface IMealFoodRepository {
  /**
   * Lấy danh sách món ăn của một bữa cụ thể
   * Khớp với API: GET /api/meal-foods/meal/{mealId}
   */
  getFoodsByMealId(mealId: number): Promise<MealFoodDetail[]>;

  /**
   * Thêm một món ăn mới vào bữa ăn
   * Khớp với API: POST /api/meal-foods
   */
  addFoodToMeal(payload: {
    quantity: number;
    foodItemId: number;
    mealId: number;
  }): Promise<MealFoodDetail>;

  /**
   * Cập nhật số lượng của một món trong bữa
   * Khớp với API: PUT /api/meal-foods/{id}
   */
  updateFoodQuantity(id: number, quantity: number): Promise<MealFoodDetail>;

  /**
   * Xóa món ăn khỏi bữa
   * Khớp với API: DELETE /api/meal-foods/{id}
   */
  removeFoodFromMeal(id: number): Promise<void>;
}
