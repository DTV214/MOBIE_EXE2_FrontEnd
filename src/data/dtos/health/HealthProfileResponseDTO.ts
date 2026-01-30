// src/data/dtos/health/HealthProfileResponseDTO.ts
import { Gender } from '../../../domain/enums/HealthEnums';

export interface HealthProfileResponseDTO {
  id: number;
  dateOfBirth: string;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  bmiValue: number;
  tdeeValue: number;
  createdAt: string;
  updatedAt: string;
  bmiStatus: string;
  bmiStatusDescription: string;
  activityLevel: string;
  activityLevelDescription: string;
  healthGoal: string;
  healthGoalDescription: string;
}

// Interface bọc ngoài cho ApiResponse chuẩn của bạn
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
