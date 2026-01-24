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

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    checkOnboardingAndNavigate();
  }, []);

  const checkOnboardingAndNavigate = async () => {
    try {
      // ✅ FIXED: Enhanced navigation logic - check both onboarding and auth status
      const [hasOnboarded, token] = await Promise.all([
        checkOnboardingStatusUseCase.execute(),
        AsyncStorage.getItem('user_token')
      ]);

      if (token) {
        // User đã login → vào Main app
        setInitialRoute('Main');
      } else if (hasOnboarded) {
        // Đã onboard nhưng chưa login → vào Login
        setInitialRoute('Login');
      } else {
        // Chưa onboard → vào Onboarding
        setInitialRoute('Onboarding');
      }
    } catch (error) {
      console.error('Error checking app status:', error);
      // Mặc định vào Onboarding nếu có lỗi
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
