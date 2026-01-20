// src/presentation/components/StickyHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import tw from '../../utils/tailwind';
import { Heart, Bell, MessageCircle, Search } from 'lucide-react-native';

interface StickyHeaderProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onNotificationPress?: () => void;
  onMessagePress?: () => void;
  onProfilePress?: () => void;
}

const StickyHeader = ({
  showSearch = false,
  searchPlaceholder = 'Tìm kiếm...',
  searchValue = '',
  onSearchChange,
  onNotificationPress,
  onMessagePress,
  onProfilePress,
}: StickyHeaderProps) => {
  return (
    <View style={tw`bg-white pt-14 pb-4 px-6 border-b border-gray-100`}>
      {/* Logo và Actions */}
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`w-8 h-8 bg-primary rounded-full items-center justify-center mr-2`}>
            <Heart size={16} color="#FFFFFF" />
          </View>
          <Text style={tw`text-xl font-bold text-brandDark`}>HealthyLife</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity style={tw`p-2 mr-2`} onPress={onNotificationPress}>
            <Bell size={22} color="#1F2937" />
            <View style={tw`absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full`} />
          </TouchableOpacity>
          <TouchableOpacity style={tw`p-2 mr-2`} onPress={onMessagePress}>
            <MessageCircle size={22} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onProfilePress}>
            <View style={tw`w-8 h-8 bg-gray-200 rounded-full`} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {showSearch && (
        <View style={tw`bg-gray-50 rounded-xl px-4 py-3 flex-row items-center`}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder={searchPlaceholder}
            placeholderTextColor="#9CA3AF"
            style={tw`flex-1 ml-3 text-brandDark`}
            value={searchValue}
            onChangeText={onSearchChange}
          />
        </View>
      )}
    </View>
  );
};

export default StickyHeader;
