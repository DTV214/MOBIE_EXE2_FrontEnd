// src/presentation/screens/Auth_Screen/LoginScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Leaf } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';

// Import ViewModels
import { useAuthStore } from '../../viewmodels/useAuthStore';
import { useUserStore } from '../../viewmodels/useUserStore';

const LoginScreen = () => {
  const navigation = useNavigation<any>();

  // Local State cho Form đăng nhập thường
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
  // Placeholder cho đăng nhập thường (Chưa có API)
  const handleLogin = () => {
    Toast.show({
      type: 'info',
      text1: 'Tính năng đang phát triển',
      text2: 'Vui lòng sử dụng Đăng nhập bằng Google.',
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-white`}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`flex-grow`}
      >
        {/* Header với Logo */}
        <View style={tw`items-center pt-16 pb-8`}>
          <View
            style={tw`w-20 h-20 bg-primary rounded-full items-center justify-center mb-4 shadow-md`}
          >
            <Leaf size={40} color="#FFFFFF" />
          </View>
          <Text style={tw`text-primary font-black text-2xl mb-1`}>
            Lành Care
          </Text>
        </View>

        <View style={tw`px-8 flex-1`}>
          {/* Title */}
          <Text style={tw`text-3xl font-black text-brandDark mb-2`}>
            Chào mừng trở lại!
          </Text>
          <Text style={tw`text-base text-textSub mb-10`}>
            Tiếp tục cùng sống khỏe, sống bình tĩnh
          </Text>

          {/* Input Fields (Đăng nhập thường) */}
          <View style={tw`mb-6`}>
            {/* Email */}
            <View
              style={tw`bg-white border border-gray-200 rounded-2xl px-4 py-4 mb-4 shadow-sm`}
            >
              <Text style={tw`text-xs text-textSub mb-2 font-semibold`}>
                Email
              </Text>
              <View style={tw`flex-row items-center`}>
                <Mail size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Nhập email"
                  placeholderTextColor="#9CA3AF"
                  style={tw`flex-1 ml-3 text-brandDark text-base`}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password */}
            <View
              style={tw`bg-white border border-gray-200 rounded-2xl px-4 py-4 shadow-sm`}
            >
              <Text style={tw`text-xs text-textSub mb-2 font-semibold`}>
                Mật khẩu
              </Text>
              <View style={tw`flex-row items-center`}>
                <Lock size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#9CA3AF"
                  style={tw`flex-1 ml-3 text-brandDark text-base`}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={tw`mt-4 items-end`}>
              <Text style={tw`text-primary font-semibold text-sm`}>
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button (Manual) */}
          <TouchableOpacity onPress={handleLogin} activeOpacity={0.9}>
            <LinearGradient
              colors={['#7FB069', '#6A9A5A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={tw`h-16 rounded-2xl flex-row items-center justify-center shadow-lg mb-8`}
            >
              <Text style={tw`text-white font-bold text-lg mr-2`}>
                Đăng nhập
              </Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={tw`flex-row items-center mb-6`}>
            <View style={tw`flex-1 h-[1px] bg-gray-200`} />
            <Text style={tw`mx-4 text-gray-400 text-xs`}>
              HOẶC ĐĂNG NHẬP VỚI
            </Text>
            <View style={tw`flex-1 h-[1px] bg-gray-200`} />
          </View>

          {/* Google Login Button */}
          <View style={tw`items-center pb-10`}>
            <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={authLoading}
              style={tw`w-16 h-16 bg-white rounded-2xl items-center justify-center border border-gray-200 shadow-sm ${
                authLoading ? 'opacity-50' : ''
              }`}
            >
              {authLoading ? (
                <ActivityIndicator color="#EA4335" />
              ) : (
                // Logo Google chữ G cách điệu
                <Text style={tw`text-3xl font-bold text-red-500`}>G</Text>
              )}
            </TouchableOpacity>
            <Text style={tw`text-gray-400 text-xs mt-2`}>Google</Text>
          </View>

          {/* Register Footer */}
          <View style={tw`flex-row justify-center pb-10`}>
            <Text style={tw`text-textSub`}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={tw`text-primary font-bold`}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
