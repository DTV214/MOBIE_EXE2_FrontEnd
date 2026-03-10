// src/presentation/screens/Auth_Screen/LoginScreen.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { scale, moderateScale, verticalScale, fs } from '../../../utils/responsive';
import { Leaf, Shield, Heart, Zap } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Import ViewModels
import { useAuthStore } from '../../viewmodels/useAuthStore';
import { useUserStore } from '../../viewmodels/useUserStore';
import { useTheme } from '../../../contexts/ThemeContext';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const { isDarkMode, colors } = useTheme();

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
      // Add small delay to ensure Activity is ready
      await new Promise<void>(resolve => setTimeout(resolve, 100));
      
      const success = await loginWithGoogle();


      if (success) {
        console.log('--- [FLOW] Auth Success. Now fetching User Profile ---');
        
        try {
          await fetchUserProfile();

          const currentUser = useUserStore.getState().user;
          console.log('--- [STEP 8] Determining Redirection Logic ---');
          console.log('Current User:', JSON.stringify(currentUser));
          console.log('User Health Profile Status:', currentUser?.hasHealthProfile);

          // ✅ CRITICAL: Check if user profile fetch was successful
          if (!currentUser) {
            console.error('❌ User profile is null after fetch - backend may have returned 404/401');
            console.log('--- [NAVIGATION] Forcing redirect to Survey (new user flow) ---');
            navigation.reset({ index: 0, routes: [{ name: 'Survey' }] });
            return;
          }

          if (currentUser.hasHealthProfile) {
            console.log('--- [NAVIGATION] Redirecting to Dashboard (Main) ---');
            navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
          } else {
            console.log('--- [NAVIGATION] Redirecting to Survey Screen ---');
            navigation.reset({ index: 0, routes: [{ name: 'Survey' }] });
          }
        } catch (profileError: any) {
          console.error('❌ Error fetching user profile:', profileError);
          // Even if profile fetch fails, still navigate (user is authenticated)
          console.log('--- [NAVIGATION] Profile fetch failed, redirecting to Survey ---');
          navigation.reset({ index: 0, routes: [{ name: 'Survey' }] });
        }
      } else {
        const errorMsg = useAuthStore.getState().error;
        Alert.alert(
          'Đăng nhập thất bại',
          errorMsg || 'Không thể đăng nhập. Vui lòng thử lại.',
        );
      }
    } catch (error) {
      console.error('--- [SCREEN LEVEL ERROR] ---', error);
    }
  };

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.statusBarBackground}
      />

      {/* Background Gradient */}
      <LinearGradient
        colors={isDarkMode ? [colors.background, colors.surface] : ['#E8F5E3', '#FFFFFF', '#FFFFFF']}
        style={tw`flex-1`}
      >
        <ScrollView
          contentContainerStyle={tw`flex-grow`}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Section */}
          <View style={[tw`px-8`, { paddingTop: verticalScale(60), paddingBottom: verticalScale(24) }]}>
            {/* Logo */}
            <View style={tw`items-center mb-8`}>
              <View
                style={[
                  tw`rounded-full items-center justify-center mb-6 shadow-lg`,
                  {
                    width: scale(88),
                    height: scale(88),
                    backgroundColor: colors.primary
                  },
                ]}
              >
                <Leaf size={moderateScale(44, 0.3)} color="#FFFFFF" />
              </View>
              <Text style={[
                tw`font-black mb-2`,
                { fontSize: fs(28), color: colors.primary }
              ]}>
                LanhCare
              </Text>
              <Text style={[
                tw`text-center`,
                { fontSize: fs(14), lineHeight: fs(20), color: colors.textSecondary }
              ]}>
                Ứng dụng theo dõi sức khỏe toàn diện
              </Text>
            </View>

            {/* Welcome Message */}
            <View style={tw`mb-8`}>
              <Text style={[
                tw`font-black mb-3 text-center`,
                { fontSize: fs(26), color: colors.text }
              ]}>
                Chào mừng trở lại!
              </Text>
              <Text style={[
                tw`text-center`,
                { fontSize: fs(15), lineHeight: fs(22), color: colors.textSecondary }
              ]}>
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
          <View style={[tw`flex-1 justify-end px-8`, { paddingBottom: verticalScale(36) }]}>
            {/* Google Login Button */}
            <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={authLoading}
              activeOpacity={0.9}
              style={tw`mb-6 ${authLoading ? 'opacity-50' : ''}`}
            >
              <LinearGradient
                colors={[colors.primary, `${colors.primary}CC`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[tw`rounded-2xl flex-row items-center justify-center shadow-lg`, { height: verticalScale(56) }]}
              >
                {authLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <View
                      style={[
                        tw`bg-white rounded-full items-center justify-center mr-4`,
                        { width: scale(36), height: scale(36) },
                      ]}
                    >
                      <Text style={[tw`font-bold text-red-500`, { fontSize: fs(20) }]}>G</Text>
                    </View>
                    <Text style={[tw`text-white font-bold`, { fontSize: fs(16) }]}>
                      Đăng nhập với Google
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Footer */}
            <Text style={[
              tw`text-center`,
              { fontSize: fs(13), lineHeight: fs(20), color: colors.textSecondary }
            ]}>
              Bằng cách đăng nhập, bạn đồng ý với{'\n'}
              <Text style={[tw`font-semibold`, { color: colors.primary }]}>Điều khoản sử dụng</Text>
              {' và '}
              <Text style={[tw`font-semibold`, { color: colors.primary }]}>Chính sách bảo mật</Text>
            </Text>
          </View>
        </ScrollView>
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

const FeatureItem = ({ icon: Icon, title, subtitle }: FeatureItemProps) => {
  const { colors } = useTheme();
  
  return (
    <View style={tw`flex-row items-center mb-4`}>
      <View
        style={[
          tw`rounded-xl items-center justify-center`,
          {
            width: scale(38),
            height: scale(38),
            marginRight: scale(14),
            backgroundColor: `${colors.primary}20`
          }
        ]}
      >
        <Icon size={moderateScale(18, 0.3)} color={colors.primary} />
      </View>
      <View style={tw`flex-1`}>
        <Text style={[
          tw`font-semibold mb-1`,
          { fontSize: fs(13), color: colors.text }
        ]}>
          {title}
        </Text>
        <Text style={[
          { fontSize: fs(11), lineHeight: fs(16), color: colors.textSecondary }
        ]}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;