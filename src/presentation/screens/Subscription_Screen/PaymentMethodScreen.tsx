// src/presentation/screens/Subscription_Screen/PaymentMethodScreen.tsx
// This screen is kept for backward compatibility but redirects to ConfirmPayment (SePay flow)
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import tw from '../../../utils/tailwind';
import { useNavigation, useRoute } from '@react-navigation/native';

const PaymentMethodScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { planId } = route.params || {};

  useEffect(() => {
    // SePay flow — skip payment method selection, go directly to confirm
    navigation.replace('ConfirmPayment', { planId });
  }, [planId, navigation]);

  return (
    <View style={tw`flex-1 bg-background items-center justify-center`}>
      <ActivityIndicator size="large" color="#7FB069" />
      <Text style={tw`text-textSub mt-4`}>Đang chuyển hướng...</Text>
    </View>
  );
};

export default PaymentMethodScreen;
