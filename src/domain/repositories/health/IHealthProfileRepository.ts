// src/domain/repositories/health/IHealthProfileRepository.ts
import { HealthProfile } from '../../entities/HealthProfile';
import { Gender, ActivityLevel, HealthGoal } from '../../enums/HealthEnums';

// Dữ liệu cần thiết để tạo Profile (Khớp với HealthProfileRequest của BE)
export interface HealthProfileRequestData {
  dateOfBirth: string; // Format: YYYY-MM-DD
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  healthGoal: HealthGoal;
  // accountId không cần truyền vì BE tự lấy từ Token
}

export interface IHealthProfileRepository {
  createProfile(data: HealthProfileRequestData): Promise<boolean>;
  getPersonalProfile(): Promise<HealthProfile>;
  updateProfile(data: HealthProfileRequestData): Promise<boolean>;
}
