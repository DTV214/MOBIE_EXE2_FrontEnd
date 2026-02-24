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
      // 1. Lấy thông tin tài khoản (Account)
      const user = await getAccountProfileUseCase.execute();
      set({ user });

      // 2. Nếu User đã có hồ sơ sức khỏe -> Gọi luôn hàm lấy Health Profile
      if (user.hasHealthProfile) {
        await get().fetchHealthData();
      } else {
        set({ loading: false }); // Nếu không có thì dừng loading
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      
      // Enhanced error handling
      const status = error?.response?.status;
      const isAuthError = status === 401 || status === 403;
      const isUserNotFound = status === 404 && error?.response?.data?.message?.includes('Account not found');
      
      if (isAuthError || isUserNotFound) {
        // Clear user data and stored tokens for auth errors or deleted accounts
        console.log(isUserNotFound ? 'User account deleted or not found - clearing stored data' : 'Authentication failed - user needs to login');
        
        // Clear stored token
        try {
          const AsyncStorage = await import('@react-native-async-storage/async-storage');
          await AsyncStorage.default.removeItem('accessToken');
          console.log('Cleared stored access token');
        } catch (clearError) {
          console.error('Failed to clear stored token:', clearError);
        }
        
        set({ user: null, healthProfile: null, loading: false, error: null });
        // Don't set error message to avoid UI disruption on login flow
      } else {
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
