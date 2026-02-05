// Dữ liệu gửi đi (Request) khi POST hoặc PUT
export interface MealFoodRequestDTO {
  quantity: number;
  foodItemId: number;
  mealId: number;
}

// Dữ liệu nhận về (Response) từ API meal-foods
export interface MealFoodResponseDTO {
  id: number;
  quantity: number;
  calories: number;
  foodItemId: number;
  foodItemName: string;
  mealLogId: number;
}
