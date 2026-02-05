import { ExerciseTypePage } from '../../entities/ExerciseType';
import { ExerciseLogDetail } from '../../entities/ExerciseLogDetail';

export interface IExerciseRepository {
  /**
   * Lấy danh sách các môn tập từ thư viện (có phân trang)
   * API: /api/public/exercise-types
   */
  getExerciseTypes(page: number, size: number): Promise<ExerciseTypePage>;

  /**
   * Lấy danh sách hoạt động tập luyện của một ngày cụ thể
   * API: /api/exercise-logs/daily-log/{dailyLogId}
   */
  getExercisesByDailyLogId(dailyLogId: number): Promise<ExerciseLogDetail[]>;

  /**
   * Thêm hoạt động tập luyện mới
   * API: /api/exercise-logs
   */
  addExerciseLog(payload: {
    duration: number;
    exerciseTypeId: number;
    dailyLogId: number;
  }): Promise<ExerciseLogDetail>;

  /**
   * Cập nhật bản ghi tập luyện
   * API: /api/exercise-logs/{id}
   */
  updateExerciseLog(
    id: number,
    payload: {
      duration: number;
      exerciseTypeId: number;
      dailyLogId: number;
    },
  ): Promise<ExerciseLogDetail>;

  /**
   * Xóa bản ghi tập luyện
   * API: /api/exercise-logs/{id}
   */
  removeExerciseLog(id: number): Promise<void>;
}
