// src/presentation/screens/Onboarding_Screen/OnboardingScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Image,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { Heart, Brain, Apple, ArrowRight, Leaf } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { completeOnboardingUseCase } from '../../../di/Container';

const { width, height } = Dimensions.get('window');

// Data giả cho onboarding slides - sau này có thể lấy từ API
const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'Lành Care',
    subtitle: 'Sống khỏe mạnh, sống bình tĩnh',
    description: '',
    icon: 'leaf',
    gradientColors: ['#F5F5F0', '#FAFAF5'], // Cream to beige gradient
  },
  {
    id: '2',
    title: 'Hành trình chăm sóc sức khỏe của bạn',
    subtitle: 'Khám phá các công cụ để cải thiện sức khỏe và chánh niệm của bạn',
    features: [
      {
        icon: Heart,
        title: 'Health Tracking',
        description: 'Monitor your daily wellness metrics.',
      },
      {
        icon: Brain,
        title: 'Meditation',
        description: 'Find peace with guided sessions.',
      },
      {
        icon: Apple,
        title: 'Nutrition Tips',
        description: 'Personalized healthy eating advice.',
      },
    ],
    gradientColors: ['#FFFFFF', '#F9FAFB'],
  },
  {
    id: '3',
    title: 'Sẵn sàng bắt đầu chưa?',
    subtitle: 'Tham gia cùng hàng ngàn người trong hành trình chăm sóc sức khỏe của họ',
    description: '',
    gradientColors: ['#FFFFFF', '#F5F5F0'],
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const navigation = useNavigation<any>();

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const scrollToNext = async () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Hoàn thành onboarding và chuyển sang Login
      await completeOnboardingUseCase.execute();
      navigation.replace('Login');
    }
  };

  const skipOnboarding = async () => {
    await completeOnboardingUseCase.execute();
    navigation.replace('Login');
  };

  const renderSlide1 = () => (
    <View style={[tw`flex-1 items-center justify-center px-8`, { width }]}>
      {/* Logo với icon lá */}
      <View
        style={tw`w-24 h-24 bg-primary rounded-full items-center justify-center mb-8 shadow-lg`}
      >
        <Leaf size={48} color="#FFFFFF" />
      </View>

      {/* Title */}
      <Text style={tw`text-4xl font-black text-primary mb-3`}>Lành Care</Text>

      {/* Subtitle */}
      <Text style={tw`text-lg text-textSub text-center`}>
        Sống khỏe mạnh, sống bình tĩnh
      </Text>

      {/* Illustration placeholder - có thể thay bằng image thật */}
      <View style={tw`mt-16 w-80 h-80 bg-primaryLight/30 rounded-3xl items-center justify-center`}>
        <View style={tw`w-64 h-64 bg-primary/10 rounded-2xl items-center justify-center`}>
          <Brain size={120} color="#7FB069" opacity={0.3} />
        </View>
      </View>
    </View>
  );

  const renderSlide2 = () => (
    <View style={[tw`flex-1 px-8 pt-16`, { width }]}>
      {/* Title */}
      <Text style={tw`text-3xl font-black text-brandDark mb-2 text-center`}>
        Hành trình chăm sóc sức khỏe của bạn
      </Text>

      {/* Subtitle */}
      <Text style={tw`text-base text-textSub text-center mb-12`}>
        Khám phá các công cụ để cải thiện sức khỏe và chánh niệm của bạn
      </Text>

      {/* Features */}
      {ONBOARDING_SLIDES[1].features?.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <View
            key={index}
            style={tw`flex-row items-start mb-8 bg-white rounded-2xl p-5 shadow-sm border border-gray-100`}
          >
            <View
              style={tw`w-14 h-14 bg-primaryLight rounded-2xl items-center justify-center mr-4`}
            >
              <IconComponent size={28} color="#7FB069" />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-lg font-bold text-brandDark mb-1`}>
                {feature.title}
              </Text>
              <Text style={tw`text-sm text-textSub`}>{feature.description}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderSlide3 = () => (
    <View style={[tw`flex-1 items-center justify-center px-8`, { width }]}>
      {/* Title */}
      <Text style={tw`text-3xl font-black text-brandDark mb-4 text-center`}>
        Sẵn sàng bắt đầu chưa?
      </Text>

      {/* Subtitle */}
      <Text style={tw`text-base text-textSub text-center mb-16 px-4`}>
        Tham gia cùng hàng ngàn người trong hành trình chăm sóc sức khỏe của họ
      </Text>

      {/* Illustration placeholder - có thể thay bằng image thật */}
      <View style={tw`w-72 h-72 bg-primaryLight/20 rounded-3xl items-center justify-center mb-16`}>
        <View style={tw`flex-row flex-wrap justify-center`}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={tw`w-24 h-24 bg-primary/20 rounded-2xl m-2 items-center justify-center`}
            >
              <Heart size={40} color="#7FB069" opacity={0.5} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item, index }: any) => {
    switch (index) {
      case 0:
        return renderSlide1();
      case 1:
        return renderSlide2();
      case 2:
        return renderSlide3();
      default:
        return null;
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Skip Button */}
      {currentIndex < ONBOARDING_SLIDES.length - 1 && (
        <TouchableOpacity
          onPress={skipOnboarding}
          style={tw`absolute top-14 right-6 z-10`}
        >
          <Text style={tw`text-textSub font-semibold text-base`}>Bỏ qua</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        data={ONBOARDING_SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={viewableItemsChanged}
        ref={slidesRef}
        scrollEnabled={false} // Disable manual scroll, chỉ dùng nút
      />

      {/* Bottom Section */}
      <View style={tw`pb-12 px-8`}>
        {/* Pagination Dots */}
        <View style={tw`flex-row justify-center mb-8`}>
          {ONBOARDING_SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i.toString()}
                style={[
                  tw`h-2 bg-primary rounded-full mx-1.5`,
                  { width: dotWidth, opacity },
                ]}
              />
            );
          })}
        </View>

        {/* Next/Get Started Button */}
        <TouchableOpacity onPress={scrollToNext} activeOpacity={0.9}>
          <LinearGradient
            colors={['#7FB069', '#6A9A5A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={tw`h-16 rounded-2xl flex-row items-center justify-center shadow-lg`}
          >
            <Text
              style={tw`text-white font-bold text-lg mr-2`}
            >
              {currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Bắt đầu' : 'Tiếp'}
            </Text>
            <ArrowRight size={22} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;
