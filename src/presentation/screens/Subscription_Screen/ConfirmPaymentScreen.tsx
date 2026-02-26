// src/presentation/screens/Subscription_Screen/ConfirmPaymentScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Switch,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { ChevronLeft, CreditCard } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getPlanByIdUseCase,
  getPaymentMethodsUseCase,
  processPaymentUseCase,
} from '../../../di/Container';
import { SubscriptionPlan, PaymentMethod } from '../../../domain/entities/Subscription';
import LinearGradient from 'react-native-linear-gradient';

const ConfirmPaymentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { planId, paymentMethodId } = route.params || {};

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [autoRenew, setAutoRenew] = useState(true);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [planData, methodsData] = await Promise.all([
        getPlanByIdUseCase.execute(planId),
        getPaymentMethodsUseCase.execute(),
      ]);
      setPlan(planData);
      const method = methodsData.find(m => m.id === paymentMethodId);
      setPaymentMethod(method || null);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [planId, paymentMethodId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const getDurationText = (duration: number) => {
    if (duration === 1) return '1 tháng';
    return `${duration} tháng`;
  };

  const calculateEndDate = (duration: number) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);
    return { startDate, endDate };
  };

  const handleContinue = async () => {
    if (!plan || !paymentMethod) return;

    setProcessing(true);
    try {
      const { subscription, transaction } = await processPaymentUseCase.execute({
        planId: plan.id,
        paymentMethodId: paymentMethod.id,
        autoRenew,
        userId: 'current-user', // TODO: Get from auth context
      });

      navigation.navigate('PaymentSuccess', {
        subscriptionId: subscription.id,
        transactionId: transaction.id,
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      // Handle error
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !plan || !paymentMethod) {
    return (
      <View style={tw`flex-1 bg-background items-center justify-center`}>
        <ActivityIndicator size="large" color="#7FB069" />
      </View>
    );
  }

  const { startDate, endDate } = calculateEndDate(plan.duration);

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={tw`bg-white pt-14 pb-4 px-6 border-b border-gray-100`}>
        <View style={tw`flex-row items-center mb-4`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={tw`text-brandDark font-bold text-xl ml-4`}>
            Xác nhận phương thức
          </Text>
        </View>
      </View>

      {/* Progress Indicator */}
      <View style={tw`bg-white px-6 py-4 border-b border-gray-100`}>
        <View style={tw`flex-row justify-between items-center`}>
          {[
            { label: 'Chọn gói', step: 1, completed: true },
            { label: 'Thanh toán', step: 2, completed: true },
            { label: 'Xác nhận', step: 3, completed: false },
            { label: 'Thành công', step: 4, completed: false },
          ].map((item, index) => (
            <View key={index} style={tw`flex-1 items-center`}>
              <View
                style={tw`w-8 h-8 rounded-full items-center justify-center ${
                  item.completed
                    ? 'bg-green-500'
                    : item.step === 3
                    ? 'bg-orange-500'
                    : 'bg-gray-200'
                }`}
              >
                {item.completed ? (
                  <Text style={tw`text-white font-bold text-xs`}>✓</Text>
                ) : (
                  <Text
                    style={tw`font-bold text-xs ${
                      item.step === 3 ? 'text-white' : 'text-textSub'
                    }`}
                  >
                    {item.step}
                  </Text>
                )}
              </View>
              <Text
                style={tw`text-[10px] mt-1 ${
                  item.step === 3 ? 'text-orange-500 font-semibold' : 'text-textSub'
                }`}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
        <View style={tw`px-6 py-6`}>
          {/* Package Details */}
          <View style={tw`bg-gray-50 rounded-2xl p-4 mb-6`}>
            <Text style={tw`text-brandDark font-bold text-base mb-3`}>
              Chi tiết gói:
            </Text>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-textSub`}>Gói:</Text>
              <Text style={tw`text-brandDark font-semibold`}>
                {plan.nameVietnamese}
              </Text>
            </View>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-textSub`}>Thời hạn:</Text>
              <Text style={tw`text-brandDark font-semibold`}>
                {getDurationText(plan.duration)}
              </Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-textSub`}>Giá:</Text>
              <Text style={tw`text-primary font-bold text-lg`}>
                {formatPrice(plan.price)} VND
              </Text>
            </View>
          </View>

          {/* Duration Details */}
          <View style={tw`bg-gray-50 rounded-2xl p-4 mb-6`}>
            <Text style={tw`text-brandDark font-bold text-base mb-3`}>
              Chi tiết thời hạn
            </Text>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-textSub`}>Từ ngày:</Text>
              <Text style={tw`text-brandDark font-semibold`}>
                {formatDate(startDate)}
              </Text>
            </View>
            <View style={tw`flex-row justify-between mb-4`}>
              <Text style={tw`text-textSub`}>Đến ngày:</Text>
              <Text style={tw`text-brandDark font-semibold`}>
                {formatDate(endDate)}
              </Text>
            </View>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-textSub`}>Tự động gia hạn:</Text>
              <Switch
                value={autoRenew}
                onValueChange={setAutoRenew}
                trackColor={{ false: '#D1D5DB', true: '#7FB069' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Payment Method */}
          <View style={tw`bg-gray-50 rounded-2xl p-4`}>
            <Text style={tw`text-brandDark font-bold text-base mb-3`}>
              Phương thức thanh toán
            </Text>
            <View style={tw`flex-row items-center`}>
              <CreditCard size={20} color="#7FB069" />
              <View style={tw`ml-3 flex-1`}>
                <Text style={tw`text-brandDark font-semibold`}>
                  Visa số {paymentMethod.cardNumber}
                </Text>
                <Text style={tw`text-textSub text-sm`}>
                  Hết hạn {paymentMethod.expiryDate}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={tw`bg-white border-t border-gray-100 px-6 py-4`}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={processing}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#7FB069', '#6A9A5A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={tw`py-4 rounded-2xl items-center ${
              processing ? 'opacity-50' : ''
            }`}
          >
            {processing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={tw`text-white font-bold text-base`}>Tiếp tục</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmPaymentScreen;
