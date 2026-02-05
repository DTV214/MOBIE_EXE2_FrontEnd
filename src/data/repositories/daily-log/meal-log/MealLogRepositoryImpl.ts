import axiosInstance from '../../../apis/axiosInstance';
import { IMealLogRepository } from '../../../../domain/repositories/daily-log/IMealLogRepository';
import { MealLog, MealType } from '../../../../domain/entities/MealLog';
import {
  ApiResponse,
  MealLogResponseDTO,
} from '../../../dtos/daily-log/MealLogDTO';

export class MealLogRepositoryImpl implements IMealLogRepository {
  async getByDailyLogId(dailyLogId: number): Promise<MealLog[]> {
    console.log(`--- [REPO] START: getByDailyLogId(${dailyLogId})`);
    try {
      const response = await axiosInstance.get<
        ApiResponse<MealLogResponseDTO[]>
      >(`/api/meal-logs/daily-log/${dailyLogId}`);
      console.log(
        `--- [REPO] SUCCESS: Retrieved ${
          response.data.data?.length || 0
        } meals`,
      );
      return (response.data.data || []).map(dto => this.mapToEntity(dto));
    } catch (error: any) {
      this.logDetailedError('getByDailyLogId', error);
      throw error;
    }
  }

  async createMealLog(
    dailyLogId: number,
    mealType: MealType,
    loggedTime: string,
    notes?: string,
  ): Promise<MealLog> {
    const payload = { dailyLogId, mealType, loggedTime, notes };
    console.log('--- [REPO] START: createMealLog');
    console.log(
      '--- [REPO] PAYLOAD SENDING:',
      JSON.stringify(payload, null, 2),
    );

    try {
      const response = await axiosInstance.post<
        ApiResponse<MealLogResponseDTO>
      >('/api/meal-logs', payload);

      console.log('--- [REPO] SUCCESS: MealLog Created');
      console.log(
        '--- [REPO] DATA RECEIVED:',
        JSON.stringify(response.data.data, null, 2),
      );

      return this.mapToEntity(response.data.data);
    } catch (error: any) {
      this.logDetailedError('createMealLog', error);
      throw error;
    }
  }

  async updateMealLog(
    id: number,
    mealType: MealType,
    loggedTime: string,
    notes?: string,
  ): Promise<MealLog> {
    const payload = { mealType, loggedTime, notes };
    console.log(`--- [REPO] START: updateMealLog(ID: ${id})`);
    console.log('--- [REPO] UPDATE PAYLOAD:', JSON.stringify(payload, null, 2));

    try {
      const response = await axiosInstance.put<ApiResponse<MealLogResponseDTO>>(
        `/api/meal-logs/${id}`,
        payload,
      );
      console.log('--- [REPO] SUCCESS: MealLog Updated');
      return this.mapToEntity(response.data.data);
    } catch (error: any) {
      this.logDetailedError('updateMealLog', error);
      throw error;
    }
  }

  async deleteMealLog(id: number): Promise<void> {
    console.log(`--- [REPO] START: deleteMealLog(ID: ${id})`);
    try {
      await axiosInstance.delete(`/api/meal-logs/${id}`);
      console.log('--- [REPO] SUCCESS: MealLog Deleted');
    } catch (error: any) {
      this.logDetailedError('deleteMealLog', error);
      throw error;
    }
  }

  /**
   * Helper format LocalTime object từ Java {hour, minute, second, nano} thành HH:mm:ss
   */
  private formatLocalTime(timeObj: any): string {
    if (!timeObj) return '00:00:00';

    // Nếu BE trả về chuỗi trực tiếp
    if (typeof timeObj === 'string') return timeObj;

    // Nếu BE trả về object LocalTime (Xử lý lỗi từ image_276745.png)
    if (typeof timeObj === 'object') {
      const h = String(timeObj.hour || 0).padStart(2, '0');
      const m = String(timeObj.minute || 0).padStart(2, '0');
      const s = String(timeObj.second || 0).padStart(2, '0');
      return `${h}:${m}:${s}`;
    }
    return '00:00:00';
  }

  /**
   * Chuyển đổi DTO sang Entity để sử dụng trong App
   */
  private mapToEntity(dto: MealLogResponseDTO): MealLog {
    if (!dto) {
      console.error('--- [REPO] Mapping Error: DTO is null or undefined');
      throw new Error('Dữ liệu từ server không hợp lệ');
    }

    return {
      id: dto.id,
      dailyLogId: dto.dailyLogId,
      mealType: dto.mealType,
      loggedTime: this.formatLocalTime(dto.loggedTime),
      notes: dto.notes || '',
      totalCalories: dto.totalCalories || 0,
      totalProtein: dto.totalProtein || 0,
      totalCarbs: dto.totalCarbs || 0,
      totalFat: dto.totalFat || 0,
    };
  }

  /**
   * Log chi tiết lỗi 500 và các lỗi API khác
   */
  private logDetailedError(methodName: string, error: any) {
    console.error(`--- [REPO] ERROR in ${methodName}:`);
    if (error.response) {
      // Server trả về lỗi (Ví dụ: 500, 400, 403)
      console.error('    Status:', error.response.status);
      console.error(
        '    Message from Server:',
        error.response.data?.message || 'No message',
      );
      console.error(
        '    Full Server Error Data:',
        JSON.stringify(error.response.data, null, 2),
      );
    } else if (error.request) {
      // Không nhận được phản hồi
      console.error('    Network Error: No response received');
    } else {
      // Lỗi cấu hình hoặc lỗi khác
      console.error('    Error Message:', error.message);
    }
  }
}
