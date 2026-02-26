// src/presentation/screens/Auth_Screen/LoginScreen.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { Leaf, Shield, Heart, Zap } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Import ViewModels
import { useAuthStore } from '../../viewmodels/useAuthStore';
import { useUserStore } from '../../viewmodels/useUserStore';

const LoginScreen = () => {
  const navigation = useNavigation<any>();

  // Lấy Actions từ Store
  const {
    loginWithGoogle,
    loading: authLoading,
  } = useAuthStore();
  const { fetchUserProfile } = useUserStore();

  // Cấu hình Google Signin khi màn hình mount
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '572891748659-hciej81p3gt3kpf0v589od4vhqjalc9j.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      scopes: ['profile', 'email'],
    });
  }, []);

  // Xử lý Đăng nhập Google (Luồng chính)
  const handleGoogleLogin = async () => {
    console.log('--- [STEP 1] User clicked Google Login Button ---');
    try {
      const success = await loginWithGoogle();

      if (success) {
        console.log('--- [FLOW] Auth Success. Now fetching User Profile ---');
        await fetchUserProfile();

        const currentUser = useUserStore.getState().user;
        console.log('--- [STEP 8] Determining Redirection Logic ---');
        console.log('User Health Profile Status:', currentUser?.hasHealthProfile);

        if (currentUser?.hasHealthProfile) {
          console.log('--- [NAVIGATION] Redirecting to Dashboard (Main) ---');
          navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
        } else {
          console.log('--- [NAVIGATION] Redirecting to Survey Screen ---');
          navigation.reset({ index: 0, routes: [{ name: 'Survey' }] });
        }
      }
    } catch (error) {
      console.error('--- [SCREEN LEVEL ERROR] ---', error);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#E8F5E3', '#FFFFFF', '#FFFFFF']}
        style={tw`flex-1`}
      >
        {/* Header Section */}
        <View style={tw`px-8 pt-20 pb-8`}>
          {/* Logo */}
          <View style={tw`items-center mb-8`}>
            <View
              style={tw`w-24 h-24 bg-primary rounded-full items-center justify-center mb-6 shadow-lg`}
            >
              <Leaf size={48} color="#FFFFFF" />
            </View>
            <Text style={tw`text-primary font-black text-3xl mb-2`}>
              Lành Care
            </Text>
            <Text style={tw`text-textSub text-center leading-5`}>
              Ứng dụng theo dõi sức khỏe toàn diện
            </Text>
          </View>

          {/* Welcome Message */}
          <View style={tw`mb-8`}>
            <Text style={tw`text-3xl font-black text-brandDark mb-3 text-center`}>
              Chào mừng trở lại!
            </Text>
            <Text style={tw`text-base text-textSub text-center leading-6`}>
              Tiếp tục hành trình chăm sóc sức khỏe{'\n'}cùng chúng tôi
            </Text>
          </View>

          {/* Features */}
          <View style={tw`mb-10`}>
            <FeatureItem 
              icon={Heart}
              title="Theo dõi sức khỏe"
              subtitle="Ghi nhận chỉ số cơ thể hàng ngày"
            />
            <FeatureItem 
              icon={Zap}
              title="AI hỗ trợ"
              subtitle="Nhận lời khuyên sức khỏe thông minh"
            />
            <FeatureItem 
              icon={Shield}
              title="Bảo mật tuyệt đối"
              subtitle="Thông tin cá nhân luôn được bảo vệ"
            />
          </View>
        </View>

        {/* Bottom Section */}
        <View style={tw`flex-1 justify-end px-8 pb-12`}>
          {/* Google Login Button */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            disabled={authLoading}
            activeOpacity={0.9}
            style={tw`mb-6 ${authLoading ? 'opacity-50' : ''}`}
          >
            <LinearGradient
              colors={['#7FB069', '#6A9A5A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={tw`h-16 rounded-2xl flex-row items-center justify-center shadow-lg`}
            >
              {authLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <View
                    style={tw`w-10 h-10 bg-white rounded-full items-center justify-center mr-4`}
                  >
                    <Text style={tw`text-2xl font-bold text-red-500`}>G</Text>
                  </View>
                  <Text style={tw`text-white font-bold text-lg`}>
                    Đăng nhập với Google
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={tw`text-textSub text-center text-sm leading-5`}>
            Bằng cách đăng nhập, bạn đồng ý với{'\n'}
            <Text style={tw`text-primary font-semibold`}>Điều khoản sử dụng</Text>
            {' và '}
            <Text style={tw`text-primary font-semibold`}>Chính sách bảo mật</Text>
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

// Feature Item Component
interface FeatureItemProps {
  icon: any;
  title: string;
  subtitle: string;
}

const FeatureItem = ({ icon: Icon, title, subtitle }: FeatureItemProps) => (
  <View style={tw`flex-row items-center mb-4`}>
    <View
      style={tw`w-10 h-10 bg-primary/10 rounded-xl items-center justify-center mr-4`}
    >
      <Icon size={20} color="#7FB069" />
    </View>
    <View style={tw`flex-1`}>
      <Text style={tw`text-brandDark font-semibold text-sm mb-1`}>
        {title}
      </Text>
      <Text style={tw`text-textSub text-xs leading-4`}>
        {subtitle}
      </Text>
    </View>
  </View>
);

export default LoginScreen;