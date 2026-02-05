// src/data/repositories/auth/AuthRepositoryImpl.ts
import axios from 'axios';
import { IAuthRepository } from '../../../domain/repositories/auth/IAuthRepository';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { AccountResponseDTO } from '../../dtos/account/AccountResponseDTO'; // Import DTO chuẩn
import { User } from '../../../domain/entities/User';
import axiosInstance from '../../apis/axiosInstance';

export class AuthRepositoryImpl implements IAuthRepository {
  async getProfile(): Promise<User> {
    try {
      // 1. Gọi API (Dùng DTO chuẩn để hứng data)
      const response = await axiosInstance.get<AccountResponseDTO>(
        '/api/accounts/profile',
      );
      const dataDTO = response.data; // Đây là dữ liệu thô từ Server (AccountResponseDTO)

      // 2. Mapping: Biến đổi DTO (Server) -> Entity (App)
      const userEntity: User = {
        id: dataDTO.id,
        email: dataDTO.email,

        // Logic Mapping:
        fullName: dataDTO.fullname, // Map fullname -> fullName
        role: dataDTO.role,
        status: dataDTO.status,

        // ✅ QUAN TRỌNG: Map cờ kiểm tra hồ sơ sức khỏe
        // Backend (isHaveHealthProfile) -> Frontend Entity (hasHealthProfile)
        hasHealthProfile: dataDTO.isHaveHealthProfile,

        // Xử lý dữ liệu thiếu: Backend chưa có BMI, gán null
        bmi: null,
      };

      // 3. Trả về Entity sạch sẽ cho Domain
      return userEntity;
    } catch (error) {
      throw error;
    }
  }

  // URL Callback - Updated to use production server
  private apiUrl = 'http://14.225.207.221:8080/api/auth/google/android-callback';

  async loginWithGoogle(idToken: string): Promise<string> {
    try {
      console.log(
        '--- Step 3: Gọi API Backend để đổi ID Token lấy Access Token ---',
      );

      // Dùng axios thường (không phải instance) để tránh việc interceptor chèn token cũ/rỗng
      const response = await axios.post(
        this.apiUrl,
        {}, // Body
        {
          headers: {
            Authorization: `Bearer ${idToken}`, // Gửi Google ID Token
          },
        },
      );

      console.log('Status Backend:', response.status);

      // Backend trả về chuỗi Token trực tiếp (ResponseEntity<String>)
      const jwt = response.data;

      if (typeof jwt !== 'string' || !jwt) {
        throw new Error('Response từ Server không phải là Token hợp lệ');
      }

      console.log('JWT nhận được từ Backend:', jwt);
      return jwt;
    } catch (error: any) {
      console.error('--- Lỗi tại AuthRepository ---');
      console.error('Chi tiết:', error?.response?.data || error.message);
      throw new Error('Đăng nhập thất bại - vui lòng thử lại');
    }
  }

  // --- TOKEN MANAGEMENT ---
  // QUAN TRỌNG: Key phải là 'accessToken' để khớp với axiosInstance.ts

  async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('accessToken', token);
      console.log('Lưu accessToken thành công!');
    } catch (e) {
      console.error('Lỗi khi lưu token:', e);
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (e) {
      console.error('Lỗi khi lấy token:', e);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('accessToken');
      console.log('Đã xóa token đăng nhập.');
    } catch (e) {
      console.error('Lỗi khi xóa token:', e);
    }
  }
}
