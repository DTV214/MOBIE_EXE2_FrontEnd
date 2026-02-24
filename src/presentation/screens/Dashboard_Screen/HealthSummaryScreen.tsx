// src/presentation/screens/Dashboard_Screen/HealthSummaryScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  ChevronLeft,
  Bell,
  Moon,
  Activity,
  Apple,
  Utensils,
  Timer,
  Bot,
  MessageCircle,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getHealthSummaryUseCase } from '../../../di/Container';
import { HealthSummary } from '../../../domain/entities/HealthSummary';

const HealthSummaryScreen = () => {
  const navigation = useNavigation<any>();
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getHealthSummaryUseCase.execute();
      setSummary(data);
    } catch (error) {
      console.error('Error loading health summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) {
    return (
      <View style={tw`flex-1 bg-background items-center justify-center`}>
        <Text style={tw`text-textSub`}>Đang tải...</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return '#7FB069';
      case 'okay':
        return '#F59E0B';
      default:
        return '#EF4444';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good':
        return 'Tốt';
      case 'okay':
        return 'Ổn';
      default:
        return 'Cần cải thiện';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition':
        return Utensils;
      case 'activity':
        return Activity;
      case 'rest':
        return Timer;
      default:
        return Utensils;
    }
  };

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <LinearGradient
        colors={['#7FB069', '#6A9A5A']}
        style={tw`pt-14 pb-4 px-6`}
      >
        <View style={tw`flex-row items-center justify-between mb-2`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`p-2`}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={tw`flex-1 px-4`}>
            <Text style={tw`text-white font-bold text-lg text-center`}>
              Tóm tắt sức khỏe của bạn
            </Text>
            <Text style={tw`text-white/80 text-xs text-center mt-1`}>
              Phân tích dành riêng cho hôm nay
            </Text>
          </View>
          <TouchableOpacity style={tw`p-2`}>
            <Bell size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
        <View style={tw`px-6 pt-6`}>
          {/* Daily Progress Card */}
          <View style={tw`bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100`}>
            <View style={tw`flex-row items-center mb-4`}>
              <View style={tw`w-14 h-14 bg-purple-100 rounded-xl items-center justify-center mr-4`}>
                <Bot size={28} color="#8B5CF6" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-brandDark font-bold text-lg`}>
                  Tiến độ hàng ngày
                </Text>
                <Text style={tw`text-textSub text-sm`}>
                  {summary.overallMessage || 'Bạn đang rất tuyệt!'}
                </Text>
              </View>
            </View>

            <View style={tw`items-center my-6`}>
              <Text style={tw`text-5xl font-black text-primary mb-2`}>
                {summary.dailyProgress.overallPercentage}%
              </Text>
              <Text style={tw`text-textSub text-sm mb-4`}>Đã hoàn thành</Text>

              {/* Progress Bar */}
              <View style={tw`w-full h-4 bg-gray-100 rounded-full overflow-hidden`}>
                <View
                  style={[
                    tw`h-full bg-primary rounded-full`,
                    {
                      width: `${summary.dailyProgress.overallPercentage}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <Text style={tw`text-textSub text-sm text-center`}>
              Bạn đã hoàn thành {summary.dailyProgress.overallPercentage}% mục tiêu sức khỏe
              hàng ngày của mình
            </Text>
          </View>

          {/* Recommendations */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-brandDark font-bold text-lg mb-4`}>
              Lời khuyên hôm nay
            </Text>
            {summary.recommendations.map((rec) => (
              <TouchableOpacity
                key={rec.id}
                style={tw`bg-white rounded-2xl p-4 mb-3 flex-row items-center justify-between shadow-sm border border-gray-100`}
                activeOpacity={0.8}
              >
                <View style={tw`flex-row items-center flex-1`}>
                  <View
                    style={tw`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
                      rec.type === 'sleep'
                        ? 'bg-purple-50'
                        : rec.type === 'nutrition'
                        ? 'bg-orange-50'
                        : 'bg-green-50'
                    }`}
                  >
                    {rec.type === 'sleep' ? (
                      <Moon size={24} color="#8B5CF6" />
                    ) : rec.type === 'nutrition' ? (
                      <Apple size={24} color="#F97316" />
                    ) : (
                      <Activity size={24} color="#7FB069" />
                    )}
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-brandDark font-semibold text-sm mb-1`}>
                      {rec.title}
                    </Text>
                    <Text style={tw`text-textSub text-xs`}>{rec.description}</Text>
                  </View>
                </View>
                {rec.emoji && (
                  <Text style={tw`text-2xl mr-2`}>{rec.emoji}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Today's Insights */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-brandDark font-bold text-lg mb-4`}>
              Những hiểu biết sâu sắc ngày nay
            </Text>
            {summary.insights.map((insight) => {
              const IconComponent = getCategoryIcon(insight.category);
              return (
                <View
                  key={insight.category}
                  style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100`}
                >
                  <View style={tw`flex-row items-start mb-4`}>
                    <View
                      style={tw`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
                        insight.category === 'nutrition'
                          ? 'bg-orange-50'
                          : insight.category === 'activity'
                          ? 'bg-blue-50'
                          : 'bg-purple-50'
                      }`}
                    >
                      <IconComponent
                        size={24}
                        color={
                          insight.category === 'nutrition'
                            ? '#F97316'
                            : insight.category === 'activity'
                            ? '#3B82F6'
                            : '#8B5CF6'
                        }
                      />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-brandDark font-bold text-base mb-1`}>
                        {insight.title}
                      </Text>
                      <Text style={tw`text-textSub text-xs`}>{insight.subtitle}</Text>
                    </View>
                    <View
                      style={[
                        tw`px-3 py-1 rounded-full`,
                        {
                          backgroundColor: `${getStatusColor(insight.status)}20`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          tw`font-semibold text-xs`,
                          { color: getStatusColor(insight.status) },
                        ]}
                      >
                        {getStatusText(insight.status)}
                      </Text>
                    </View>
                  </View>

                  {insight.emoji && (
                    <Text style={tw`text-xl mb-3`}>{insight.emoji}</Text>
                  )}

                  <View style={tw`flex-row flex-wrap`}>
                    {insight.metrics.map((metric, index) => (
                      <View
                        key={index}
                        style={tw`bg-gray-50 rounded-xl px-3 py-2 mr-2 mb-2`}
                      >
                        <Text style={tw`text-brandDark font-semibold text-sm`}>
                          {metric.value}
                        </Text>
                        <Text style={tw`text-textSub text-xs`}>{metric.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Chat with AI Coach Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('AIChat')}
            activeOpacity={0.9}
            style={tw`mb-6`}
          >
            <LinearGradient
              colors={['#3B82F6', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={tw`h-16 rounded-2xl flex-row items-center justify-center shadow-lg px-6`}
            >
              <MessageCircle size={24} color="#FFFFFF" />
              <Text style={tw`text-white font-bold text-lg ml-3`}>
                Trò chuyện với AI Coach
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={tw`text-textSub text-xs text-center mb-6`}>
            Nhận lời khuyên và câu trả lời cá nhân cho các câu hỏi về sức khỏe của bạn
          </Text>

          {/* Bottom spacing */}
          <View style={tw`h-6`} />
        </View>
      </ScrollView>
    </View>
  );
};

export default HealthSummaryScreen;
