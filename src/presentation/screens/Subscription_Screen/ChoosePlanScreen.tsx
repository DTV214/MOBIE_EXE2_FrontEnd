// src/presentation/screens/Subscription_Screen/ChoosePlanScreen.tsx
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
import { ChevronLeft, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllPlansUseCase } from '../../../di/Container';
import { SubscriptionPlan } from '../../../domain/entities/Subscription';
import LinearGradient from 'react-native-linear-gradient';

const ChoosePlanScreen = () => {
  const navigation = useNavigation<any>();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await getAllPlansUseCase.execute();
      setPlans(data);
      // Auto-select premium plan if available
      const premiumPlan = data.find(p => p.isPopular);
      if (premiumPlan) {
        setSelectedPlanId(premiumPlan.id);
      }
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedPlanId) {
      navigation.navigate('PaymentMethod', { planId: selectedPlanId });
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 bg-background items-center justify-center`}>
        <ActivityIndicator size="large" color="#7FB069" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="dark-content" backgroundColor="#7FB069" />

      {/* Header */}
      <View style={tw`bg-primary pt-14 pb-6 px-6`}>
        <View style={tw`flex-row items-center mb-4`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={tw`text-white font-bold text-xl ml-4`}>Chọn gói</Text>
        </View>
        <Text style={tw`text-white/90 text-sm mb-2`}>Lành Care</Text>
        <Text style={tw`text-white/80 text-xs`}>
          Chọn phương án tốt nhất cho sức khỏe của bạn
        </Text>
      </View>

      {/* Progress Indicator */}
      <View style={tw`bg-white px-6 py-4 border-b border-gray-100`}>
        <View style={tw`flex-row justify-between items-center`}>
          {[
            { label: 'Chọn gói', step: 1 },
            { label: 'Thanh toán', step: 2 },
            { label: 'Xác nhận', step: 3 },
            { label: 'Thành công', step: 4 },
          ].map((item, index) => (
            <View key={index} style={tw`flex-1 items-center`}>
              <View
                style={tw`w-8 h-8 rounded-full items-center justify-center ${
                  item.step === 1 ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <Text
                  style={tw`font-bold text-xs ${
                    item.step === 1 ? 'text-white' : 'text-textSub'
                  }`}
                >
                  {item.step}
                </Text>
              </View>
              <Text
                style={tw`text-[10px] mt-1 ${
                  item.step === 1 ? 'text-primary font-semibold' : 'text-textSub'
                }`}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Plans List */}
      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
        <View style={tw`px-6 py-6`}>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlanId === plan.id}
              onSelect={() => setSelectedPlanId(plan.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={tw`bg-white border-t border-gray-100 px-6 py-4`}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedPlanId}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#7FB069', '#6A9A5A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={tw`py-4 rounded-2xl items-center ${
              !selectedPlanId ? 'opacity-50' : ''
            }`}
          >
            <Text style={tw`text-white font-bold text-base`}>
              Đi tới thanh toán
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface PlanCardProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  onSelect: () => void;
}

const PlanCard = ({ plan, isSelected, onSelect }: PlanCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getDurationText = (duration: number) => {
    if (duration === 1) return 'tháng';
    return `${duration} tháng`;
  };

  return (
    <TouchableOpacity
      onPress={onSelect}
      style={tw`mb-4 rounded-2xl overflow-hidden ${
        isSelected ? 'border-2 border-primary' : 'border border-gray-200'
      }`}
    >
      {plan.isPopular && (
        <View style={tw`bg-primary px-4 py-2 items-center`}>
          <Text style={tw`text-white font-bold text-xs`}>
            Tiết kiệm {plan.discount}%
          </Text>
        </View>
      )}
      <View style={tw`bg-white p-6`}>
        <View style={tw`flex-row justify-between items-start mb-4`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-brandDark font-bold text-xl mb-1`}>
              {plan.nameVietnamese}
            </Text>
            <Text style={tw`text-textSub text-sm`}>
              {formatPrice(plan.price)} VND / {getDurationText(plan.duration)}
            </Text>
            {plan.originalPrice && plan.discount && (
              <Text style={tw`text-textSub text-xs line-through mt-1`}>
                {formatPrice(plan.originalPrice)} VND
              </Text>
            )}
          </View>
          <View
            style={tw`w-6 h-6 rounded-full border-2 items-center justify-center ${
              isSelected ? 'border-primary bg-primary' : 'border-gray-300'
            }`}
          >
            {isSelected && <Check size={16} color="#FFFFFF" />}
          </View>
        </View>

        {/* Features */}
        <View style={tw`border-t border-gray-100 pt-4`}>
          {plan.features.map((feature, index) => (
            <View key={index} style={tw`flex-row items-center mb-2`}>
              <Check size={16} color="#7FB069" />
              <Text style={tw`text-brandDark text-sm ml-2 flex-1`}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChoosePlanScreen;
