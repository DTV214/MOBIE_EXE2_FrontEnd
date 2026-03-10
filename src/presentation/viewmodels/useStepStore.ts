// src/presentation/viewmodels/useStepStore.ts
import { create } from 'zustand';
import { googleFitService } from '../../services/GoogleFitService';

interface StepState {
  // State
  todaySteps: number;
  isLoading: boolean;
  isInitialized: boolean;
  lastSyncTime: Date | null;
  error: string | null;

  // Actions
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
  lastSyncTime: null,
  error: null,

  /**
   * Initialize Google Fit and start tracking
   */
  initializeStepTracking: async () => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('🚀 Initializing step tracking...');
      
      // Check if Google Fit is available
      const isAvailable = await googleFitService.isAvailable();
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

      // Initialize Google Fit
      const success = await googleFitService.initialize();
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
      const steps = await googleFitService.getTodaySteps();
      
      // Start periodic sync
      googleFitService.startPeriodicSync();

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
      const cachedSteps = await googleFitService.getCachedSteps();
      
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
      const steps = await googleFitService.getTodaySteps();
      set({ todaySteps: steps, error: null });
    } catch (error: any) {
      console.error('❌ Error fetching today steps:', error);
      
      // Fallback to cached data
      const cachedSteps = await googleFitService.getCachedSteps();
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
      
      const success = await googleFitService.syncStepsWithBackend();
      
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