// src/presentation/viewmodels/useUserStore.ts
import { create } from 'zustand';
import { User } from '../../domain/entities/User';
import { HealthProfile } from '../../domain/entities/HealthProfile'; // Import mới
import { GetAccountProfile } from '../../domain/usecases/auth/GetAccountProfile';
import { AuthRepositoryImpl } from '../../data/repositories/auth/AuthRepositoryImpl';
import { HealthProfileRepositoryImpl } from '../../data/repositories/health/HealthProfileRepositoryImpl'; // Import mới
import { GetPersonalHealthProfile } from '../../domain/usecases/health/GetPersonalHealthProfile'; // Import mới

// Dependency Injection
const authRepo = new AuthRepositoryImpl();
const getAccountProfileUseCase = new GetAccountProfile(authRepo);

// ✅ Setup Health UseCase
const healthRepo = new HealthProfileRepositoryImpl();
const getHealthProfileUseCase = new GetPersonalHealthProfile(healthRepo);

interface UserState {
  user: User | null;
  healthProfile: HealthProfile | null; // ✅ MỚI: State lưu hồ sơ sức khỏe
  loading: boolean;
  error: string | null;

  fetchUserProfile: () => Promise<void>;
  fetchHealthData: () => Promise<void>; // ✅ MỚI: Hàm riêng để lấy data sức khỏe
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  healthProfile: null,
  loading: false,
  error: null,

  fetchUserProfile: async () => {
    set({ loading: true, error: null });
    try {
      console.log('🔍 [useUserStore] Fetching user profile from backend...');
      
      // 1. Lấy thông tin tài khoản (Account)
      const user = await getAccountProfileUseCase.execute();
      
      console.log('✅ [useUserStore] User profile fetched successfully:', JSON.stringify(user));
      set({ user });

      // 2. Nếu User đã có hồ sơ sức khỏe -> Gọi luôn hàm lấy Health Profile
      if (user.hasHealthProfile) {
        console.log('🏥 [useUserStore] User has health profile, fetching health data...');
        await get().fetchHealthData();
      } else {
        console.log('⚠️ [useUserStore] User does not have health profile yet');
        set({ loading: false }); // Nếu không có thì dừng loading
      }
    } catch (error: any) {
      console.error('❌ [useUserStore] Error fetching profile:', error);
      console.error('❌ [useUserStore] Error response:', error?.response);
      console.error('❌ [useUserStore] Error status:', error?.response?.status);
      console.error('❌ [useUserStore] Error data:', error?.response?.data);
      
      // Enhanced error handling
      const status = error?.response?.status;
      const isAuthError = status === 401 || status === 403;
      const isUserNotFound = status === 404 && error?.response?.data?.message?.includes('Account not found');
      
      if (isAuthError) {
        console.log('🔐 [useUserStore] Authentication error - clearing stored data');
        // Clear stored token
        try {
          const AsyncStorage = await import('@react-native-async-storage/async-storage');
          await AsyncStorage.default.removeItem('accessToken');
          console.log('✅ [useUserStore] Cleared stored access token');
        } catch (clearError) {
          console.error('❌ [useUserStore] Failed to clear stored token:', clearError);
        }
        
        set({ user: null, healthProfile: null, loading: false, error: null });
      } else if (isUserNotFound) {
        console.log('👤 [useUserStore] User account not found (404) - this is normal for first-time login');
        console.log('ℹ️ [useUserStore] User should be redirected to Survey to create profile');
        // DON'T clear token for 404 - user is authenticated but profile doesn't exist yet
        set({ user: null, healthProfile: null, loading: false, error: null });
      } else {
        console.error('⚠️ [useUserStore] Other error occurred:', error.message);
        set({
          loading: false,
          error: error.message || 'Không thể tải thông tin cá nhân',
        });
      }
    }
  },

  // ✅ Hàm mới chuyên để lấy Health Profile
  fetchHealthData: async () => {
    try {
      const profile = await getHealthProfileUseCase.execute();
      set({ healthProfile: profile, loading: false }); // Update xong thì tắt loading
    } catch (error) {
      console.error('Lỗi lấy Health Profile:', error);
      // Không set error global để tránh chặn UI chính, chỉ log ra console hoặc set null
      set({ healthProfile: null, loading: false });
    }
  },

  clearUser: () => set({ user: null, healthProfile: null }),
}));
