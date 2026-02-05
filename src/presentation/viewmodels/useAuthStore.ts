// src/presentation/viewmodels/useAuthStore.ts
import { create } from 'zustand';
import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
// Import trực tiếp hằng số use case từ Container
import { loginWithGoogleUseCase } from '../../di/Container';
import { User } from '../../domain/entities/User';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  loginWithGoogle: async () => {
    set({ loading: true, error: null });

    try {
      console.log('--- [STEP 2] KHỞI ĐỘNG TIẾN TRÌNH GOOGLE SDK ---');

      // Kiểm tra Play Services
      await GoogleSignin.hasPlayServices();

      // Thực hiện Sign In
      const response = await GoogleSignin.signIn();

      // LOG TOÀN BỘ DỮ LIỆU TỪ GOOGLE SDK (KHÔNG VIẾT TẮT)
      console.log('--- [DATA] PHẢN HỒI THÔ TỪ GOOGLE SDK (FULL) ---');
      console.log(JSON.stringify(response, null, 2));

      // Sign out ngay để tránh lỗi "Sign-in in progress" cho lần sau
      try {
        await GoogleSignin.signOut();
        console.log(
          '--- [INFO] Đã Sign Out Google SDK để làm sạch phiên đăng nhập ---',
        );
      } catch {
        console.log('--- [INFO] Chưa có phiên đăng nhập cũ để Sign Out ---');
      }

      if (isSuccessResponse(response) && response.data.idToken) {
        const idTokenFromGoogle = response.data.idToken;

        // LOG FULL ID TOKEN CỦA GOOGLE
        console.log('--- [STEP 2.1] LẤY ID TOKEN TỪ GOOGLE THÀNH CÔNG ---');
        console.log('FULL GOOGLE ID TOKEN:', idTokenFromGoogle);

        try {
          console.log(
            '--- [STEP 3] GỌI USE CASE: TIẾN HÀNH XÁC THỰC VỚI BACKEND ---',
          );

          // Gọi Use Case thực hiện trao đổi Token
          const backendJwtToken = await loginWithGoogleUseCase.execute(
            idTokenFromGoogle,
          );

          // LOG FULL JWT NHẬN ĐƯỢC TỪ BACKEND
          console.log('--- [STEP 4] BACKEND TRẢ VỀ JWT THÀNH CÔNG (FULL) ---');
          console.log('FULL BACKEND JWT TOKEN:', backendJwtToken);

          // Cập nhật trạng thái Store
          set({
            loading: false,
            token: backendJwtToken,
            isAuthenticated: true,
            error: null,
          });

          console.log(
            '--- [FLOW] ĐĂNG NHẬP HOÀN TẤT - CHUYỂN TRẠNG THÁI isAuthenticated = TRUE ---',
          );
          return true;
        } catch (useCaseError: any) {
          console.error('--- [ERROR] LỖI TẠI TẦNG USE CASE / REPOSITORY ---');
          console.error('Nội dung lỗi chi tiết:', useCaseError.message);

          set({
            loading: false,
            error: useCaseError.message || 'Lỗi khi xử lý đăng nhập tại Server',
          });
          return false;
        }
      }

      console.warn('--- [WARN] ĐĂNG NHẬP BỊ HỦY HOẶC THIẾU ID TOKEN ---');
      set({ loading: false, error: 'Không lấy được idToken từ Google' });
      return false;
    } catch (err: any) {
      console.error('--- [ERROR] LỖI TẠI TẦNG STORE (CATCH BLOCK) ---');
      console.error('Mã lỗi hệ thống (code):', err.code);
      console.error('Thông báo lỗi đầy đủ:', err.message);

      let errorMessage = 'Đăng nhập thất bại';

      // Phân tích mã lỗi chuẩn (Code 7, 10, 12501...)
      if (err.code === '7' || err.code === 7) {
        errorMessage = 'Lỗi mạng (Mã 7): Không thể kết nối tới máy chủ Google';
      } else if (err.code === '10' || err.code === 10) {
        errorMessage = 'Lỗi cấu hình (Mã 10): Sai SHA-1 hoặc Web Client ID';
      } else if (err.code === 'SIGN_IN_CANCELLED') {
        errorMessage = 'Người dùng đã hủy bỏ màn hình đăng nhập';
      } else if (err.message) {
        errorMessage = err.message;
      }

      console.error('THÔNG BÁO LỖI CUỐI CÙNG:', errorMessage);
      set({ loading: false, error: errorMessage });
      return false;
    }
  },

  logout: async () => {
    try {
      console.log('--- [LOGOUT] BẮT ĐẦU TIẾN TRÌNH ĐĂNG XUẤT ---');

      // 1. Thoát khỏi Google SDK
      await GoogleSignin.signOut();
      console.log('1. Đã Sign Out Google SDK');

      // 2. Xóa Token trong bộ nhớ máy (AsyncStorage) qua Repository
      const { authRepository } = require('../../di/Container');
      await authRepository.logout();
      console.log('2. Đã xóa Access Token trong AsyncStorage');

      // 3. Reset trạng thái Store
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });

      console.log('--- [LOGOUT] ĐÃ ĐĂNG XUẤT HOÀN TOÀN KHỎI HỆ THỐNG ---');
    } catch (error: any) {
      console.error(
        '--- [ERROR] LỖI TRONG QUÁ TRÌNH ĐĂNG XUẤT ---',
        error.message,
      );
    }
  },
}));
