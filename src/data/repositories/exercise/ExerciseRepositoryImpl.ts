
import {
  ExerciseTypePageDTO,
  ExerciseLogResponseDTO,
  ExerciseLogRequestDTO,
} from '../../dtos/exercise/ExerciseDTO';
import { ApiResponse } from '../../dtos/daily-log/MealLogDTO';
import { IExerciseRepository } from '../../../domain/repositories/exercise/IExerciseRepository';
import { ExerciseTypePage } from '../../../domain/entities/ExerciseType';
import axiosInstance from '../../apis/axiosInstance';
import { ExerciseLogDetail } from '../../../domain/entities/ExerciseLogDetail';

export class ExerciseRepositoryImpl implements IExerciseRepository {
  async getExerciseTypes(
    page: number,
    size: number,
  ): Promise<ExerciseTypePage> {
    // API chuẩn: /api/public/exercise-types
    const response = await axiosInstance.get<ApiResponse<ExerciseTypePageDTO>>(
      '/api/public/exercise-types',
      { params: { page, size } },
    );
    const dto = response.data.data;
    return {
      content: dto.content,
      totalPages: dto.totalPages,
      totalElements: dto.totalElements,
      size: dto.size,
      number: dto.number,
    };
  }

  async getExercisesByDailyLogId(
    dailyLogId: number,
  ): Promise<ExerciseLogDetail[]> {
    // API chuẩn: /api/exercise-logs/daily-log/{id}
    const response = await axiosInstance.get<
      ApiResponse<ExerciseLogResponseDTO[]>
    >(`/api/exercise-logs/daily-log/${dailyLogId}`);
    return (response.data.data || []).map(dto => this.mapToEntity(dto));
  }

  async addExerciseLog(
    payload: ExerciseLogRequestDTO,
  ): Promise<ExerciseLogDetail> {
    // API chuẩn: POST /api/exercise-logs
    // Payload gồm: duration, exerciseTypeId, dailyLogId
    const response = await axiosInstance.post<
      ApiResponse<ExerciseLogResponseDTO>
    >('/api/exercise-logs', payload);
    return this.mapToEntity(response.data.data);
  }

  async updateExerciseLog(
    id: number,
    payload: ExerciseLogRequestDTO,
  ): Promise<ExerciseLogDetail> {
    // API chuẩn: PUT /api/exercise-logs/{id}
    const response = await axiosInstance.put<
      ApiResponse<ExerciseLogResponseDTO>
    >(`/api/exercise-logs/${id}`, payload);
    return this.mapToEntity(response.data.data);
  }

  async removeExerciseLog(id: number): Promise<void> {
    // API chuẩn: DELETE /api/exercise-logs/{id}
    await axiosInstance.delete(`/api/exercise-logs/${id}`);
  }

  private mapToEntity(dto: ExerciseLogResponseDTO): ExerciseLogDetail {
    return {
      id: dto.id,
      exerciseId: dto.exerciseId,
      dailyLogId: dto.dailyLogId,
      duration: dto.duration,
      activity: dto.activity,
      metValue: dto.metValue,
      caloriesOut: dto.caloriesOut,
      dailyLogDate: dto.dailyLogDate,
    };
  }
}
