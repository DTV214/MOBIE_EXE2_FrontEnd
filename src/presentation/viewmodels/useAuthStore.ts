import { create } from 'zustand';
import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
// Import trực tiếp hằng số use case từ Container
import { loginWithGoogleUseCase } from '../../di/Container';

interface AuthState {
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<boolean>;
} 

export const useAuthStore = create<AuthState>(set => ({
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

        // Gọi Use Case
        const user = await loginWithGoogleUseCase.execute(idToken);
        console.log('Use Case execute thành công cho user:', user.fullname);

        set({ loading: false });
        return true;
      }

      console.warn('Đăng nhập Google không trả về idToken hoặc bị hủy');
      set({ loading: false, error: 'Không lấy được idToken từ Google' });
      return false;
    } catch (err: any) {
      console.error('--- Lỗi tại Store (Catch Block) ---');
      console.error('Mã lỗi (code):', err.code); // Rất quan trọng để biết DEVELOPER_ERROR (10)
      console.error('Thông báo lỗi:', err.message);
      set({ loading: false, error: err.message });
      return false;
    }
  },
}));
