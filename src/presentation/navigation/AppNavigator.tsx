// src/presentation/navigation/AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './RootNavigator';
import Toast from 'react-native-toast-message';
import { checkOnboardingStatusUseCase } from '../../di/Container';
import tw from '../../utils/tailwind';

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    checkOnboardingAndNavigate();
  }, []);

  const checkOnboardingAndNavigate = async () => {
    try {
      const hasCompleted = await checkOnboardingStatusUseCase.execute();
      // Nếu đã xem onboarding thì vào Login, chưa thì vào Onboarding
      setInitialRoute(hasCompleted ? 'Login' : 'Onboarding');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
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
