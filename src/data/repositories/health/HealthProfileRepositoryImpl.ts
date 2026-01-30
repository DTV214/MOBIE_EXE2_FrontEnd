// src/data/repositories/health/HealthProfileRepositoryImpl.ts
import { HealthProfile } from '../../../domain/entities/HealthProfile';
import {
  IHealthProfileRepository,
  HealthProfileRequestData,
} from '../../../domain/repositories/health/IHealthProfileRepository';
import axiosInstance from '../../apis/axiosInstance';
import { HealthProfileRequestDTO } from '../../dtos/health/HealthProfileDTO';
import { ApiResponse, HealthProfileResponseDTO } from '../../dtos/health/HealthProfileResponseDTO';

export class HealthProfileRepositoryImpl implements IHealthProfileRepository {
  async createProfile(data: HealthProfileRequestData): Promise<boolean> {
    try {
      // 1. Chuẩn bị DTO
      const requestBody: HealthProfileRequestDTO = {
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        activityLevel: data.activityLevel,
        healthGoal: data.healthGoal,
      };

      console.log('Sending Health Profile Data:', requestBody);

      // 2. Gọi API POST
      const response = await axiosInstance.post(
        '/api/health-profiles',
        requestBody,
      );

      // 3. Kiểm tra kết quả (Backend trả về 200 OK là thành công)
      return response.status === 200;
    } catch (error: any) {
      console.error(
        'Error creating health profile:',
        error?.response?.data || error.message,
      );
      throw error;
    }
  }
  async getPersonalProfile(): Promise<HealthProfile> {
    try {
      // Gọi API: GET /api/health-profiles/account
      const response = await axiosInstance.get<ApiResponse<HealthProfileResponseDTO>>('/api/health-profiles/account');
      
      const dataDTO = response.data.data; // Lấy data từ ApiResponse

      // Map DTO -> Entity
      const profileEntity: HealthProfile = {
        id: dataDTO.id,
        dateOfBirth: dataDTO.dateOfBirth,
        gender: dataDTO.gender,
        heightCm: dataDTO.heightCm,
        weightKg: dataDTO.weightKg,
        bmiValue: dataDTO.bmiValue,
        tdeeValue: dataDTO.tdeeValue,
        bmiStatus: dataDTO.bmiStatus,
        bmiStatusDescription: dataDTO.bmiStatusDescription,
        activityLevel: dataDTO.activityLevel,
        activityLevelDescription: dataDTO.activityLevelDescription,
        healthGoal: dataDTO.healthGoal,
        healthGoalDescription: dataDTO.healthGoalDescription,
      };

      return profileEntity;
    } catch (error: any) {
      console.error('Error fetching health profile:', error);
      throw error;
    }
  }
  async updateProfile(data: HealthProfileRequestData): Promise<boolean> {
    try {
      // 1. Chuẩn bị DTO (Giống hệt lúc tạo)
      const requestBody: HealthProfileRequestDTO = {
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        activityLevel: data.activityLevel,
        healthGoal: data.healthGoal,
      };

      console.log('Updating Health Profile Data:', requestBody);

      // 2. Gọi API PUT
      const response = await axiosInstance.put('/api/health-profiles', requestBody);

      // 3. Kiểm tra kết quả (Backend trả về 200 OK là thành công)
      return response.status === 200;

    } catch (error: any) {
      console.error('Error updating health profile:', error?.response?.data || error.message);
      throw error;
    }
  }
}


