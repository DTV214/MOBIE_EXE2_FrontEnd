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
import HeartRateDetailScreen from '../screens/Dashboard_Screen/HeartRateDetailScreen';
import HealthSummaryScreen from '../screens/Dashboard_Screen/HealthSummaryScreen';
import AddFoodScreen from '../screens/Meal_Screen/AddFoodScreen';
import CreatePostScreen from '../screens/Forum_Screen/CreatePostScreen';
import ChoosePlanScreen from '../screens/Subscription_Screen/ChoosePlanScreen';
import PaymentMethodScreen from '../screens/Subscription_Screen/PaymentMethodScreen';
import ConfirmPaymentScreen from '../screens/Subscription_Screen/ConfirmPaymentScreen';
import PaymentSuccessScreen from '../screens/Subscription_Screen/PaymentSuccessScreen';
import AIChatScreen from '../screens/AI_Screen/AIChatScreen';

const Stack = createNativeStackNavigator();

interface RootNavigatorProps {
  initialRouteName?: string;
}

const RootNavigator = ({ initialRouteName = 'Onboarding' }: RootNavigatorProps) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
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
      <Stack.Screen name="HealthSummary" component={HealthSummaryScreen} />
      <Stack.Screen name="HeartRateDetail" component={HeartRateDetailScreen} />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
      <Stack.Screen name="AddFood" component={AddFoodScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="ChoosePlan" component={ChoosePlanScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="ConfirmPayment" component={ConfirmPaymentScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
      <Stack.Screen name="AIChat" component={AIChatScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
