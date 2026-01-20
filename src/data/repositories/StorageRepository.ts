// src/data/repositories/StorageRepository.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@onboarding_completed';

export class StorageRepository {
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
