import React from 'react';
import { View, Text } from 'react-native';
import tw from '../../utils/tailwind';

interface Props {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor?: string; // Màu icon nền
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  accentColor = 'bg-blue-100',
}: Props) => {
  return (
    <View
      style={tw`bg-white p-4 rounded-3xl mb-4 flex-row items-center shadow-sm`}
    >
      <View style={tw`${accentColor} p-4 rounded-2xl mr-4`}>{icon}</View>
      <View>
        <Text style={tw`text-gray-500 text-sm font-medium`}>{title}</Text>
        <Text style={tw`text-gray-900 text-xl font-bold mt-1`}>{value}</Text>
        <Text style={tw`text-gray-400 text-xs mt-1`}>{subtitle}</Text>
      </View>
    </View>
  );
};
