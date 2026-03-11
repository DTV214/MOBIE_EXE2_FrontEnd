import React from 'react';
import { View, Text } from 'react-native';
import tw from '../../utils/tailwind';
import { scale, fs } from '../../utils/responsive';

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
      style={[tw`bg-white rounded-3xl mb-4 flex-row items-center shadow-sm`, { padding: scale(14) }]}
    >
      <View style={[tw`${accentColor} rounded-2xl`, { padding: scale(14), marginRight: scale(14) }]}>{icon}</View>
      <View style={tw`flex-1 flex-shrink-1`}>
        <Text style={[tw`text-gray-500 font-medium`, { fontSize: fs(13) }]}>{title}</Text>
        <Text style={[tw`text-gray-900 font-bold mt-1`, { fontSize: fs(19) }]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
        <Text style={[tw`text-gray-400 mt-1`, { fontSize: fs(11) }]}>{subtitle}</Text>
      </View>
    </View>
  );
};
