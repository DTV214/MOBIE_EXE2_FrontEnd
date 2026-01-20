// src/presentation/screens/Subscription_Screen/PaymentMethodScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { ChevronLeft, Plus, CreditCard } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getPaymentMethodsUseCase,
  getPlanByIdUseCase,
} from '../../../di/Container';
import { PaymentMethod, SubscriptionPlan } from '../../../domain/entities/Subscription';
import LinearGradient from 'react-native-linear-gradient';

const PaymentMethodScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { planId } = route.params || {};

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [planData, methodsData] = await Promise.all([
        getPlanByIdUseCase.execute(planId),
        getPaymentMethodsUseCase.execute(),
      ]);
      setPlan(planData);
      setPaymentMethods(methodsData);
      // Auto-select default method
      const defaultMethod = methodsData.find(m => m.isDefault);
      if (defaultMethod) {
        setSelectedMethodId(defaultMethod.id);
      } else if (methodsData.length > 0) {
        setSelectedMethodId(methodsData[0].id);
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

  const getDurationText = (duration: number) => {
    if (duration === 1) return '1 tháng';
    return `${duration} tháng`;
  };

  const handleContinue = () => {
    if (selectedMethodId && planId) {
      navigation.navigate('ConfirmPayment', {
        planId,
        paymentMethodId: selectedMethodId,
      });
    }
  };

  const handleAddPaymentMethod = () => {
    // Navigate to add payment method screen (to be implemented)
    console.log('Add payment method');
  };

  if (loading || !plan) {
    return (
      <View style={tw`flex-1 bg-background items-center justify-center`}>
        <ActivityIndicator size="large" color="#7FB069" />
      </View>
    );
  }

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
            Chọn phương thức thanh toán
          </Text>
        </View>
      </View>

      {/* Progress Indicator */}
      <View style={tw`bg-white px-6 py-4 border-b border-gray-100`}>
        <View style={tw`flex-row justify-between items-center`}>
          {[
            { label: 'Chọn gói', step: 1, completed: true },
            { label: 'Thanh toán', step: 2, completed: false },
            { label: 'Xác nhận', step: 3, completed: false },
            { label: 'Thành công', step: 4, completed: false },
          ].map((item, index) => (
            <View key={index} style={tw`flex-1 items-center`}>
              <View
                style={tw`w-8 h-8 rounded-full items-center justify-center ${
                  item.completed
                    ? 'bg-green-500'
                    : item.step === 2
                    ? 'bg-orange-500'
                    : 'bg-gray-200'
                }`}
              >
                {item.completed ? (
                  <Text style={tw`text-white font-bold text-xs`}>✓</Text>
                ) : (
                  <Text
                    style={tw`font-bold text-xs ${
                      item.step === 2 ? 'text-white' : 'text-textSub'
                    }`}
                  >
                    {item.step}
                  </Text>
                )}
              </View>
              <Text
                style={tw`text-[10px] mt-1 ${
                  item.step === 2 ? 'text-orange-500 font-semibold' : 'text-textSub'
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

          {/* Payment Methods */}
          <Text style={tw`text-brandDark font-bold text-lg mb-4`}>
            Phương thức thanh toán
          </Text>

          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              isSelected={selectedMethodId === method.id}
              onSelect={() => setSelectedMethodId(method.id)}
            />
          ))}

          {/* Add Payment Method Button */}
          <TouchableOpacity
            onPress={handleAddPaymentMethod}
            style={tw`border-2 border-dashed border-gray-300 rounded-2xl p-6 items-center mt-4`}
          >
            <Plus size={24} color="#7FB069" />
            <Text style={tw`text-primary font-semibold text-base mt-2`}>
              + PHƯƠNG THỨC THANH TOÁN
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={tw`bg-white border-t border-gray-100 px-6 py-4`}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedMethodId}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#7FB069', '#6A9A5A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={tw`py-4 rounded-2xl items-center ${
              !selectedMethodId ? 'opacity-50' : ''
            }`}
          >
            <Text style={tw`text-white font-bold text-base`}>Tiếp tục</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: () => void;
}

const PaymentMethodCard = ({
  method,
  isSelected,
  onSelect,
}: PaymentMethodCardProps) => {
  return (
    <TouchableOpacity
      onPress={onSelect}
      style={tw`bg-white rounded-2xl p-4 mb-4 border-2 ${
        isSelected ? 'border-primary' : 'border-gray-200'
      }`}
    >
      {method.type === 'card' && (
        <View>
          {/* Card Visual */}
          <View style={tw`bg-blue-600 rounded-xl p-4 mb-4`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-white font-bold text-xs`}>Visa Business</Text>
              <CreditCard size={24} color="#FFFFFF" />
            </View>
            <Text style={tw`text-white font-bold text-lg mb-2`}>
              •••• •••• •••• {method.cardNumber}
            </Text>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-white/80 text-xs`}>
                {method.expiryDate}
              </Text>
              <Text style={tw`text-white/80 text-xs`}>
                {method.cardHolderName}
              </Text>
            </View>
          </View>

          {/* Selection Indicator */}
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center`}>
              <View
                style={tw`w-5 h-5 rounded-full border-2 items-center justify-center mr-2 ${
                  isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                }`}
              >
                {isSelected && (
                  <View style={tw`w-3 h-3 rounded-full bg-white`} />
                )}
              </View>
              <Text style={tw`text-brandDark font-semibold`}>
                Visa số {method.cardNumber}
              </Text>
            </View>
            <Text style={tw`text-textSub text-xs`}>
              Hết hạn {method.expiryDate}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PaymentMethodScreen;
