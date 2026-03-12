// src/presentation/viewmodels/useStepStore.ts
import { create } from 'zustand';
import { stepCounterService } from '../../services/HealthConnectService';

interface StepState {
  // State
  todaySteps: number;
  isLoading: boolean;
  isInitialized: boolean;
  isEnabled: boolean;
  isAvailable: boolean;
  lastSyncTime: Date | null;
  error: string | null;

  // Actions
  checkAvailability: () => Promise<void>;
  enableStepTracking: () => Promise<void>;
  disableStepTracking: () => void;
  initializeStepTracking: () => Promise<void>;
  fetchTodaySteps: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
  resetError: () => void;
}

export const useStepStore = create<StepState>((set, get) => ({
  // Initial state
  todaySteps: 0,
  isLoading: false,
  isInitialized: false,
  isEnabled: false,
  isAvailable: false,
  lastSyncTime: null,
  error: null,

  /**
   * Check step sensor availability
   */
  checkAvailability: async () => {
    try {
      console.log('Checking Android step sensor availability...');
      const isAvailable = await stepCounterService.isAvailable();
      set({ isAvailable });
      
      if (!isAvailable) {
        console.log('Step counter sensor not available on this device');
        set({ error: 'Thiết bị không hỗ trợ theo dõi bước chân' });
      } else {
        console.log('Step counter sensor available');
        set({ error: null });
      }
    } catch (error: any) {
      console.error('❌ Error checking availability:', error);
      set({ 
        isAvailable: false, 
        error: 'Không thể kiểm tra khả năng theo dõi bước chân' 
      });
    }
  },

  /**
   * Manual enable step tracking với user confirmation
   */
  enableStepTracking: async () => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('🚀 User manually enabling step tracking...');
      
      // Check availability first
      const { isAvailable } = get();
      if (!isAvailable) {
        await get().checkAvailability();
        if (!get().isAvailable) {
          return;
        }
      }

      const success = await stepCounterService.initialize();
      if (!success) {
        console.warn('⚠️ Health tracking permission denied');
        set({ 
          isLoading: false, 
          isEnabled: false,
          error: 'Cần cấp quyền để theo dõi bước chân',
        });
        return;
      }

      // Get initial step count
      const steps = await stepCounterService.getTodaySteps();
      
      stepCounterService.startPeriodicSync();

      set({
        isEnabled: true,
        isInitialized: true,
        todaySteps: steps,
        isLoading: false,
        error: null,
      });

      console.log('✅ Step tracking enabled successfully');
    } catch (error: any) {
      console.error('❌ Failed to enable step tracking:', error);
      set({
        isEnabled: false,
        isInitialized: false,
        isLoading: false,
        error: error.message || 'Lỗi kích hoạt theo dõi bước chân',
      });
    }
  },

  /**
   * Disable step tracking
   */
  disableStepTracking: () => {
    console.log('⏹️ User disabled step tracking');
    set({
      isEnabled: false,
      isInitialized: false,
      todaySteps: 0,
      error: null,
    });
  },

  /**
   * Initialize Google Fit and start tracking (OLD - keep for compatibility)
   */
  initializeStepTracking: async () => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('🚀 Initializing step tracking...');
      
      const isAvailable = await stepCounterService.isAvailable();
      if (!isAvailable) {
        console.warn('⚠️ Health tracking not available on this device');
        set({ 
          isLoading: false, 
          isInitialized: false,
          error: 'Thiết bị không hỗ trợ theo dõi bước chân',
          todaySteps: 0 
        });
        return;
      }

      const success = await stepCounterService.initialize();
      if (!success) {
        console.warn('⚠️ Health tracking permission denied');
        set({ 
          isLoading: false, 
          isInitialized: false,
          error: 'Cần cấp quyền để theo dõi bước chân',
          todaySteps: 0
        });
        return;
      }

      // Get initial step count
      const steps = await stepCounterService.getTodaySteps();
      
      stepCounterService.startPeriodicSync();

      set({
        isInitialized: true,
        todaySteps: steps,
        isLoading: false,
        error: null,
      });

      console.log('✅ Step tracking initialized successfully');
    } catch (error: any) {
      console.error('❌ Step tracking initialization failed:', error);
      
      // Fallback to cached data
      const cachedSteps = await stepCounterService.getCachedSteps();
      
      set({
        isInitialized: false,
        todaySteps: cachedSteps,
        isLoading: false,
        error: error.message || 'Lỗi khởi tạo theo dõi bước chân',
      });
    }
  },

  /**
   * Fetch current day steps
   */
  fetchTodaySteps: async () => {
    const { isInitialized } = get();
    
    if (!isInitialized) {
      console.log('⚠️ Step tracking not initialized, skipping fetch');
      return;
    }

    try {
      const steps = await stepCounterService.getTodaySteps();
      set({ todaySteps: steps, error: null });
    } catch (error: any) {
      console.error('❌ Error fetching today steps:', error);
      
      // Fallback to cached data
      const cachedSteps = await stepCounterService.getCachedSteps();
      set({ 
        todaySteps: cachedSteps,
        error: 'Không thể lấy dữ liệu mới, hiển thị dữ liệu cache',
      });
    }
  },

  /**
   * Sync steps with backend
   */
  syncWithBackend: async () => {
    const { isInitialized } = get();
    
    if (!isInitialized) {
      console.log('⚠️ Step tracking not initialized, skipping sync');
      return;
    }

    try {
      console.log('🔄 Syncing steps with backend...');
      
      const success = await stepCounterService.syncStepsWithBackend();
      
      if (success) {
        set({ 
          lastSyncTime: new Date(),
          error: null,
        });
        console.log('✅ Steps synced with backend');
      } else {
        throw new Error('Sync failed');
      }
    } catch (error: any) {
      console.error('❌ Error syncing with backend:', error);
      set({
        error: 'Không thể đồng bộ với server',
      });
    }
  },

  /**
   * Clear error state
   */
  resetError: () => {
    set({ error: null });
  },
}));