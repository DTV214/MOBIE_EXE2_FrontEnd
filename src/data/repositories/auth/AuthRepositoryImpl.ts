// src/data/repositories/auth/AuthRepositoryImpl.ts
import axios from 'axios';
import { IAuthRepository } from '../../../domain/repositories/auth/IAuthRepository';
import { User } from '../../../domain/entities/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export class AuthRepositoryImpl implements IAuthRepository {
  // LƯU Ý: Đã sửa lại logic apiUrl cho đúng (Android Emulator dùng 10.0.2.2)
  private apiUrl =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8080/api/auth/google/android-callback'
      : 'http://localhost:8080/api/auth/google/android-callback';

  async loginWithGoogle(idToken: string): Promise<{ user: User; jwt: string }> {
    try {
      console.log('--- Step 3: Gọi API Backend ---');
      console.log('Endpoint:', this.apiUrl);
      console.log('Payload:', { idToken: idToken.substring(0, 10) + '...' });

      const response = await axios.post(this.apiUrl, { idToken });

      console.log('--- Step 4: Phản hồi từ Backend ---');
      console.log('Status:', response.status);
      console.log('Data thô từ BE:', response.data);

      const result = {
        user: response.data.user,
        jwt: response.data.accessToken || response.data.token,
      };

      // Kiểm tra xem dữ liệu có bị undefined không
      if (!result.user || !result.jwt) {
        console.error('Dữ liệu BE trả về thiếu trường user hoặc token!');
      }

      return result;
    } catch (error: any) {
      console.error('--- Lỗi tại Repository ---');
      if (error.response) {
        console.error(
          'BE trả về lỗi:',
          error.response.status,
          error.response.data,
        );
      } else if (error.request) {
        console.error('Không kết nối được tới BE (kiểm tra IP/Wifi/Cổng 8080)');
      }
      throw new Error('Đăng nhập Google thất bại tại Server');
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
