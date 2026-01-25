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
} from 'react-native';
import tw from '../../../utils/tailwind';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Leaf } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuthStore } from '../../viewmodels/useAuthStore';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<any>();

  const handleLogin = () => {
    // TODO: Implement login logic với API
    // Hiện tại chỉ điều hướng vào trang Main
    navigation.replace('Main');
  };

// useEffect để cấu hình Google
useEffect(() => {
  GoogleSignin.configure({
    // ✅ UPDATED: Web Client ID từ Firebase OAuth
    webClientId:
      '572891748659-hciej81p3gt3kpf0v589od4vhqjalc9j.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: true,
    scopes: ['profile', 'email'],
  });
}, []);

  const { loginWithGoogle, loading, error } = useAuthStore();

  const handleGoogleLogin = async () => {
    console.log('--- Step 1: Click nút Google Login ---');
    
    try {
      const success = await loginWithGoogle();
      console.log('--- Step 5: Kết quả cuối cùng tại Screen ---', success);

      if (success) {
        navigation.replace('Main');
      } else if (error) {
        console.error('Lỗi hiển thị Toast:', error);
        Toast.show({ 
          type: 'error', 
          text1: 'Lỗi đăng nhập', 
          text2: error,
          visibilityTime: 4000
        });
      }
    } catch (screenError: any) {
      console.error('Unexpected error in LoginScreen:', screenError);
      Toast.show({ 
        type: 'error', 
        text1: 'Lỗi', 
        text2: 'Có lỗi không mong muốn xảy ra',
        visibilityTime: 4000
      });
    }
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
          {/* Input Fields */}
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
          {/* Login Button */}
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
          {/* Register Footer */}
          <View style={tw`flex-row justify-center pb-10`}>
            <Text style={tw`text-textSub`}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={tw`text-primary font-bold`}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
          <View style={tw`flex-row items-center my-6`}>
            <View style={tw`flex-1 h-[1px] bg-gray-200`} />
            <Text style={tw`mx-4 text-gray-400 text-xs`}>HOẶC</Text>
            <View style={tw`flex-1 h-[1px] bg-gray-200`} />
          </View>

          {/* Google Login Button */}
          <View style={tw`items-center`}>
            <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={loading}
              style={tw`w-14 h-14 bg-white rounded-2xl items-center justify-center border border-gray-200 shadow-sm ${
                loading ? 'opacity-50' : ''
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#22C55E" />
              ) : (
                <Text style={tw`text-2xl font-bold text-red-500`}>G</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
