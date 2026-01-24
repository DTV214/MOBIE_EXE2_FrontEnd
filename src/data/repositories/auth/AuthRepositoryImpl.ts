// src/data/repositories/auth/AuthRepositoryImpl.ts
import axios from 'axios';
import { IAuthRepository } from '../../../domain/repositories/auth/IAuthRepository';
import { User } from '../../../domain/entities/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export class AuthRepositoryImpl implements IAuthRepository {
  // ✅ FIXED: Sử dụng callback endpoint theo luồng chuẩn
  private apiUrl =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8080/api/auth/google/android-callback'
      : 'http://localhost:8080/api/auth/google/android-callback';

  async loginWithGoogle(idToken: string): Promise<{ user: User; jwt: string }> {
    try {
      console.log('--- Step 3: Gọi API Backend ---');
      console.log('Endpoint:', this.apiUrl);
      console.log('Authorization:', 'Bearer ' + idToken.substring(0, 10) + '...');

      // ✅ FIXED: Sử dụng Authorization header theo luồng chuẩn
      const response = await axios.post(this.apiUrl, {}, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('--- Step 4: Phản hồi từ Backend ---');
      console.log('Status:', response.status);
      console.log('Data thô từ BE:', response.data);

      // ✅ FIXED: Map response theo API specification
      const result = {
        user: {
          id: response.data.userId,
          fullname: response.data.fullname,
          email: response.data.email,
          role: response.data.roles,
          status: 'active' // Default status
        },
        jwt: response.data.accessToken,
      };

      // Kiểm tra xem dữ liệu có bị undefined không
      if (!result.user.id || !result.jwt) {
        console.error('Dữ liệu BE trả về thiếu trường userId hoặc accessToken!');
        throw new Error('Response thiếu dữ liệu quan trọng');
      }

      return result;
    } catch (error: any) {
      console.error('--- Lỗi tại Repository ---');
      
      if (error.response) {
        // Backend trả về lỗi HTTP
        console.error('BE trả về lỗi:', error.response.status, error.response.data);
        
        if (error.response.status === 401) {
          throw new Error('Google token không hợp lệ hoặc đã hết hạn');
        } else if (error.response.status === 500) {
          throw new Error('Lỗi server nội bộ - vui lòng thử lại sau');
        } else {
          throw new Error(`Lỗi server: ${error.response.status}`);
        }
      } else if (error.request) {
        // Network error
        console.error('Không kết nối được tới BE (kiểm tra IP/Wifi/Cổng 8080)');
        throw new Error('Không thể kết nối đến server - kiểm tra kết nối mạng');
      } else {
        // Other errors
        console.error('Lỗi không xác định:', error.message);
        throw new Error('Đăng nhập thất bại - vui lòng thử lại');
      }
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
