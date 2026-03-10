// src/presentation/screens/Subscription_Screen/ChoosePlanScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { ChevronLeft, Check, Crown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { subscriptionRepository } from '../../../di/Container';
import { ServicePlan } from '../../../domain/entities/Subscription';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../contexts/ThemeContext';

const ChoosePlanScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [plans, setPlans] = useState<ServicePlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPlanId, setCurrentPlanId] = useState<number | null>(null);

  useEffect(() => {
    loadPlans();
    loadCurrentSubscription();
  }, []);

  const loadCurrentSubscription = async () => {
    try {
      const sub = await subscriptionRepository.getMySubscription();
      if (sub && sub.status === 'ACTIVE') {
        setCurrentPlanId(sub.servicePlanId);
      }
    } catch (error) {
      console.log('No active subscription found');
    }
  };

  const loadPlans = async () => {
    try {
      const data = await subscriptionRepository.getAllPlans();
      console.log('Plans API response:', JSON.stringify(data));
      const plansList = Array.isArray(data) ? data : [];
      setPlans(plansList);
      // Auto-select first plan
      if (plansList.length > 0) {
        setSelectedPlanId(plansList[0].id);
      }
    } catch (error) {
      console.error('Error loading plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    const selectedPlan = plans.find(p => p.id === selectedPlanId);
    if (!selectedPlan) return;

    if (selectedPlan.id === currentPlanId) {
      Alert.alert(
        '😊 Bạn đang dùng gói này',
        `Bạn đang sử dụng gói "${selectedPlan.name}" rồi. Hãy chọn gói khác để nâng cấp trải nghiệm nhé!`,
        [{ text: 'Đã hiểu', style: 'default' }]
      );
      return;
    }

    navigation.navigate('ConfirmPayment', { plan: selectedPlan });
  };

  if (loading) {
    return (
      <View style={[tw`flex-1 items-center justify-center`, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.primary} />

      {/* Header */}
      <View style={[tw`pt-14 pb-6 px-6`, { backgroundColor: colors.primary }]}>
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
      <View style={[tw`px-6 py-4 border-b`, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={tw`flex-row justify-between items-center`}>
          {[
            { label: 'Chọn gói', step: 1 },
            { label: 'Xác nhận', step: 2 },
            { label: 'Thanh toán', step: 3 },
            { label: 'Thành công', step: 4 },
          ].map((item, index) => (
            <View key={index} style={tw`flex-1 items-center`}>
              <View
                style={[
                  tw`w-8 h-8 rounded-full items-center justify-center`,
                  { backgroundColor: item.step === 1 ? colors.primary : colors.border }
                ]}
              >
                <Text
                  style={[
                    tw`font-bold text-xs`,
                    { color: item.step === 1 ? '#ffffff' : colors.textSecondary }
                  ]}
                >
                  {item.step}
                </Text>
              </View>
              <Text
                style={[
                  tw`text-[10px] mt-1`,
                  { 
                    color: item.step === 1 ? colors.primary : colors.textSecondary,
                    fontWeight: item.step === 1 ? '600' : 'normal'
                  }
                ]}
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
          {(plans || []).map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlanId === plan.id}
              isCurrentPlan={plan.id === currentPlanId}
              onSelect={() => setSelectedPlanId(plan.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[tw`border-t px-6 py-4`, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedPlanId}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[colors.primary, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              tw`py-4 rounded-2xl items-center`,
              !selectedPlanId && tw`opacity-50`
            ]}
          >
            <Text style={[tw`font-bold text-base`, { color: '#ffffff' }]}>
              Đi tới thanh toán
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface PlanCardProps {
  plan: ServicePlan;
  isSelected: boolean;
  isCurrentPlan: boolean;
  onSelect: () => void;
}

const FEATURE_LABELS: Record<string, string> = {
  'DAILY_LOG': 'Nhật ký sức khỏe hàng ngày',
  'DAILY_LOG_LIMITED': 'Nhật ký sức khỏe (giới hạn)',
  'MEAL_LOG': 'Theo dõi bữa ăn',
  'EXERCISE_LOG': 'Theo dõi tập luyện',
  'FORUM_POST': 'Đăng bài trên diễn đàn',
  'FORUM_VIEW': 'Xem diễn đàn',
  'AI_CHAT_LIMITED': 'AI Chat (10 lượt/ngày)',
  'AI_CHAT_UNLIMITED': 'AI Chat không giới hạn',
  'HOSPITAL_SEARCH': 'Tìm kiếm bệnh viện',
  'HEALTH_REPORT_WEEKLY': 'Báo cáo sức khỏe hàng tuần',
  'HEALTH_REPORT_FULL': 'Báo cáo sức khỏe chi tiết',
  'DASHBOARD_PRO': 'Dashboard nâng cao',
  'EXPORT_PDF': 'Xuất báo cáo PDF',
};

const getFeatureLabel = (code: string): string => {
  return FEATURE_LABELS[code.trim()] || code;
};

const PlanCard = ({ plan, isSelected, isCurrentPlan, onSelect }: PlanCardProps) => {
  const { colors } = useTheme();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getPeriodText = (value: number, unit: string) => {
    if (unit === 'MONTH') return value === 1 ? 'tháng' : `${value} tháng`;
    return `${value} năm`;
  };

  const isPremium = plan.name.toLowerCase().includes('cao cấp');

  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[
        tw`mb-4 rounded-2xl overflow-hidden border-2`,
        {
          borderColor: isCurrentPlan
            ? '#F59E0B'
            : isSelected
            ? colors.primary
            : colors.border
        }
      ]}
    >
      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <View style={tw`bg-amber-400 px-4 py-2 flex-row items-center justify-center`}>
          <Crown size={14} color="#FFFFFF" />
          <Text style={tw`text-white font-bold text-xs ml-1`}>
            Gói hiện tại của bạn
          </Text>
        </View>
      )}
      {!isCurrentPlan && isPremium && plan.periodValue >= 6 && (
        <View style={[tw`px-4 py-2 items-center`, { backgroundColor: colors.primary }]}>
          <Text style={[tw`font-bold text-xs`, { color: '#ffffff' }]}>
            Tiết kiệm 16%
          </Text>
        </View>
      )}
      <View style={[tw`p-6`, { backgroundColor: colors.surface }]}>
        <View style={tw`flex-row justify-between items-start mb-4`}>
          <View style={tw`flex-1`}>
            <Text style={[tw`font-bold text-xl mb-1`, { color: colors.text }]}>
              {plan.name}
            </Text>
            <Text style={[tw`text-sm`, { color: colors.textSecondary }]}>
              {formatPrice(plan.price)} VND / {getPeriodText(plan.periodValue, plan.periodUnit)}
            </Text>
          </View>
          <View
            style={[
              tw`w-6 h-6 rounded-full border-2 items-center justify-center`,
              {
                borderColor: isSelected ? colors.primary : colors.border,
                backgroundColor: isSelected ? colors.primary : 'transparent'
              }
            ]}
          >
            {isSelected && <Check size={16} color="#FFFFFF" />}
          </View>
        </View>

        {/* Description */}
        <Text style={[tw`text-xs mb-3`, { color: colors.textSecondary }]}>{plan.description}</Text>

        {/* Features */}
        <View style={[tw`border-t pt-4`, { borderTopColor: colors.border }]}>
          {plan.features.map((feature, index) => (
            <View key={index} style={tw`flex-row items-center mb-2`}>
              <Check size={16} color={colors.primary} />
              <Text style={[tw`text-sm ml-2 flex-1`, { color: colors.text }]}>
                {getFeatureLabel(feature)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChoosePlanScreen;
