// src/data/repositories/auth/AuthRepositoryImpl.ts
import axios from 'axios';
import { IAuthRepository } from '../../../domain/repositories/auth/IAuthRepository';
import { User } from '../../../domain/entities/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccountResponseDTO } from '../../dtos/account/AccountResponseDTO';
import axiosInstance from '../../apis/axiosInstance';

export class AuthRepositoryImpl implements IAuthRepository {
  private apiUrl = 'http://14.225.207.221:8080/api/auth/google/android-callback'; // Production server IP (works from emulator)

  async loginWithGoogle(idToken: string): Promise<string> {
    try {
      console.log(
        '--- [STEP 3] Calling Backend: Exchange Google ID Token for JWT ---',
      );
      console.log('Full API URL:', this.apiUrl);
      console.log(
        'Authorization Header (Google ID Token):',
        `Bearer ${idToken}`,
      );

      const response = await axios.post(
        this.apiUrl,
        {},
        { headers: { Authorization: `Bearer ${idToken}` } },
      );

      console.log('--- [STEP 4] Backend Response Success ---');
      console.log('HTTP Status:', response.status);
      console.log('JWT Received (Full):', response.data);

      return response.data;
    } catch (error: any) {
      console.error('--- [AUTH REPOSITORY ERROR] ---');
      console.error(
        'API Error Detail:',
        JSON.stringify(error?.response?.data || error.message, null, 2),
      );
      throw new Error('Đăng nhập thất bại tại tầng Data');
    }
  }

  async getProfile(): Promise<User> {
    try {
      console.log('--- [STEP 6] Calling Backend API: Get User Profile ---');
      console.log('Using API endpoint: /api/accounts/profile');

      const response = await axiosInstance.get<AccountResponseDTO>(
        '/api/accounts/profile',
      );
      console.log('--- [STEP 7] Profile Data Received ---');
      console.log(
        'Raw DTO from Server:',
        JSON.stringify(response.data, null, 2),
      );

      const userEntity: User = {
        id: response.data.id,
        email: response.data.email,
        fullName: response.data.fullname,
        role: response.data.role,
        status: response.data.status,
        hasHealthProfile: response.data.isHaveHealthProfile,
        bmi: null,
      };

      console.log('Mapped User Entity:', JSON.stringify(userEntity, null, 2));
      return userEntity;
    } catch (error: any) {
      console.error(
        '--- [PROFILE API ERROR] ---',
        error?.response?.data || error.message,
      );
      throw error;
    }
  }

  async saveToken(token: string): Promise<void> {
    console.log('--- [STORAGE] Saving Access Token to AsyncStorage ---');
    console.log('Full Token Value:', token);
    await AsyncStorage.setItem('accessToken', token);
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('accessToken');
  }

  async logout(): Promise<void> {
    console.log('--- [STORAGE] Removing Token and Logging Out ---');
    await AsyncStorage.removeItem('accessToken');
  }
}
