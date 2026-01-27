// src/data/repositories/auth/AuthRepositoryImpl.ts
import axios from 'axios';
import { IAuthRepository } from '../../../domain/repositories/auth/IAuthRepository';
// import { User } from '../../../domain/entities/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export class AuthRepositoryImpl implements IAuthRepository {
  // ✅ FIXED: Sử dụng callback endpoint theo luồng chuẩn
  private apiUrl =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8080/api/auth/google/android-callback'
      : 'http://localhost:8080/api/auth/google/android-callback';

  async loginWithGoogle(idToken: string): Promise<string> {
    try {
      console.log('--- Step 3: Gọi API Backend ---');
      // Gửi idToken trong body nếu BE yêu cầu, hoặc Header tùy cấu hình BE
      const response = await axios.post(
        this.apiUrl,
        {}, // Body trống
        {
          headers: {
            Authorization: `Bearer ${idToken}`, // Gửi Token vào đây để BE nhận diện
          },
        },
      );

      console.log('--- Step 4: Phản hồi từ Backend ---');
      console.log('Status:', response.status);

      // Vì BE trả về ResponseEntity<String>, response.data chính là Token
      const jwt = response.data;

      if (typeof jwt !== 'string' || !jwt) {
        throw new Error('Response từ Server không phải là Token hợp lệ');
      }

      console.log('Token nhận được:', jwt);
      return jwt;
    } catch (error: any) {
      console.error('--- Lỗi tại Repository ---');
      console.error('Chi tiết:', error?.response?.data || error.message);
      throw new Error('Đăng nhập thất bại - vui lòng thử lại');
    }
  }

  async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('user_token', token);
      console.log('Lưu token thành công!');
    } catch (e) {
      console.error('Lỗi khi lưu token:', e);
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('user_token');
    } catch (e) {
      console.error('Lỗi khi lấy token:', e);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('user_token');
      console.log('Đã xóa token đăng nhập.');
    } catch (e) {
      console.error('Lỗi khi xóa token:', e);
    }
  }
}
