// src/presentation/screens/Auth_Screen/RegisterScreen.tsx
import React, { useState } from 'react';
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
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronLeft,
  Leaf,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<any>();

  const handleRegister = () => {
    // TODO: Implement register logic với API
    // Hiện tại chỉ điều hướng vào trang Main
    navigation.replace('Main');
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
        {/* Header với Back Button */}
        <View style={tw`pt-14 px-6 flex-row items-center justify-between mb-4`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`p-3 bg-gray-50 rounded-2xl border border-gray-100`}
          >
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={tw`flex-row items-center`}>
            <Leaf size={24} color="#7FB069" />
            <Text style={tw`text-primary font-black text-xl ml-2`}>Lành Care</Text>
          </View>
          <View style={tw`w-12`} /> {/* Spacer để center title */}
        </View>

        <View style={tw`px-8 flex-1`}>
          {/* Title */}
          <Text style={tw`text-3xl font-black text-brandDark mb-2`}>
            Tạo Tài Khoản
          </Text>
          <Text style={tw`text-base text-textSub mb-10`}>
            Sống khỏe mạnh, sống bình tĩnh
          </Text>

          {/* Input Fields */}
          <View style={tw`mb-6`}>
            {/* Full Name */}
            <View
              style={tw`bg-white border border-gray-200 rounded-2xl px-4 py-4 mb-4 shadow-sm`}
            >
              <Text style={tw`text-xs text-textSub mb-2 font-semibold`}>Tên đầy đủ</Text>
              <View style={tw`flex-row items-center`}>
                <User size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Nhập tên đầy đủ"
                  placeholderTextColor="#9CA3AF"
                  style={tw`flex-1 ml-3 text-brandDark text-base`}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Email */}
            <View
              style={tw`bg-white border border-gray-200 rounded-2xl px-4 py-4 mb-4 shadow-sm`}
            >
              <Text style={tw`text-xs text-textSub mb-2 font-semibold`}>Email</Text>
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
              style={tw`bg-white border border-gray-200 rounded-2xl px-4 py-4 mb-6 shadow-sm`}
            >
              <Text style={tw`text-xs text-textSub mb-2 font-semibold`}>Mật khẩu</Text>
              <View style={tw`flex-row items-center`}>
                <Lock size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Tạo mật khẩu"
                  placeholderTextColor="#9CA3AF"
                  style={tw`flex-1 ml-3 text-brandDark text-base`}
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
            </View>

            {/* Terms and Conditions Note */}
            <Text style={tw`text-textSub text-xs text-center mb-8`}>
              Bằng cách đăng ký, bạn đồng ý với{' '}
              <Text style={tw`text-primary font-bold`}>Điều khoản dịch vụ</Text> và{' '}
              <Text style={tw`text-primary font-bold`}>Chính sách bảo mật</Text> của chúng
              tôi.
            </Text>
          </View>

          {/* Register Button */}
          <TouchableOpacity onPress={handleRegister} activeOpacity={0.9}>
            <LinearGradient
              colors={['#7FB069', '#6A9A5A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={tw`h-16 rounded-2xl flex-row items-center justify-center shadow-lg mb-8`}
            >
              <Text style={tw`text-white font-bold text-lg mr-2`}>Đăng ký</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Login Footer */}
          <View style={tw`flex-row justify-center pb-10`}>
            <Text style={tw`text-textSub`}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={tw`text-primary font-bold`}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
