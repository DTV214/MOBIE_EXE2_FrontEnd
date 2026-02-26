export interface DailyLogResponseDTO {
  id: number;
  loggedDate: string; // Backend trả về key này
  accountId: number;
  totalCaloriesIn: number;
  totalCaloriesOut: number;
  targetCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  steps: number;
  // Bổ sung các mảng nếu Backend trả về chi tiết bữa ăn
  mealLogs?: any[];
}

export interface DailyLogRequestDTO {
  loggedDate: string; // Tên trường khi POST lên Backend
}
