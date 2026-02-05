import { MealLog, MealType } from '../../entities/MealLog';

export interface IMealLogRepository {
  /**
   * Lấy danh sách tất cả bữa ăn của một ngày dựa trên dailyLogId
   */
  getByDailyLogId(dailyLogId: number): Promise<MealLog[]>;

  /**
   * Khởi tạo một bữa ăn mới với đầy đủ thông tin từ Pop-up
   */
  createMealLog(
    dailyLogId: number,
    mealType: MealType,
    loggedTime: string,
    notes?: string,
  ): Promise<MealLog>;

  /**
   * Cập nhật thông tin bữa ăn (loại bữa, giờ giấc, ghi chú)
   */
  updateMealLog(
    id: number,
    mealType: MealType,
    loggedTime: string,
    notes?: string,
  ): Promise<MealLog>;

  /**
   * Xóa một bữa ăn hoàn toàn
   */
  deleteMealLog(id: number): Promise<void>;
}
