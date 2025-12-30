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
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<any>();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-white`}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`flex-grow`}
      >
        {/* 1. Header with Back Button */}
        <View style={tw`pt-14 px-6 flex-row items-center justify-between`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`p-3 bg-gray-50 rounded-2xl border border-gray-100`}
          >
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={tw`text-primary font-black italic text-xl`}>
            LanhCare
          </Text>
          <View style={tw`w-12`} /> {/* Spacer to center title */}
        </View>

        <View style={tw`px-8 pt-10`}>
          {/* 2. Welcome Text */}
          <Text style={tw`text-3xl font-black text-brandDark mb-2`}>
            Tạo tài khoản 📝
          </Text>
          <Text style={tw`text-gray-400 text-base mb-8`}>
            Tham gia cùng chúng tôi để bắt đầu theo dõi sức khỏe của bạn ngay
            hôm nay.
          </Text>

          {/* 3. Input Fields */}
          <View style={tw`mb-6`}>
            {/* Full Name */}
            <View
              style={tw`flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 mb-4`}
            >
              <User size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Họ và tên"
                placeholderTextColor="#9CA3AF"
                style={tw`flex-1 ml-3 text-brandDark`}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email */}
            <View
              style={tw`flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 mb-4`}
            >
              <Mail size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Địa chỉ Email"
                placeholderTextColor="#9CA3AF"
                style={tw`flex-1 ml-3 text-brandDark`}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View
              style={tw`flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 mb-6`}
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

            {/* Terms and Conditions Note */}
            <Text style={tw`text-gray-400 text-xs text-center mb-8`}>
              Bằng cách đăng ký, bạn đồng ý với{' '}
              <Text style={tw`text-primary font-bold`}>Điều khoản dịch vụ</Text>{' '}
              và{' '}
              <Text style={tw`text-primary font-bold`}>Chính sách bảo mật</Text>{' '}
              của chúng tôi.
            </Text>
          </View>

          {/* 4. Register Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.replace('Main')}
          >
            <LinearGradient
              colors={['#22C55E', '#16A34A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={tw`h-16 rounded-2xl flex-row items-center justify-center shadow-lg`}
            >
              <Text
                style={tw`text-white font-black text-lg mr-2 uppercase tracking-tighter italic`}
              >
                Đăng Ký Ngay
              </Text>
              <ArrowRight size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          {/* 5. Login Footer */}
          <View style={tw`flex-row justify-center py-10`}>
            <Text style={tw`text-gray-400`}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={tw`text-primary font-black`}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
