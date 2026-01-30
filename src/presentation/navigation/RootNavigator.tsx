// src/presentation/navigation/RootNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Screens
import OnboardingScreen from '../screens/Onboarding_Screen/OnboardingScreen';
import LoginScreen from '../screens/Auth_Screen/LoginScreen';
import RegisterScreen from '../screens/Auth_Screen/RegisterScreen';
import HomeScreen from '../screens/Home_Screen/HomeScreen';
import MainTabNavigator from './MainTabNavigator';
import HospitalDetailScreen from '../screens/Hospital_Screen/HospitalDetailScreen';
import ForumDetailScreen from '../screens/Forum_Screen/ForumDetailScreen';
import SettingsScreen from '../screens/Setting_Screen/SettingsScreen';
import HealthDetailScreen from '../screens/Dashboard_Screen/HealthDetailScreen';
import FoodDetailScreen from '../screens/Meal_Screen/FoodDetailScreen';
import HeartRateDetailScreen from '../screens/Dashboard_Screen/HeartRateDetailScreen';
import HealthSummaryScreen from '../screens/Dashboard_Screen/HealthSummaryScreen';
import AddFoodScreen from '../screens/Meal_Screen/AddFoodScreen';
import CreatePostScreen from '../screens/Forum_Screen/CreatePostScreen';
import ChoosePlanScreen from '../screens/Subscription_Screen/ChoosePlanScreen';
import PaymentMethodScreen from '../screens/Subscription_Screen/PaymentMethodScreen';
import ConfirmPaymentScreen from '../screens/Subscription_Screen/ConfirmPaymentScreen';
import PaymentSuccessScreen from '../screens/Subscription_Screen/PaymentSuccessScreen';
import AIChatScreen from '../screens/AI_Screen/AIChatScreen';
import EditProfileScreen from '../screens/Profile_Screen/EditProfileScreen';
// ✅ MỚI: Import màn hình khảo sát
import SurveyScreen from '../screens/Survey_Screen/SurveyScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = ({ initialRouteName }: { initialRouteName: string }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      {/* Auth Flow */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* ✅ MỚI: Thêm màn hình Survey vào Stack */}
      <Stack.Screen name="Survey" component={SurveyScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      {/* Main Flow */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />

      {/* Sub-screens */}
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HospitalDetail" component={HospitalDetailScreen} />
      <Stack.Screen name="ForumDetail" component={ForumDetailScreen} />
      <Stack.Screen name="HealthDetail" component={HealthDetailScreen} />
      <Stack.Screen name="HealthSummary" component={HealthSummaryScreen} />
      <Stack.Screen name="HeartRateDetail" component={HeartRateDetailScreen} />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
      <Stack.Screen name="AddFood" component={AddFoodScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="AIChat" component={AIChatScreen} />

      {/* Subscription Flow */}
      <Stack.Screen name="ChoosePlan" component={ChoosePlanScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="ConfirmPayment" component={ConfirmPaymentScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
