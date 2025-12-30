import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  Send,
  Bot,
  User,
  ChevronLeft,
  MoreVertical,
  Sparkles,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

// Dữ liệu mẫu cho cuộc hội thoại
const MOCK_MESSAGES = [
  {
    id: '1',
    text: 'Xin chào Sarah! Tôi là Lành AI, trợ lý sức khỏe của bạn. Hôm nay bạn cảm thấy thế nào?',
    sender: 'ai',
    time: '10:00 AM',
  },
  {
    id: '2',
    text: 'Tôi hơi đau đầu và thấy mệt mỏi từ sáng nay.',
    sender: 'user',
    time: '10:01 AM',
  },
  {
    id: '3',
    text: 'Tôi rất tiếc khi nghe điều đó. Đau đầu có thể do nhiều nguyên nhân như thiếu ngủ, căng thẳng hoặc thiếu nước. Bạn đã ngủ đủ 7-8 tiếng tối qua chứ?',
    sender: 'ai',
    time: '10:02 AM',
  },
];

const AIChatScreen = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');

  const renderItem = ({ item }: any) => (
    <View
      style={tw`mb-4 ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
    >
      <View
        style={tw`flex-row ${
          item.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
        } items-end`}
      >
        {/* Avatar nhỏ bên cạnh tin nhắn */}
        <View
          style={tw`w-8 h-8 rounded-full items-center justify-center ${
            item.sender === 'ai' ? 'bg-primaryLight' : 'bg-gray-200'
          } mb-1`}
        >
          {item.sender === 'ai' ? (
            <Bot size={16} color="#22C55E" />
          ) : (
            <User size={16} color="#6B7280" />
          )}
        </View>

        <View
          style={[
            tw`max-w-[75%] px-4 py-3 mx-2 rounded-2xl`,
            item.sender === 'user'
              ? tw`bg-primary rounded-tr-none`
              : tw`bg-white border border-gray-100 rounded-tl-none`,
          ]}
        >
          <Text
            style={tw`${
              item.sender === 'user' ? 'text-white' : 'text-gray-800'
            } text-sm leading-5`}
          >
            {item.text}
          </Text>
          <Text
            style={tw`text-[10px] mt-1 ${
              item.sender === 'user' ? 'text-white/70' : 'text-gray-400'
            }`}
          >
            {item.time}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Header Chuyên nghiệp */}
      <View
        style={tw`pt-12 pb-4 px-6 bg-white flex-row justify-between items-center shadow-sm`}
      >
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mr-3`}
          >
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={tw`relative`}>
            <View style={tw`bg-primaryLight p-2 rounded-full`}>
              <Bot size={24} color="#22C55E" />
            </View>
            <View
              style={tw`absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full`}
            />
          </View>
          <View style={tw`ml-3`}>
            <Text style={tw`text-base font-bold text-gray-800`}>
              Trợ lý Lành AI
            </Text>
            <Text style={tw`text-[10px] text-green-600 font-medium`}>
              Đang hoạt động
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <MoreVertical size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Danh sách tin nhắn */}
      <FlatList
        data={MOCK_MESSAGES}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={tw`p-6`}
        showsVerticalScrollIndicator={false}
      />

      {/* Gợi ý nhanh (Quick Actions) */}
      <View style={tw`px-6 pb-2`}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={tw`bg-white border border-primaryLight px-4 py-2 rounded-full mr-2`}
          >
            <Text style={tw`text-primary text-xs font-medium`}>
              Cách tính BMI của tôi?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-white border border-primaryLight px-4 py-2 rounded-full mr-2`}
          >
            <Text style={tw`text-primary text-xs font-medium`}>
              Gợi ý thực đơn giảm cân
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Thanh nhập liệu (Input Bar) */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View
          style={tw`px-6 py-4 bg-white border-t border-gray-100 flex-row items-center`}
        >
          <TouchableOpacity style={tw`mr-3`}>
            <Sparkles size={20} color="#22C55E" />
          </TouchableOpacity>
          <View style={tw`flex-1 bg-gray-100 rounded-2xl px-4 py-2 mr-3`}>
            <TextInput
              placeholder="Nhập câu hỏi của bạn..."
              placeholderTextColor="#9CA3AF"
              style={tw`text-sm text-gray-800 h-10`}
              value={message}
              onChangeText={setMessage}
            />
          </View>
          <TouchableOpacity
            style={tw`${
              message ? 'bg-primary' : 'bg-gray-200'
            } p-3 rounded-full`}
            disabled={!message}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AIChatScreen;
