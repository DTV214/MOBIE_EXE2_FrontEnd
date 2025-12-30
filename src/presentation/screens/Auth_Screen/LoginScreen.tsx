import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import tw from '../../../utils/tailwind'; //
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<any>();

  const handleLogin = () => {
    // Hiện tại chỉ điều hướng cứng vào trang Main
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-white`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`flex-grow`}
      >
        {/* 1. Header Decor */}
        <View
          style={tw`h-64 bg-primaryLight/30 items-center justify-center rounded-b-[60px]`}
        >
          <View style={tw`bg-white p-6 rounded-[35px] shadow-sm`}>
            <Text style={tw`text-primary text-4xl font-black italic`}>LC</Text>
          </View>
        </View>

        <View style={tw`px-8 pt-10`}>
          {/* 2. Welcome Text */}
          <Text style={tw`text-3xl font-black text-brandDark mb-2`}>
            Chào mừng 👋
          </Text>
          <Text style={tw`text-gray-400 text-base mb-10`}>
            Đăng nhập để tiếp tục hành trình chăm sóc sức khỏe cùng LanhCare.
          </Text>

          {/* 3. Input Fields */}
          <View style={tw`mb-6`}>
            <View
              style={tw`flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 mb-4`}
            >
              <Mail size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Email của bạn"
                placeholderTextColor="#9CA3AF"
                style={tw`flex-1 ml-3 text-brandDark`}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View
              style={tw`flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3`}
            >
              <Lock size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Mật khẩu"
                placeholderTextColor="#9CA3AF"
                style={tw`flex-1 ml-3 text-brandDark`}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={tw`mt-3 items-end`}>
              <Text style={tw`text-primary font-bold text-sm`}>
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>
          </View>

          {/* 4. Login Button */}
          <TouchableOpacity onPress={handleLogin} activeOpacity={0.9}>
            <LinearGradient
              colors={['#22C55E', '#16A34A']} //
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={tw`h-16 rounded-2xl flex-row items-center justify-center shadow-lg`}
            >
              <Text
                style={tw`text-white font-black text-lg mr-2 uppercase tracking-tighter italic`}
              >
                Đăng Nhập
              </Text>
              <ArrowRight size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          {/* 5. Social Login Divider */}
          <View style={tw`flex-row items-center my-10`}>
            <View style={tw`flex-1 h-[1px] bg-gray-100`} />
            <Text style={tw`mx-4 text-gray-400 text-xs font-bold uppercase`}>
              Hoặc đăng nhập với
            </Text>
            <View style={tw`flex-1 h-[1px] bg-gray-100`} />
          </View>

          {/* 6. Social Buttons */}
          <View style={tw`flex-row justify-center mb-10`}>
            <TouchableOpacity
              style={tw`w-16 h-16 bg-gray-50 rounded-2xl items-center justify-center border border-gray-100 mx-3 shadow-sm`}
            >
              <Text style={tw`text-2xl`}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`w-16 h-16 bg-gray-50 rounded-2xl items-center justify-center border border-gray-100 mx-3 shadow-sm`}
            >
              <Text style={tw`text-2xl`}>f</Text>
            </TouchableOpacity>
          </View>

          {/* 7. Register Footer */}
          <View style={tw`flex-row justify-center pb-10`}>
            <Text style={tw`text-gray-400`}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={tw`text-primary font-black`}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
