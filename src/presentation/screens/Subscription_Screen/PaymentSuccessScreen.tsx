// src/presentation/screens/Subscription_Screen/PaymentSuccessScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { CheckCircle, ArrowRight } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { subscriptionRepository } from '../../../di/Container';
import { ActiveSubscription } from '../../../domain/entities/Subscription';
import LinearGradient from 'react-native-linear-gradient';

const PaymentSuccessScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [subscription, setSubscription] = useState<ActiveSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const sub = await subscriptionRepository.getMySubscription();
      setSubscription(sub);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Progress Indicator */}
      <View style={tw`bg-white pt-14 px-6 py-4 border-b border-gray-100`}>
        <View style={tw`flex-row justify-between items-center`}>
          {[
            { label: 'Chọn gói', step: 1 },
            { label: 'Xác nhận', step: 2 },
            { label: 'Thanh toán', step: 3 },
            { label: 'Thành công', step: 4 },
          ].map((item, index) => (
            <View key={index} style={tw`flex-1 items-center`}>
              <View style={tw`w-8 h-8 rounded-full bg-green-500 items-center justify-center`}>
                <Text style={tw`text-white font-bold text-xs`}>✓</Text>
              </View>
              <Text style={tw`text-[10px] mt-1 text-green-600 font-semibold`}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Success Content */}
      <View style={tw`flex-1 items-center justify-center px-6`}>
        <View style={tw`items-center`}>
          <CheckCircle size={80} color="#7FB069" />
          <Text style={tw`text-brandDark font-bold text-2xl mt-6 mb-2`}>
            Thanh toán thành công!
          </Text>
          <Text style={tw`text-textSub text-center text-sm mb-8`}>
            Cảm ơn bạn đã đăng ký gói dịch vụ LànhCare
          </Text>
        </View>

        {subscription && (
          <View style={tw`bg-gray-50 rounded-2xl p-6 w-full mb-6`}>
            <Text style={tw`text-brandDark font-bold text-base mb-4`}>
              Chi tiết đăng ký
            </Text>
            <View style={tw`flex-row justify-between mb-3`}>
              <Text style={tw`text-textSub`}>Gói:</Text>
              <Text style={tw`text-brandDark font-semibold`}>
                {subscription.servicePlanName}
              </Text>
            </View>
            <View style={tw`flex-row justify-between mb-3`}>
              <Text style={tw`text-textSub`}>Trạng thái:</Text>
              <View style={tw`bg-green-100 px-3 py-1 rounded-full`}>
                <Text style={tw`text-green-700 font-semibold text-xs`}>
                  {subscription.status === 'ACTIVE' ? 'Đang hoạt động' : subscription.status}
                </Text>
              </View>
            </View>
            <View style={tw`flex-row justify-between mb-3`}>
              <Text style={tw`text-textSub`}>Từ ngày:</Text>
              <Text style={tw`text-brandDark font-semibold`}>
                {formatDate(subscription.startDate)}
              </Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-textSub`}>Đến ngày:</Text>
              <Text style={tw`text-brandDark font-semibold`}>
                {formatDate(subscription.endDate)}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={tw`px-6 py-4`}>
        <TouchableOpacity
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#7FB069', '#6A9A5A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={tw`py-4 rounded-2xl flex-row items-center justify-center`}
          >
            <Text style={tw`text-white font-bold text-base mr-2`}>
              Về trang chủ
            </Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentSuccessScreen;
