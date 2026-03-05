// src/presentation/screens/Subscription_Screen/HealthReportScreen.tsx
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
    Calendar,
    Flame,
    Footprints,
    UtensilsCrossed,
    Dumbbell,
    TrendingUp,
    Heart,
    Lightbulb,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { subscriptionRepository } from '../../../di/Container';
import { HealthReport } from '../../../domain/entities/Subscription';

const HealthReportScreen = () => {
    const navigation = useNavigation<any>();
    const [report, setReport] = useState<HealthReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [reportType, setReportType] = useState<'weekly' | 'full'>('weekly');

    useEffect(() => {
        loadReport();
    }, [reportType]);

    const loadReport = async () => {
        setLoading(true);
        try {
            const data = reportType === 'weekly'
                ? await subscriptionRepository.getWeeklyReport()
                : await subscriptionRepository.getFullReport();
            setReport(data);
        } catch (error: any) {
            if (error.response?.status === 403) {
                Alert.alert('Yêu cầu nâng cấp', 'Tính năng này yêu cầu gói Cơ Bản trở lên.', [
                    { text: 'Nâng cấp', onPress: () => navigation.navigate('ChoosePlan') },
                    { text: 'Đóng', style: 'cancel' },
                ]);
            } else {
                console.error('Error loading report:', error);
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

    return (
        <View style={tw`flex-1 bg-background`}>
            <StatusBar barStyle="light-content" backgroundColor="#7FB069" />

            {/* Header */}
            <View style={tw`bg-primary pt-14 pb-6 px-6`}>
                <View style={tw`flex-row items-center mb-2`}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ChevronLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={tw`text-white font-bold text-xl ml-4`}>
                        Báo cáo sức khỏe
                    </Text>
                </View>
            </View>

            {/* Tab Selector */}
            <View style={tw`bg-white px-6 py-3 flex-row border-b border-gray-100`}>
                <TouchableOpacity
                    onPress={() => setReportType('weekly')}
                    style={tw`flex-1 py-2 rounded-xl items-center ${reportType === 'weekly' ? 'bg-primary' : 'bg-gray-100'
                        }`}
                >
                    <Text style={tw`font-semibold text-sm ${reportType === 'weekly' ? 'text-white' : 'text-textSub'
                        }`}>
                        Tuần
                    </Text>
                </TouchableOpacity>
                <View style={tw`w-3`} />
                <TouchableOpacity
                    onPress={() => setReportType('full')}
                    style={tw`flex-1 py-2 rounded-xl items-center ${reportType === 'full' ? 'bg-primary' : 'bg-gray-100'
                        }`}
                >
                    <Text style={tw`font-semibold text-sm ${reportType === 'full' ? 'text-white' : 'text-textSub'
                        }`}>
                        Chi tiết
                    </Text>
                </TouchableOpacity>
            </View>

            {report ? (
                <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
                    <View style={tw`px-6 py-4`}>
                        {/* Period */}
                        <View style={tw`flex-row items-center mb-4`}>
                            <Calendar size={16} color="#6B7280" />
                            <Text style={tw`text-textSub text-sm ml-2`}>
                                {report.startDate} — {report.endDate} ({report.daysLogged} ngày ghi nhận)
                            </Text>
                        </View>

                        {/* Summary Cards */}
                        <View style={tw`flex-row flex-wrap justify-between mb-4`}>
                            <StatCard icon={<Flame size={20} color="#EF4444" />} label="Calo nạp" value={`${Math.round(report.avgCaloriesIn)}`} unit="kcal/ngày" />
                            <StatCard icon={<TrendingUp size={20} color="#F59E0B" />} label="Calo đốt" value={`${Math.round(report.avgCaloriesOut)}`} unit="kcal/ngày" />
                            <StatCard icon={<Footprints size={20} color="#3B82F6" />} label="Bước chân" value={`${Math.round(report.avgSteps)}`} unit="bước/ngày" />
                            <StatCard icon={<Heart size={20} color="#EC4899" />} label="Cân bằng calo" value={`${report.calorieBalance > 0 ? '+' : ''}${Math.round(report.calorieBalance)}`} unit="kcal" positive={report.calorieBalance <= 0} />
                        </View>

                        {/* Body Stats */}
                        {(report.weightKg || report.bmiValue) && (
                            <View style={tw`bg-white rounded-2xl p-4 mb-4 border border-gray-100`}>
                                <Text style={tw`text-brandDark font-bold text-base mb-3`}>Chỉ số cơ thể</Text>
                                {report.weightKg && (
                                    <View style={tw`flex-row justify-between mb-2`}>
                                        <Text style={tw`text-textSub`}>Cân nặng:</Text>
                                        <Text style={tw`text-brandDark font-semibold`}>{report.weightKg} kg</Text>
                                    </View>
                                )}
                                {report.bmiValue && (
                                    <View style={tw`flex-row justify-between mb-2`}>
                                        <Text style={tw`text-textSub`}>BMI:</Text>
                                        <Text style={tw`text-brandDark font-semibold`}>{report.bmiValue} ({report.bmiStatus})</Text>
                                    </View>
                                )}
                                {report.healthGoal && (
                                    <View style={tw`flex-row justify-between`}>
                                        <Text style={tw`text-textSub`}>Mục tiêu:</Text>
                                        <Text style={tw`text-primary font-semibold`}>{report.healthGoal}</Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Meals & Exercises Summary */}
                        <View style={tw`flex-row mb-4`}>
                            <View style={tw`flex-1 bg-green-50 rounded-2xl p-4 mr-2 border border-green-100`}>
                                <UtensilsCrossed size={20} color="#7FB069" />
                                <Text style={tw`text-brandDark font-bold text-2xl mt-2`}>{report.totalMeals}</Text>
                                <Text style={tw`text-textSub text-xs`}>Bữa ăn</Text>
                            </View>
                            <View style={tw`flex-1 bg-blue-50 rounded-2xl p-4 ml-2 border border-blue-100`}>
                                <Dumbbell size={20} color="#3B82F6" />
                                <Text style={tw`text-brandDark font-bold text-2xl mt-2`}>{report.totalExercises}</Text>
                                <Text style={tw`text-textSub text-xs`}>Bài tập</Text>
                            </View>
                        </View>

                        {/* Health Tips */}
                        {report.healthTips && report.healthTips.length > 0 && (
                            <View style={tw`bg-yellow-50 rounded-2xl p-4 mb-4 border border-yellow-100`}>
                                <View style={tw`flex-row items-center mb-3`}>
                                    <Lightbulb size={20} color="#F59E0B" />
                                    <Text style={tw`text-brandDark font-bold text-base ml-2`}>Lời khuyên</Text>
                                </View>
                                {report.healthTips.map((tip, index) => (
                                    <View key={index} style={tw`flex-row mb-2`}>
                                        <Text style={tw`text-yellow-700 mr-2`}>•</Text>
                                        <Text style={tw`text-yellow-800 text-sm flex-1`}>{tip}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Daily Details (Full Report Only) */}
                        {report.dailyDetails && report.dailyDetails.length > 0 && (
                            <View style={tw`bg-white rounded-2xl p-4 border border-gray-100`}>
                                <Text style={tw`text-brandDark font-bold text-base mb-3`}>Chi tiết hàng ngày</Text>
                                {report.dailyDetails.map((day, index) => (
                                    <View key={index} style={tw`flex-row justify-between py-2 border-b border-gray-50`}>
                                        <Text style={tw`text-textSub text-xs w-20`}>{day.date}</Text>
                                        <Text style={tw`text-green-600 text-xs`}>{day.caloriesIn}kcal</Text>
                                        <Text style={tw`text-red-500 text-xs`}>-{day.caloriesOut}kcal</Text>
                                        <Text style={tw`text-blue-500 text-xs`}>{day.steps}b</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </ScrollView>
            ) : (
                <View style={tw`flex-1 items-center justify-center px-6`}>
                    <Text style={tw`text-textSub text-center`}>
                        Chưa có dữ liệu báo cáo. Hãy ghi nhận hoạt động hàng ngày!
                    </Text>
                </View>
            )}
        </View>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    unit: string;
    positive?: boolean;
}

const StatCard = ({ icon, label, value, unit, positive }: StatCardProps) => (
    <View style={tw`bg-white rounded-2xl p-4 mb-3 border border-gray-100`} >
        <View style={{ width: '47%' }}>
            {icon}
            <Text style={tw`text-brandDark font-bold text-xl mt-2`}>{value}</Text>
            <Text style={tw`text-textSub text-xs`}>{label}</Text>
            <Text style={tw`text-textSub text-[10px]`}>{unit}</Text>
        </View>
    </View>
);

export default HealthReportScreen;
