export interface MealFoodDetail {
  id: number; // ID duy nhất của bản ghi MealFood
  mealLogId: number; // ID của bữa ăn cha (MealLog)
  foodItemId: number; // ID của món ăn gốc
  foodItemName: string; // Tên món ăn (để hiển thị nhanh)
  quantity: number; // Số lượng người dùng ăn
  calories: number; // Tổng calo tính toán (quantity * calo gốc)
}
