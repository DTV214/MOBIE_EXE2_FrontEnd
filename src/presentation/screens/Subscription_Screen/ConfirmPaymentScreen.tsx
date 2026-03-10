// src/presentation/screens/Subscription_Screen/ConfirmPaymentScreen.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { ChevronLeft, QrCode, Clock } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { subscriptionRepository } from '../../../di/Container';
import { ServicePlan, SepayPurchaseResult } from '../../../domain/entities/Subscription';
import LinearGradient from 'react-native-linear-gradient';

const ConfirmPaymentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { plan: routePlan } = route.params || {};

  const [plan, setPlan] = useState<ServicePlan | null>(routePlan || null);
  const [sepayResult, setSepayResult] = useState<SepayPurchaseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [polling, setPolling] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!plan) {
      Alert.alert('Lỗi', 'Không thể tải thông tin gói. Vui lòng thử lại.');
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getPeriodText = (value: number, unit: string) => {
    if (unit === 'MONTH') return value === 1 ? '1 tháng' : `${value} tháng`;
    return `${value} năm`;
  };

  const handlePurchase = async () => {
    if (!plan) return;
    setPurchasing(true);
    try {
      const result = await subscriptionRepository.purchaseSepay(plan.id);
      setSepayResult(result);
      // Start polling for payment status
      startPolling(result.transactionId);
    } catch (error: any) {
      console.error('Error purchasing:', error);
      const serverMsg = error.response?.data?.message || '';

      // Detect duplicate subscription error
      if (serverMsg.includes('đăng ký') || serverMsg.includes('hiệu lực')) {
        Alert.alert(
          '😊 Bạn đang dùng gói này rồi',
          'Gói hiện tại vẫn còn hiệu lực. Hãy chọn gói khác để nâng cấp trải nghiệm nhé!',
          [
            { text: 'Chọn gói khác', onPress: () => navigation.navigate('ChoosePlan') },
            { text: 'Về trang chủ', onPress: () => navigation.navigate('Main'), style: 'cancel' },
          ]
        );
      } else {
        Alert.alert('Lỗi', serverMsg || 'Không thể tạo giao dịch. Vui lòng thử lại.');
      }
    } finally {
      setPurchasing(false);
    }
  };

  const startPolling = (transactionId: number) => {
    setPolling(true);
    pollingRef.current = setInterval(async () => {
      try {
        const status = await subscriptionRepository.getTransactionStatus(transactionId);
        console.log('Polling status:', JSON.stringify(status));
        // Backend returns COMPLETED, not SUCCESS
        if (status.status === 'COMPLETED' || status.status === 'SUCCESS') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setPolling(false);
          navigation.navigate('PaymentSuccess', { transactionId });
        } else if (status.status === 'FAILED' || status.status === 'EXPIRED') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setPolling(false);
          Alert.alert('Thanh toán thất bại', status.message || 'Giao dịch không thành công.');
          setSepayResult(null);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 5000); // Poll every 5 seconds
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
          <TouchableOpacity onPress={() => {
            if (pollingRef.current) clearInterval(pollingRef.current);
            navigation.goBack();
          }}>
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={tw`text-brandDark font-bold text-xl ml-4`}>
            Xác nhận thanh toán
          </Text>
        </View>
      </View>

      {/* Progress Indicator */}
      <View style={tw`bg-white px-6 py-4 border-b border-gray-100`}>
        <View style={tw`flex-row justify-between items-center`}>
          {[
            { label: 'Chọn gói', step: 1, completed: true },
            { label: 'Xác nhận', step: 2, completed: false },
            { label: 'Thanh toán', step: 3, completed: false },
            { label: 'Thành công', step: 4, completed: false },
          ].map((item, index) => (
            <View key={index} style={tw`flex-1 items-center`}>
              <View
                style={tw`w-8 h-8 rounded-full items-center justify-center ${item.completed
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
                    style={tw`font-bold text-xs ${item.step === 2 ? 'text-white' : 'text-textSub'
                      }`}
                  >
                    {item.step}
                  </Text>
                )}
              </View>
              <Text
                style={tw`text-[10px] mt-1 ${item.step === 2 ? 'text-orange-500 font-semibold' : 'text-textSub'
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
                {plan.name}
              </Text>
            </View>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-textSub`}>Thời hạn:</Text>
              <Text style={tw`text-brandDark font-semibold`}>
                {getPeriodText(plan.periodValue, plan.periodUnit)}
              </Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-textSub`}>Giá:</Text>
              <Text style={tw`text-primary font-bold text-lg`}>
                {formatPrice(plan.price)} VND
              </Text>
            </View>
          </View>

          {/* SePay QR Code Section */}
          {sepayResult ? (
            <View style={tw`bg-white rounded-2xl p-6 border border-gray-200 mb-6`}>
              <View style={tw`items-center mb-4`}>
                <Text style={tw`text-brandDark font-bold text-lg mb-2`}>
                  Thanh toán chuyển khoản
                </Text>
                <Text style={tw`text-textSub text-sm text-center mb-4`}>
                  Quét mã QR hoặc chuyển khoản thủ công theo thông tin bên dưới
                </Text>
              </View>

              {/* QR Code Image */}
              <View style={tw`items-center mb-4`}>
                <Image
                  source={{ uri: sepayResult.qrCodeUrl }}
                  style={{ width: 250, height: 250 }}
                  resizeMode="contain"
                />
              </View>

              {/* Bank Details */}
              <View style={tw`bg-gray-50 rounded-xl p-4`}>
                <View style={tw`flex-row justify-between mb-2`}>
                  <Text style={tw`text-textSub text-sm`}>Ngân hàng:</Text>
                  <Text style={tw`text-brandDark font-semibold text-sm`}>
                    {sepayResult.bankName}
                  </Text>
                </View>
                <View style={tw`flex-row justify-between mb-2`}>
                  <Text style={tw`text-textSub text-sm`}>Số TK:</Text>
                  <Text style={tw`text-brandDark font-bold text-sm`}>
                    {sepayResult.accountNumber}
                  </Text>
                </View>
                <View style={tw`flex-row justify-between mb-2`}>
                  <Text style={tw`text-textSub text-sm`}>Chủ TK:</Text>
                  <Text style={tw`text-brandDark font-semibold text-sm`}>
                    {sepayResult.accountHolder}
                  </Text>
                </View>
                <View style={tw`flex-row justify-between mb-2`}>
                  <Text style={tw`text-textSub text-sm`}>Số tiền:</Text>
                  <Text style={tw`text-primary font-bold text-sm`}>
                    {formatPrice(sepayResult.amount)} VND
                  </Text>
                </View>
                <View style={tw`flex-row justify-between`}>
                  <Text style={tw`text-textSub text-sm`}>Nội dung CK:</Text>
                  <Text style={tw`text-brandDark font-bold text-sm`}>
                    {sepayResult.content}
                  </Text>
                </View>
              </View>

              {/* Polling Indicator */}
              {polling && (
                <View style={tw`flex-row items-center justify-center mt-4`}>
                  <ActivityIndicator size="small" color="#7FB069" />
                  <Text style={tw`text-primary font-semibold ml-2 text-sm`}>
                    Đang chờ thanh toán...
                  </Text>
                </View>
              )}
            </View>
          ) : (
            /* Payment Method Info */
            <View style={tw`bg-gray-50 rounded-2xl p-4 mb-6`}>
              <Text style={tw`text-brandDark font-bold text-base mb-3`}>
                Phương thức thanh toán
              </Text>
              <View style={tw`flex-row items-center`}>
                <QrCode size={24} color="#7FB069" />
                <View style={tw`ml-3`}>
                  <Text style={tw`text-brandDark font-semibold`}>
                    Chuyển khoản ngân hàng (SePay)
                  </Text>
                  <Text style={tw`text-textSub text-xs`}>
                    Quét mã QR để thanh toán tự động
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Button */}
      {!sepayResult && (
        <View style={tw`bg-white border-t border-gray-100 px-6 py-4`}>
          <TouchableOpacity
            onPress={handlePurchase}
            disabled={purchasing}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#7FB069', '#6A9A5A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={tw`py-4 rounded-2xl items-center ${purchasing ? 'opacity-50' : ''
                }`}
            >
              {purchasing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={tw`text-white font-bold text-base`}>
                  Tạo QR thanh toán
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ConfirmPaymentScreen;
