// src/presentation/screens/Subscription_Screen/PaymentSuccessScreen.tsx
import React, { useEffect, useState } from 'react';
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
import { Check, CreditCard, Home } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getPlanByIdUseCase,
  getPaymentMethodsUseCase,
  getTransactionByIdUseCase,
} from '../../../di/Container';
import { SubscriptionPlan, PaymentMethod, PaymentTransaction } from '../../../domain/entities/Subscription';
import LinearGradient from 'react-native-linear-gradient';

const PaymentSuccessScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { subscriptionId, transactionId } = route.params || {};

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);
  const [autoRenew, setAutoRenew] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (transactionId) {
        const transactionData = await getTransactionByIdUseCase.execute(transactionId);
        setTransaction(transactionData);
        
        if (transactionData) {
          const [planData, methodsData] = await Promise.all([
            getPlanByIdUseCase.execute(transactionData.planId),
            getPaymentMethodsUseCase.execute(),
          ]);
          setPlan(planData);
          const method = methodsData.find(m => m.id === transactionData.paymentMethodId);
          setPaymentMethod(method || null);
          setAutoRenew(true); // Default from subscription
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const getDurationText = (duration: number) => {
    if (duration === 1) return '1 Month';
    return `${duration} Months`;
  };

  const calculateEndDate = (startDateString: string, duration: number) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration);
    return endDate;
  };

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  if (loading || !plan || !transaction) {
    return (
      <View style={tw`flex-1 bg-background items-center justify-center`}>
        <ActivityIndicator size="large" color="#7FB069" />
      </View>
    );
  }

  const endDate = calculateEndDate(transaction.createdAt, plan.duration);

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="dark-content" backgroundColor="#7FB069" />

      {/* Header */}
      <View style={tw`bg-primary pt-14 pb-6 px-6`}>
        <View style={tw`flex-row items-center mb-4`}>
          <Text style={tw`text-white font-bold text-xl flex-1`}>Thành công</Text>
        </View>
        <Text style={tw`text-white/90 text-sm mb-2`}>Lành Care Premium</Text>
        <Text style={tw`text-white/80 text-xs`}>
          Chọn phương án tốt nhất cho sức khỏe của bạn
        </Text>
      </View>

      {/* Progress Indicator */}
      <View style={tw`bg-white px-6 py-4 border-b border-gray-100`}>
        <View style={tw`flex-row justify-between items-center`}>
          {[
            { label: 'Chọn gói', step: 1, completed: true },
            { label: 'Thanh toán', step: 2, completed: true },
            { label: 'Xác nhận', step: 3, completed: true },
            { label: 'Thành công', step: 4, completed: true },
          ].map((item, index) => (
            <View key={index} style={tw`flex-1 items-center`}>
              <View
                style={tw`w-8 h-8 rounded-full items-center justify-center ${
                  item.completed ? 'bg-green-500' : 'bg-gray-200'
                }`}
              >
                <Text style={tw`text-white font-bold text-xs`}>✓</Text>
              </View>
              <Text style={tw`text-[10px] mt-1 text-textSub`}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
        <View style={tw`px-6 py-6`}>
          {/* Success Icon */}
          <View style={tw`items-center mb-8`}>
            <View style={tw`w-32 h-32 bg-primaryLight rounded-full items-center justify-center`}>
              <Check size={64} color="#7FB069" strokeWidth={4} />
            </View>
            <Text style={tw`text-brandDark font-bold text-xl mt-4 mb-2`}>
              Thanh toán thành công
            </Text>
            <Text style={tw`text-textSub text-center`}>
              Gói thành viên đã được kích hoạt
            </Text>
          </View>

          {/* Membership Details */}
          <View style={tw`bg-white rounded-2xl p-4 mb-4 border border-gray-100`}>
            <Text style={tw`text-brandDark font-bold text-base mb-3`}>
              Membership Details
            </Text>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-textSub`}>Plan:</Text>
              <Text style={tw`text-brandDark font-semibold`}>
                {plan.type === 'premium' ? 'Premium Membership' : 'Basic Membership'}
              </Text>
            </View>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-textSub`}>Duration:</Text>
              <Text style={tw`text-brandDark font-semibold`}>
                {getDurationText(plan.duration)}
              </Text>
            </View>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-textSub`}>Price:</Text>
              <Text style={tw`text-brandDark font-semibold`}>
                ${(plan.price / 23000).toFixed(2)}
              </Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-textSub`}>Active Until:</Text>
              <Text style={tw`text-brandDark font-semibold`}>
                {formatDate(endDate.toISOString())}
              </Text>
            </View>
          </View>

          {/* Auto Renewal */}
          <View style={tw`bg-white rounded-2xl p-4 mb-4 border border-gray-100`}>
            <View style={tw`flex-row justify-between items-center`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-brandDark font-bold text-base mb-1`}>
                  Auto Renewal
                </Text>
                <Text style={tw`text-textSub text-sm`}>
                  Automatically renew subscription
                </Text>
              </View>
              <Switch
                value={autoRenew}
                onValueChange={setAutoRenew}
                trackColor={{ false: '#D1D5DB', true: '#7FB069' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Payment Information */}
          {paymentMethod && (
            <View style={tw`bg-white rounded-2xl p-4 border border-gray-100`}>
              <Text style={tw`text-brandDark font-bold text-base mb-3`}>
                Thông tin thanh toán
              </Text>
              <View style={tw`flex-row items-center mb-3`}>
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
              {transaction.transactionId && (
                <>
                  <View style={tw`flex-row justify-between mb-2`}>
                    <Text style={tw`text-textSub`}>Mã ID Thanh Toán:</Text>
                    <Text style={tw`text-brandDark font-semibold`}>
                      {transaction.transactionId}
                    </Text>
                  </View>
                  <View style={tw`flex-row justify-between`}>
                    <Text style={tw`text-textSub`}>Ngày:</Text>
                    <Text style={tw`text-brandDark font-semibold`}>
                      {formatDateTime(transaction.createdAt)}
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Home Button */}
      <View style={tw`bg-white border-t border-gray-100 px-6 py-4`}>
        <TouchableOpacity onPress={handleGoHome} activeOpacity={0.9}>
          <LinearGradient
            colors={['#7FB069', '#6A9A5A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={tw`py-4 rounded-2xl items-center flex-row justify-center`}
          >
            <Home size={20} color="#FFFFFF" />
            <Text style={tw`text-white font-bold text-base ml-2`}>Trang chủ</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentSuccessScreen;
