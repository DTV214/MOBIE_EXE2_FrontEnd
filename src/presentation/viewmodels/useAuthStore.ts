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
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
} 

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  loginWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      console.log('--- Step 2: Bắt đầu gọi GoogleSignin.signIn() ---');
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
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
          // Gọi Use Case với proper error handling
          const user = await loginWithGoogleUseCase.execute(idToken);
          console.log('Use Case execute thành công cho user:', user.fullname);

          // ✅ FIXED: Lưu user info vào store
          set({ 
            loading: false, 
            user: user, 
            isAuthenticated: true,
            error: null 
          });
          return true;
        } catch (useCaseError: any) {
          console.error('Use Case error:', useCaseError.message);
          set({ 
            loading: false, 
            error: useCaseError.message || 'Lỗi khi xử lý đăng nhập'
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
      console.error('Thông báo lỗi:', err.message);
      console.error('Full error object:', JSON.stringify(err, null, 2));
      
      // Handle specific Google Sign-In errors
      let errorMessage = 'Đăng nhập thất bại';
      if (err.code === 'SIGN_IN_CANCELLED') {
        errorMessage = 'Đăng nhập bị hủy';
      } else if (err.code === 'SIGN_IN_REQUIRED') {
        errorMessage = 'Cần đăng nhập Google';
      } else if (err.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        errorMessage = 'Google Play Services không khả dụng';
      } else if (err.code === 10 || err.code === '10') {
        // DEVELOPER_ERROR - specific message
        errorMessage = 'Lỗi cấu hình Google OAuth - cần kiểm tra SHA-1 fingerprint';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      console.error('Final error message:', errorMessage);
      set({ loading: false, error: errorMessage });
      return false;
    }
  },
  logout: async () => {
    try {
      await GoogleSignin.signOut();
      set({ 
        user: null, 
        isAuthenticated: false, 
        error: null 
      });
    } catch (error) {
      console.error('Lỗi khi logout:', error);
    }
  },
}));
