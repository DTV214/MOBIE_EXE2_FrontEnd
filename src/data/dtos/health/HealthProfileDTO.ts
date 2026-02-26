// src/data/dtos/health/HealthProfileDTO.ts
import {
  ActivityLevel,
  Gender,
  HealthGoal,
} from '../../../domain/enums/HealthEnums';

export interface HealthProfileRequestDTO {
  // accountId: number; // BE tự lấy từ token nên FE không cần gửi
  dateOfBirth: string;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  healthGoal: HealthGoal;
}
