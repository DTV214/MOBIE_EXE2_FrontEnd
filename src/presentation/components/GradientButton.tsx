import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import tw from '../../utils/tailwind';
// import { TSpan } from 'react-native-svg';

interface Props {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
}

export const GradientButton = ({ title, onPress, icon }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#86EFAC', '#22C55E']} // Gradient xanh lá từ Figma
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={tw`flex-row items-center justify-center py-4 px-6 rounded-2xl shadow-sm`}
      >
        {icon && <Text style={tw`mr-2`}>{icon}</Text>}
        <Text style={tw`text-white font-bold text-base ml-2`}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
