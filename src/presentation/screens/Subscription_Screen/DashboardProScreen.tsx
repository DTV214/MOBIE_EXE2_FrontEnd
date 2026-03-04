// src/presentation/screens/Subscription_Screen/DashboardProScreen.tsx
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
import {
    ChevronLeft,
    Flame,
    Footprints,
    Trophy,
    Target,
    TrendingUp,
    Zap,
    UtensilsCrossed,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { subscriptionRepository } from '../../../di/Container';
import { DashboardPro } from '../../../domain/entities/Subscription';

const DashboardProScreen = () => {
    const navigation = useNavigation<any>();
    const [dashboard, setDashboard] = useState<DashboardPro | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const data = await subscriptionRepository.getDashboardPro();
            setDashboard(data);
        } catch (error: any) {
            if (error.response?.status === 403) {
                Alert.alert('Yêu cầu nâng cấp', 'Dashboard Pro yêu cầu gói Cao Cấp.', [
                    { text: 'Nâng cấp', onPress: () => navigation.navigate('ChoosePlan') },
                    { text: 'Đóng', style: 'cancel' },
                ]);
            } else {
                console.error('Error loading dashboard:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={tw`flex-1 bg-background items-center justify-center`}>
                <ActivityIndicator size="large" color="#7FB069" />
            </View>
        );
    }

    if (!dashboard) {
        return (
            <View style={tw`flex-1 bg-background items-center justify-center px-6`}>
                <Text style={tw`text-textSub text-center`}>Không thể tải dữ liệu Dashboard Pro.</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-background`}>
            <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

            {/* Header */}
            <View style={tw`bg-gray-800 pt-14 pb-6 px-6`}>
                <View style={tw`flex-row items-center mb-4`}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ChevronLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={tw`text-white font-bold text-xl ml-4`}>Dashboard Pro</Text>
                    <View style={tw`bg-yellow-500 px-2 py-0.5 rounded-full ml-2`}>
                        <Text style={tw`text-white text-[10px] font-bold`}>PRO</Text>
                    </View>
                </View>

                {/* Streak & Goal Progress */}
                <View style={tw`flex-row`}>
                    <View style={tw`flex-1 bg-gray-700 rounded-2xl p-4 mr-2`}>
                        <Zap size={24} color="#F59E0B" />
                        <Text style={tw`text-white font-bold text-3xl mt-2`}>{dashboard.streakDays}</Text>
                        <Text style={tw`text-gray-400 text-xs`}>Chuỗi ngày</Text>
                    </View>
                    <View style={tw`flex-1 bg-gray-700 rounded-2xl p-4 ml-2`}>
                        <Target size={24} color="#7FB069" />
                        <Text style={tw`text-white font-bold text-3xl mt-2`}>{dashboard.goalProgress}%</Text>
                        <Text style={tw`text-gray-400 text-xs`}>Mục tiêu</Text>
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
                <View style={tw`px-6 py-4`}>

                    {/* Weekly Calorie Trend */}
                    <View style={tw`bg-white rounded-2xl p-4 mb-4 border border-gray-100`}>
                        <View style={tw`flex-row items-center mb-4`}>
                            <Flame size={20} color="#EF4444" />
                            <Text style={tw`text-brandDark font-bold text-base ml-2`}>Xu hướng Calo (7 ngày)</Text>
                        </View>
                        {dashboard.weeklyCalorieTrend.map((day, index) => (
                            <View key={index} style={tw`flex-row items-center mb-2`}>
                                <Text style={tw`text-textSub text-xs w-20`}>{day.date}</Text>
                                <View style={tw`flex-1 flex-row items-center`}>
                                    <View style={[tw`bg-green-400 h-3 rounded-full`, { width: `${Math.min((day.caloriesIn / 3000) * 100, 100)}%` }]} />
                                </View>
                                <Text style={tw`text-brandDark text-xs w-16 text-right font-semibold`}>{Math.round(day.caloriesIn)}</Text>
                            </View>
                        ))}
                        <View style={tw`flex-row justify-between mt-2`}>
                            <View style={tw`flex-row items-center`}>
                                <View style={tw`w-3 h-3 rounded-full bg-green-400 mr-1`} />
                                <Text style={tw`text-textSub text-[10px]`}>Calo nạp</Text>
                            </View>
                        </View>
                    </View>

                    {/* Weekly Steps Trend */}
                    <View style={tw`bg-white rounded-2xl p-4 mb-4 border border-gray-100`}>
                        <View style={tw`flex-row items-center mb-4`}>
                            <Footprints size={20} color="#3B82F6" />
                            <Text style={tw`text-brandDark font-bold text-base ml-2`}>Bước chân (7 ngày)</Text>
                        </View>
                        {dashboard.weeklyStepsTrend.map((day, index) => (
                            <View key={index} style={tw`flex-row items-center mb-2`}>
                                <Text style={tw`text-textSub text-xs w-20`}>{day.date}</Text>
                                <View style={tw`flex-1 flex-row items-center`}>
                                    <View style={[tw`bg-blue-400 h-3 rounded-full`, { width: `${Math.min((day.steps / 15000) * 100, 100)}%` }]} />
                                </View>
                                <Text style={tw`text-brandDark text-xs w-16 text-right font-semibold`}>{day.steps}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Top Exercises */}
                    <View style={tw`bg-white rounded-2xl p-4 mb-4 border border-gray-100`}>
                        <View style={tw`flex-row items-center mb-4`}>
                            <Trophy size={20} color="#F59E0B" />
                            <Text style={tw`text-brandDark font-bold text-base ml-2`}>Top bài tập (30 ngày)</Text>
                        </View>
                        {dashboard.topExercises.map((exercise, index) => (
                            <View key={index} style={tw`flex-row items-center justify-between py-3 border-b border-gray-50`}>
                                <View style={tw`flex-row items-center flex-1`}>
                                    <View style={tw`w-8 h-8 rounded-full bg-yellow-100 items-center justify-center mr-3`}>
                                        <Text style={tw`text-yellow-700 font-bold text-sm`}>{index + 1}</Text>
                                    </View>
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`text-brandDark font-semibold text-sm`}>{exercise.activity}</Text>
                                        <Text style={tw`text-textSub text-xs`}>{exercise.count} lần</Text>
                                    </View>
                                </View>
                                <Text style={tw`text-red-500 font-semibold text-sm`}>{Math.round(exercise.totalCalories)} kcal</Text>
                            </View>
                        ))}
                        {dashboard.topExercises.length === 0 && (
                            <Text style={tw`text-textSub text-center text-sm`}>Chưa có dữ liệu bài tập.</Text>
                        )}
                    </View>

                    {/* Nutrition Breakdown */}
                    <View style={tw`bg-white rounded-2xl p-4 mb-4 border border-gray-100`}>
                        <View style={tw`flex-row items-center mb-4`}>
                            <UtensilsCrossed size={20} color="#7FB069" />
                            <Text style={tw`text-brandDark font-bold text-base ml-2`}>Phân bổ bữa ăn</Text>
                        </View>
                        <View style={tw`flex-row flex-wrap`}>
                            <MealStat label="Sáng" count={dashboard.nutritionBreakdown.breakfastCount} color="bg-orange-100" textColor="text-orange-700" />
                            <MealStat label="Trưa" count={dashboard.nutritionBreakdown.lunchCount} color="bg-green-100" textColor="text-green-700" />
                            <MealStat label="Tối" count={dashboard.nutritionBreakdown.dinnerCount} color="bg-blue-100" textColor="text-blue-700" />
                            <MealStat label="Phụ" count={dashboard.nutritionBreakdown.snackCount} color="bg-purple-100" textColor="text-purple-700" />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

interface MealStatProps {
    label: string;
    count: number;
    color: string;
    textColor: string;
}

const MealStat = ({ label, count, color, textColor }: MealStatProps) => (
    <View style={tw`w-1/2 p-1`}>
        <View style={tw`${color} rounded-xl p-3 items-center`}>
            <Text style={tw`${textColor} font-bold text-2xl`}>{count}</Text>
            <Text style={tw`${textColor} text-xs`}>{label}</Text>
        </View>
    </View>
);

export default DashboardProScreen;
