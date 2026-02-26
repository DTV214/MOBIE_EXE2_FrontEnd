// src/presentation/navigation/AppNavigator.tsx

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './RootNavigator';
import Toast from 'react-native-toast-message';
import { checkOnboardingStatusUseCase } from '../../di/Container';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from '../../utils/tailwind';

// Import User Store để kiểm tra profile
import { useUserStore } from '../viewmodels/useUserStore';

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      // 1. Kiểm tra Onboarding và Token
      const [hasOnboarded, token] = await Promise.all([
        checkOnboardingStatusUseCase.execute(),
        AsyncStorage.getItem('accessToken'), // ✅ SỬA: Dùng đúng key 'accessToken'
      ]);

      if (token) {
        // 2. Nếu đã có token (đã login), cần kiểm tra xem đã có Hồ sơ sức khỏe chưa
        try {
          // Gọi hàm lấy profile ngay tại đây để check
          await useUserStore.getState().fetchUserProfile();
          const user = useUserStore.getState().user;

          if (user?.hasHealthProfile) {
            // Đã có hồ sơ -> Vào Main Dashboard
            setInitialRoute('Main');
          } else {
            // Chưa có hồ sơ -> Vào Khảo sát
            setInitialRoute('Survey');
          }
        } catch (error) {
          // Nếu token hết hạn hoặc lỗi mạng -> Xóa token và quay về Login
          console.error('Token invalid or expired:', error);
          await AsyncStorage.removeItem('accessToken'); // Clear invalid token
          setInitialRoute('Login');
        }
      } else if (hasOnboarded) {
        // Đã onboard nhưng chưa login -> Login
        setInitialRoute('Login');
      } else {
        // Chưa làm gì cả -> Onboarding
        setInitialRoute('Onboarding');
      }
    } catch (error) {
      console.error('Error checking app status:', error);
      setInitialRoute('Onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !initialRoute) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-white`}>
        <ActivityIndicator size="large" color="#7FB069" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator initialRouteName={initialRoute} />
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
};

export default AppNavigator;
