// src/presentation/viewmodels/useUserStore.ts
import { create } from 'zustand';
import { AuthRepositoryImpl } from '../../data/repositories/auth/AuthRepositoryImpl';
import { GetAccountProfile } from '../../domain/usecases/auth/GetAccountProfile';
import { User } from '../../domain/entities/User';

// --- PHẦN 1: DEPENDENCY INJECTION (Khởi tạo các lớp bên dưới) ---
// Tạo Repository (Data Layer)
const authRepository = new AuthRepositoryImpl();
// Tạo UseCase (Domain Layer) và đưa Repository vào
const getAccountProfileUseCase = new GetAccountProfile(authRepository);

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchUserProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  loading: false,
  error: null,

  // Hàm 1: Lấy thông tin Profile
  fetchUserProfile: async () => {
    set({ loading: true, error: null });
    try {
      console.log('ViewModel: Đang gọi UseCase lấy profile...');
      // Gọi UseCase -> UseCase gọi Repository -> Repository gọi API
      const user = await getAccountProfileUseCase.execute();

      console.log('ViewModel: Lấy profile thành công:', user.email);
      set({ user, loading: false });
    } catch (error: any) {
      console.error('ViewModel Error:', error);
      set({
        loading: false,
        error: error.message || 'Không thể tải thông tin người dùng',
      });
    }
  },

  // Hàm 2: Đăng xuất
  logout: async () => {
    await authRepository.logout(); // Xóa token trong AsyncStorage
    set({ user: null, error: null }); // Xóa data trong State
  },
}));
