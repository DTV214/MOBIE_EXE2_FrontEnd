// src/presentation/screens/Subscription_Screen/MySubscriptionScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
    ChevronLeft,
    Crown,
    ArrowRight,
    Calendar,
    Shield,
    Check,
    AlertCircle,
    Zap,
} from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { subscriptionRepository } from '../../../di/Container';
import { ActiveSubscription } from '../../../domain/entities/Subscription';
import LinearGradient from 'react-native-linear-gradient';

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

const MySubscriptionScreen = () => {
    const navigation = useNavigation<any>();
    const [subscription, setSubscription] = useState<ActiveSubscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadSubscription = useCallback(async () => {
        try {
            const sub = await subscriptionRepository.getMySubscription();
            setSubscription(sub);
        } catch (error) {
            console.error('Error loading subscription:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Reload when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            loadSubscription();
        }, [loadSubscription])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadSubscription();
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('vi-VN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    const getDaysRemaining = (endDateStr: string) => {
        const end = new Date(endDateStr);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Đang hoạt động' };
            case 'EXPIRED': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Đã hết hạn' };
            case 'CANCELLED': return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Đã hủy' };
            default: return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: status };
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
            <StatusBar barStyle="light-content" backgroundColor="#7FB069" />

            {/* Header */}
            <LinearGradient
                colors={['#7FB069', '#6A9A5A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={tw`pt-14 pb-6 px-6`}
            >
                <View style={tw`flex-row items-center mb-4`}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
                        <ChevronLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={tw`text-white font-bold text-xl`}>Gói dịch vụ của tôi</Text>
                </View>

                {subscription ? (
                    <View style={tw`bg-white/20 rounded-2xl p-4`}>
                        <View style={tw`flex-row items-center justify-between`}>
                            <View style={tw`flex-row items-center`}>
                                <Crown size={24} color="#FFFFFF" />
                                <Text style={tw`text-white font-bold text-lg ml-2`}>
                                    {subscription.servicePlanName}
                                </Text>
                            </View>
                            <View style={tw`${getStatusColor(subscription.status).bg} px-3 py-1 rounded-full`}>
                                <Text style={tw`${getStatusColor(subscription.status).text} font-semibold text-xs`}>
                                    {getStatusColor(subscription.status).label}
                                </Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={tw`bg-white/20 rounded-2xl p-4`}>
                        <View style={tw`flex-row items-center`}>
                            <AlertCircle size={24} color="#FFFFFF" />
                            <Text style={tw`text-white font-semibold text-base ml-2`}>
                                Chưa có gói dịch vụ
                            </Text>
                        </View>
                    </View>
                )}
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={tw`flex-1`}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7FB069']} />
                }
            >
                {subscription ? (
                    <View style={tw`px-6 py-6`}>
                        {/* Time Info */}
                        <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
                            <Text style={tw`text-brandDark font-bold text-base mb-4`}>
                                Thông tin thời hạn
                            </Text>

                            <View style={tw`flex-row items-center mb-3`}>
                                <View style={tw`bg-green-50 p-2 rounded-xl mr-3`}>
                                    <Calendar size={18} color="#7FB069" />
                                </View>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-textSub text-xs`}>Ngày bắt đầu</Text>
                                    <Text style={tw`text-brandDark font-semibold`}>
                                        {formatDate(subscription.startDate)}
                                    </Text>
                                </View>
                            </View>

                            <View style={tw`flex-row items-center mb-3`}>
                                <View style={tw`bg-amber-50 p-2 rounded-xl mr-3`}>
                                    <Calendar size={18} color="#F59E0B" />
                                </View>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`text-textSub text-xs`}>Ngày hết hạn</Text>
                                    <Text style={tw`text-brandDark font-semibold`}>
                                        {formatDate(subscription.endDate)}
                                    </Text>
                                </View>
                            </View>

                            {/* Days remaining bar */}
                            {subscription.status === 'ACTIVE' && (
                                <View style={tw`mt-2 bg-gray-100 rounded-xl p-3`}>
                                    <View style={tw`flex-row items-center justify-between`}>
                                        <Text style={tw`text-textSub text-sm`}>Còn lại</Text>
                                        <Text style={tw`text-primary font-bold text-lg`}>
                                            {getDaysRemaining(subscription.endDate)} ngày
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Features */}
                        <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
                            <View style={tw`flex-row items-center mb-4`}>
                                <Shield size={18} color="#7FB069" />
                                <Text style={tw`text-brandDark font-bold text-base ml-2`}>
                                    Tính năng bao gồm
                                </Text>
                            </View>

                            {(subscription.features || []).map((feature, index) => (
                                <View key={index} style={tw`flex-row items-center mb-3`}>
                                    <View style={tw`bg-green-50 w-6 h-6 rounded-full items-center justify-center mr-3`}>
                                        <Check size={14} color="#7FB069" />
                                    </View>
                                    <Text style={tw`text-brandDark text-sm flex-1`}>
                                        {getFeatureLabel(feature)}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Upgrade / Change Plan */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ChoosePlan')}
                            style={tw`mb-4`}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#F59E0B', '#D97706']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={tw`py-4 rounded-2xl flex-row items-center justify-center`}
                            >
                                <Zap size={20} color="#FFFFFF" />
                                <Text style={tw`text-white font-bold text-base ml-2`}>
                                    Đổi gói / Nâng cấp
                                </Text>
                                <ArrowRight size={18} color="#FFFFFF" style={tw`ml-1`} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* No subscription - CTA to buy */
                    <View style={tw`px-6 py-10 items-center`}>
                        <View style={tw`bg-gray-100 w-20 h-20 rounded-full items-center justify-center mb-6`}>
                            <Crown size={40} color="#9CA3AF" />
                        </View>
                        <Text style={tw`text-brandDark font-bold text-xl mb-2 text-center`}>
                            Bạn chưa có gói dịch vụ
                        </Text>
                        <Text style={tw`text-textSub text-sm text-center mb-8 px-4`}>
                            Đăng ký gói dịch vụ để mở khóa nhiều tính năng premium như AI Chat, báo cáo sức khỏe, theo dõi dinh dưỡng và tập luyện!
                        </Text>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('ChoosePlan')}
                            style={tw`w-full`}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#7FB069', '#6A9A5A']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={tw`py-4 rounded-2xl flex-row items-center justify-center`}
                            >
                                <Crown size={20} color="#FFFFFF" />
                                <Text style={tw`text-white font-bold text-base ml-2`}>
                                    Khám phá các gói dịch vụ
                                </Text>
                                <ArrowRight size={18} color="#FFFFFF" style={tw`ml-1`} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default MySubscriptionScreen;
