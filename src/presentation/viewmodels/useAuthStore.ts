import { create } from 'zustand';
import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import { loginWithGoogleUseCase } from '../../di/Container';
import { User } from '../../domain/entities/User';

interface AuthState {
  user: User | null;
  token: string | null; // Lưu thêm token vào store nếu cần dùng nhanh
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
      console.log('--- Step 2: Bắt đầu gọi GoogleSignin.signIn() ---');
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        console.log(e);
        // Bỏ qua nếu chưa có ai đăng nhập
      }
      console.log(
        'Phản hồi thô từ Google SDK:',
        JSON.stringify(response, null, 2),
      );

      if (isSuccessResponse(response) && response.data.idToken) {
        const idToken = response.data.idToken;
        console.log(
          'Lấy idToken thành công:',
          idToken.substring(0, 20) + '...',
        );

        try {
          // ✅ THAY ĐỔI: loginWithGoogleUseCase.execute bây giờ trả về chuỗi JWT (String)
          const jwtToken = await loginWithGoogleUseCase.execute(idToken);
          console.log('Đăng nhập thành công, nhận được JWT');

          // Tạm thời set isAuthenticated là true.
          // Thông tin User sẽ được cập nhật sau khi giải mã JWT hoặc gọi API Profile.
          set({
            loading: false,
            token: jwtToken,
            isAuthenticated: true,
            error: null,
          });
          return true;
        } catch (useCaseError: any) {
          console.error('Use Case error:', useCaseError.message);
          set({
            loading: false,
            error: useCaseError.message || 'Lỗi khi xử lý đăng nhập tại Server',
          });
          return false;
        }
      }

      console.warn('Đăng nhập Google không trả về idToken hoặc bị hủy');
      set({ loading: false, error: 'Không lấy được idToken từ Google' });
      return false;
    } catch (err: any) {
      console.error('--- Lỗi tại Store (Catch Block) ---');
      console.error('Mã lỗi (code):', err.code);

      let errorMessage = 'Đăng nhập thất bại';
      if (err.code === '10' || err.code === 10) {
        errorMessage =
          'Lỗi cấu hình Google OAuth (Mã 10) - Kiểm tra SHA-1 và Web Client ID';
      } else if (err.code === 'SIGN_IN_CANCELLED') {
        errorMessage = 'Người dùng đã hủy đăng nhập';
      } else if (err.message) {
        errorMessage = err.message;
      }

      set({ loading: false, error: errorMessage });
      return false;
    }
  },
  logout: async () => {
    try {
      await GoogleSignin.signOut();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Lỗi khi logout:', error);
    }
  },
}));
