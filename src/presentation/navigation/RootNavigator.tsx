// src/presentation/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home_Screen/HomeScreen';
import MainTabNavigator from './MainTabNavigator'; // Import Tab Navigator mới
import HospitalDetailScreen from '../screens/Hospital_Screen/HospitalDetailScreen';
import ForumDetailScreen from '../screens/Forum_Screen/ForumDetailScreen';
import SettingsScreen from '../screens/Setting_Screen/SettingsScreen';
import HealthDetailScreen from '../screens/Dashboard_Screen/HealthDetailScreen';
import FoodDetailScreen from '../screens/Meal_Screen/FoodDetailScreen';
import OnboardingScreen from '../screens/Onboarding_Screen/OnboardingScreen';
import LoginScreen from '../screens/Auth_Screen/LoginScreen';
import RegisterScreen from '../screens/Auth_Screen/RegisterScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* Thay DashboardScreen bằng MainTabNavigator */}
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="HospitalDetail" component={HospitalDetailScreen} />
      <Stack.Screen name="ForumDetail" component={ForumDetailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HealthDetail" component={HealthDetailScreen} />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
