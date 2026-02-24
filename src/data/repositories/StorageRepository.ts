// src/data/repositories/StorageRepository.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@onboarding_completed';
const AUTH_DATA_KEY = '@auth_data';

interface AuthData {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  fullname: string;
  role: string;
}

export class StorageRepository {
  /**
   * Generic method to store any data
   */
  async set<T>(key: string, data: T): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(`@${key}`, jsonData);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }

  /**
   * Generic method to get any data
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonData = await AsyncStorage.getItem(`@${key}`);
      if (jsonData) {
        return JSON.parse(jsonData) as T;
      }
      return null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  }

  /**
   * Generic method to remove data
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`@${key}`);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }

  /**
   * Save authentication data
   */
  async saveAuthData(authData: AuthData): Promise<void> {
    return this.set(AUTH_DATA_KEY, authData);
  }

  /**
   * Get authentication data - Fixed to use same key as AuthRepositoryImpl
   */
  async getAuthData(): Promise<AuthData | null> {
    try {
      // Use the same key as AuthRepositoryImpl uses
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        // Return minimal AuthData with token
        return {
          accessToken: token,
          tokenType: 'Bearer',
          userId: 0, // Will be populated from JWT if needed
          email: '',
          fullname: '',
          role: '',
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting auth data:', error);
      return null;
    }
  }

  /**
   * Clear authentication data - Fixed to use same key as AuthRepositoryImpl
   */
  async clearAuthData(): Promise<void> {
    try {
      // Clear the same key as AuthRepositoryImpl uses
      await AsyncStorage.removeItem('accessToken');
      console.log('🧹 Cleared auth data (accessToken)');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }
  /**
   * Kiểm tra xem người dùng đã xem onboarding chưa
   */
  async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error reading onboarding status:', error);
      return false;
    }
  }

  /**
   * Đánh dấu người dùng đã hoàn thành onboarding
   */
  async setOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  }

  /**
   * Xóa cờ onboarding (để test hoặc reset)
   */
  async clearOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (error) {
      console.error('Error clearing onboarding status:', error);
    }
  }
}
