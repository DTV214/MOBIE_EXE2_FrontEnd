import { MealType } from '../../../domain/entities/MealLog';

// Cấu trúc chuẩn của mọi phản hồi từ Backend Lành Care
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Cấu trúc dữ liệu của Bữa ăn khi nhận từ Server
export interface MealLogResponseDTO {
  id: number;
  dailyLogId: number;
  mealType: MealType;
  loggedTime: string; // Backend gửi dạng "HH:mm:ss"
  notes: string | null;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}
