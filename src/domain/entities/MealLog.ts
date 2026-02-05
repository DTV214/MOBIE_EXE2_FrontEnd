// Định nghĩa Enum khớp hoàn toàn với Backend
export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
}

// Định nghĩa hình dáng dữ liệu của một Bữa ăn trong App
export interface MealLog {
  id: number;
  dailyLogId: number;
  mealType: MealType;
  loggedTime: string; // Định dạng HH:mm:ss
  notes: string | null;

  // Các chỉ số dinh dưỡng tổng hợp của bữa ăn này
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;

  // Danh sách các món ăn lẻ (Meal Items) - Chúng ta sẽ xử lý chi tiết ở bước sau
  items?: any[];
}
