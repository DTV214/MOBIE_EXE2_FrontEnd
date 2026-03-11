// src/services/HealthConnectService.ts
import HealthConnect from 'react-native-health-connect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../data/apis/axiosInstance';

interface StepData {
  date: string; // YYYY-MM-DD
  steps: number;
  calories: number;
}

class HealthConnectService {
  private isInitialized = false;

  /**
   * Initialize Health Connect with permissions
   */
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) {
        return true;
      }

      console.log('🔧 Initializing Health Connect...');

      // ⚠️ CRITICAL: Check if module exists before calling
      if (!HealthConnect || typeof HealthConnect.initialize !== 'function') {
        console.error('❌ Health Connect module not available on this device (emulator or old Android version)');
        return false;
      }

      // Initialize Health Connect
      const initResult = await HealthConnect.initialize();
      
      if (!initResult) {
        console.error('❌ Health Connect not available on device');
        return false;
      }

      // Request step count permissions
      const permissions = [
        {
          accessType: 'read' as const,
          recordType: 'Steps' as const,
        }
      ];
      const permissionResult = await HealthConnect.requestPermission(permissions);
      
      if (permissionResult) {
        this.isInitialized = true;
        console.log('✅ Health Connect initialized successfully');
        
        // Start observing step changes
        await this.startStepObserver();
        return true;
      } else {
        console.error('❌ Health Connect permissions denied');
        return false;
      }
    } catch (error) {
      console.error('❌ Health Connect initialization error:', error);
      return false;
    }
  }

  /**
   * Get today's step count
   */
  async getTodaySteps(): Promise<number> {
    try {
      // ⚠️ CRITICAL: Check module availability first
      if (!HealthConnect || typeof HealthConnect.readRecords !== 'function') {
        console.warn('⚠️ Health Connect not available, returning 0 steps');
        return 0;
      }

      if (!this.isInitialized) {
        console.log('⚠️ Health Connect not initialized, attempting to initialize...');
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Failed to initialize Health Connect');
        }
      }

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const records = await HealthConnect.readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startOfDay.toISOString(),
          endTime: endOfDay.toISOString(),
        },
      });
      
      if (records && records.records && records.records.length > 0) {
        // Sum all step records for today
        const totalSteps = records.records.reduce((total: number, record: any) => total + record.count, 0);
        console.log(`📊 Today's steps: ${totalSteps}`);
        return totalSteps;
      }

      return 0;
    } catch (error) {
      console.error('❌ Error getting today steps:', error);
      return 0;
    }
  }

  /**
   * Get step count for a specific date
   */
  async getStepsForDate(date: string): Promise<StepData> {
    try {
      // ⚠️ CRITICAL: Check module availability
      if (!HealthConnect || typeof HealthConnect.readRecords !== 'function') {
        console.warn('⚠️ Health Connect not available, returning 0 steps');
        return { date, steps: 0, calories: 0 };
      }

      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      const records = await HealthConnect.readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startOfDay.toISOString(),
          endTime: endOfDay.toISOString(),
        },
      });

      const totalSteps = records.records ? records.records.reduce((total: number, record: any) => total + record.count, 0) : 0;

      // Estimate calories (rough: 1 step ≈ 0.04 calories)
      const estimatedCalories = Math.round(totalSteps * 0.04);

      return {
        date,
        steps: totalSteps,
        calories: estimatedCalories,
      };
    } catch (error) {
      console.error(`❌ Error getting steps for ${date}:`, error);
      return { date, steps: 0, calories: 0 };
    }
  }

  /**
   * Start polling step count changes in background
   */
  private async startStepObserver(): Promise<void> {
    try {
      // Health Connect doesn't have real-time observer, so we use polling
      console.log('📊 Starting step count polling every 5 minutes');
      
      setInterval(async () => {
        try {
          const steps = await this.getTodaySteps();
          await this.cacheStepCount(steps);
          console.log('🔄 Step count refreshed:', steps);
        } catch (error) {
          console.error('❌ Error during step polling:', error);
        }
      }, 5 * 60 * 1000); // Poll every 5 minutes
    } catch (error) {
      console.error('❌ Error starting step observer:', error);
    }
  }

  /**
   * Cache step count locally
   */
  private async cacheStepCount(steps: number): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const cacheKey = `steps_${today}`;
      await AsyncStorage.setItem(cacheKey, steps.toString());
    } catch (error) {
      console.error('❌ Error caching step count:', error);
    }
  }

  /**
   * Get cached step count (fallback when Google Fit unavailable)
   */
  async getCachedSteps(date?: string): Promise<number> {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const cacheKey = `steps_${targetDate}`;
      const cachedSteps = await AsyncStorage.getItem(cacheKey);
      return cachedSteps ? parseInt(cachedSteps, 10) : 0;
    } catch (error) {
      console.error('❌ Error getting cached steps:', error);
      return 0;
    }
  }

  /**
   * Sync steps with backend API
   */
  async syncStepsWithBackend(): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0]; // 2026-03-05
      const currentSteps = await this.getTodaySteps();

      console.log(`🔄 Syncing ${currentSteps} steps for ${today}...`);

      // 1. GET daily log for today
      const dailyLogResponse = await axiosInstance.get(`/api/daily-logs/date/${today}`);
      const dailyLog = dailyLogResponse.data;

      // 2. Check if steps need updating
      if (dailyLog.stepAmount !== currentSteps) {
        console.log(`📈 Updating steps: ${dailyLog.stepAmount} → ${currentSteps}`);

        // 3. PATCH steps
        await axiosInstance.patch(`/api/daily-logs/${dailyLog.id}/steps?steps=${currentSteps}`);
        
        console.log('✅ Steps synced successfully with backend');
        return true;
      } else {
        console.log('ℹ️ Steps already up to date');
        return true;
      }
    } catch (error) {
      console.error('❌ Error syncing steps with backend:', error);
      return false;
    }
  }

  /**
   * Schedule periodic background sync (call from App.tsx)
   */
  startPeriodicSync(): void {
    // Sync every 15 minutes
    setInterval(() => {
      this.syncStepsWithBackend();
    }, 15 * 60 * 1000);

    console.log('⏰ Periodic step sync started (every 15 minutes)');
  }

  /**
   * Check if Health Connect is available on device
   */
  async isAvailable(): Promise<boolean> {
    try {
      // ⚠️ CRITICAL: Check if module exists (emulator/old devices don't have Health Connect)
      if (!HealthConnect || typeof HealthConnect.initialize !== 'function') {
        console.warn('⚠️ Health Connect module not available on this device');
        return false;
      }
      
      const available = await HealthConnect.initialize();
      console.log(`🔍 Health Connect available: ${available}`);
      return available;
    } catch (error) {
      console.error('❌ Error checking Health Connect availability:', error);
      return false;
    }
  }

  /**
   * Disconnect from Health Connect
   */
  async disconnect(): Promise<void> {
    try {
      // Health Connect doesn't need explicit disconnect
      this.isInitialized = false;
      console.log('🔌 Disconnected from Health Connect');
    } catch (error) {
      console.error('❌ Error disconnecting from Health Connect:', error);
    }
  }
}

// Export singleton instance
export const healthConnectService = new HealthConnectService();
export default HealthConnectService;