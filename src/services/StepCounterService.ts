import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeModules, PermissionsAndroid, Platform} from 'react-native';
import axiosInstance from '../data/apis/axiosInstance';

interface StepData {
  date: string;
  steps: number;
  calories: number;
}

interface StepCounterNativeModule {
  isSensorAvailable(): Promise<boolean>;
  initialize(): Promise<boolean>;
  getTodaySteps(): Promise<number>;
}

const stepCounterModule = NativeModules.StepCounterModule as
  | StepCounterNativeModule
  | undefined;

class StepCounterService {
  private isInitialized = false;
  private pollingStarted = false;
  private syncStarted = false;

  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) {
        return true;
      }

      if (!stepCounterModule) {
        console.error('StepCounterModule is not available');
        return false;
      }

      const available = await this.isAvailable();
      if (!available) {
        console.error('Step counter sensor is not available on this device');
        return false;
      }

      const hasPermission = await this.requestActivityRecognitionPermission();
      if (!hasPermission) {
        console.error('Activity recognition permission denied');
        return false;
      }

      const initialized = await stepCounterModule.initialize();
      if (!initialized) {
        console.error('Failed to initialize Android step counter');
        return false;
      }

      this.isInitialized = true;
      this.startStepObserver();
      return true;
    } catch (error) {
      console.error('Android step counter initialization error:', error);
      return false;
    }
  }

  async getTodaySteps(): Promise<number> {
    try {
      if (!stepCounterModule) {
        console.warn('StepCounterModule is not available, returning 0 steps');
        return 0;
      }

      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Failed to initialize step counter');
        }
      }

      const totalSteps = await stepCounterModule.getTodaySteps();
      await this.cacheStepCount(totalSteps);
      return totalSteps;
    } catch (error) {
      console.error('Error getting today steps from sensor:', error);
      return 0;
    }
  }

  async getStepsForDate(date: string): Promise<StepData> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const steps =
        date === today
          ? await this.getTodaySteps()
          : await this.getCachedSteps(date);

      return {
        date,
        steps,
        calories: Math.round(steps * 0.04),
      };
    } catch (error) {
      console.error(`Error getting steps for ${date}:`, error);
      return {date, steps: 0, calories: 0};
    }
  }

  private startStepObserver(): void {
    if (this.pollingStarted) {
      return;
    }

    this.pollingStarted = true;

    setInterval(async () => {
      try {
        const steps = await this.getTodaySteps();
        await this.cacheStepCount(steps);
      } catch (error) {
        console.error('Error during step sensor polling:', error);
      }
    }, 5 * 60 * 1000);
  }

  private async cacheStepCount(steps: number): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const cacheKey = `steps_${today}`;
      await AsyncStorage.setItem(cacheKey, steps.toString());
    } catch (error) {
      console.error('Error caching step count:', error);
    }
  }

  async getCachedSteps(date?: string): Promise<number> {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const cacheKey = `steps_${targetDate}`;
      const cachedSteps = await AsyncStorage.getItem(cacheKey);
      return cachedSteps ? parseInt(cachedSteps, 10) : 0;
    } catch (error) {
      console.error('Error getting cached steps:', error);
      return 0;
    }
  }

  async syncStepsWithBackend(): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const currentSteps = await this.getTodaySteps();

      const dailyLogResponse = await axiosInstance.get(`/api/daily-logs/date/${today}`);
      const dailyLog = dailyLogResponse.data;

      if (dailyLog.stepAmount !== currentSteps) {
        await axiosInstance.patch(`/api/daily-logs/${dailyLog.id}/steps?steps=${currentSteps}`);
      }

      return true;
    } catch (error) {
      console.error('Error syncing steps with backend:', error);
      return false;
    }
  }

  startPeriodicSync(): void {
    if (this.syncStarted) {
      return;
    }

    this.syncStarted = true;
    setInterval(() => {
      this.syncStepsWithBackend();
    }, 15 * 60 * 1000);
  }

  async isAvailable(): Promise<boolean> {
    try {
      if (Platform.OS !== 'android' || !stepCounterModule) {
        console.warn('Android step counter module is not available');
        return false;
      }

      const available = await stepCounterModule.isSensorAvailable();
      return available;
    } catch (error) {
      console.error('Error checking step counter availability:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    this.isInitialized = false;
  }

  private async requestActivityRecognitionPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }

    if (Platform.Version < 29) {
      return true;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
      {
        title: 'Quyen theo doi buoc chan',
        message:
          'Ung dung can quyen nhan dien hoat dong de doc buoc chan truc tiep tu cam bien cua thiet bi.',
        buttonPositive: 'Cho phep',
        buttonNegative: 'Tu choi',
      },
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
}

export const stepCounterService = new StepCounterService();
export default StepCounterService;
