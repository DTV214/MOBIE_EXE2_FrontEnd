
import { IDailyLogRepository } from '../../../domain/repositories/daily-log/IDailyLogRepository';
import { DailyLog } from '../../../domain/entities/DailyLog';

import axiosInstance from '../../apis/axiosInstance';
import { DailyLogResponseDTO } from '../../dtos/daily-log/DailyLogDTO';

export class DailyLogRepositoryImpl implements IDailyLogRepository {
  async getLogByDate(date: string): Promise<DailyLog | null> {
    try {
      // URL: /api/daily-logs/date/2024-05-20
      const response = await axiosInstance.get<DailyLogResponseDTO>(
        `/api/daily-logs/date/${date}`,
      );
      return this.mapToEntity(response.data);
    } catch (error: any) {
      if (error.response?.status === 400 || error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createLog(date: string): Promise<DailyLog> {
    // PHẢI gửi { loggedDate: "..." } mới đúng RequestBody của Java
    const response = await axiosInstance.post<DailyLogResponseDTO>(
      '/api/daily-logs',
      {
        loggedDate: date,
      },
    );
    return this.mapToEntity(response.data);
  }

  private mapToEntity(dto: DailyLogResponseDTO): DailyLog {
    return {
      id: dto.id,
      loggedDate: dto.loggedDate, // Đảm bảo map đúng loggedDate
      accountId: dto.accountId,
      totalCaloriesIn: dto.totalCaloriesIn || 0,
      totalCaloriesOut: dto.totalCaloriesOut || 0,
      targetCalories: dto.targetCalories || 2000,
      remainingCalories:
        (dto.targetCalories || 2000) - (dto.totalCaloriesIn || 0),
      totalProtein: dto.totalProtein || 0,
      totalCarbs: dto.totalCarbs || 0,
      totalFat: dto.totalFat || 0,
      steps: dto.steps || 0,
      meals: {
        breakfast: [], // Tạm thời để trống cho đến khi làm API Meal
        lunch: [],
        dinner: [],
        snacks: [],
      },
    };
  }

  async updateSteps(logId: number, steps: number): Promise<DailyLog> {
    const response = await axiosInstance.patch<DailyLogResponseDTO>(
      `/api/daily-logs/${logId}/steps`,
      null,
      {
        params: { steps },
      },
    );
    return this.mapToEntity(response.data);
  }

  async deleteLog(logId: number): Promise<void> {
    await axiosInstance.delete(`/api/daily-logs/${logId}`);
  }
}
