// src/domain/entities/HealthProfile.ts
import { Gender } from '../enums/HealthEnums';

export interface HealthProfile {
  id: number;
  dateOfBirth: string;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  bmiValue: number;
  tdeeValue: number;

  // Các trường mô tả từ Backend
  bmiStatus: string; // Ví dụ: "NORMAL"
  bmiStatusDescription: string; // Ví dụ: "Bình thường"
  activityLevel: string;
  activityLevelDescription: string; // Ví dụ: "Vận động nhẹ"
  healthGoal: string;
  healthGoalDescription: string; // Ví dụ: "Giảm cân"
}
