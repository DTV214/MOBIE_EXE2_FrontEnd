// src/presentation/screens/AI_Screen/AIChatListScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  Bot,
  Plus,
  Trash2,
  MessageSquare,
  MoreVertical,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { ChatSession } from '../../../domain/entities/Chat';

// Mock chat sessions list
const MOCK_CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'session-1',
    messages: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
  },
  {
    id: 'session-2',
    messages: [],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
  },
  {
    id: 'session-3',
    messages: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const AIChatListScreen = () => {
  const navigation = useNavigation<any>();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChatSessions();
  }, []);

  const loadChatSessions = async () => {
    // Simulate loading
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    setChatSessions(MOCK_CHAT_SESSIONS);
    setLoading(false);
  };

  const handleCreateChat = () => {
    // Create new chat session and navigate to chat screen
    const newSessionId = `session-${Date.now()}`;
    navigation.navigate('AIChat', { sessionId: newSessionId });
  };

  const handleDeleteChat = (sessionId: string) => {
    setChatSessions(chatSessions.filter(session => session.id !== sessionId));
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Hôm qua';
    return `${diffInDays} ngày trước`;
  };

  const getPreviewMessage = (session: ChatSession) => {
    if (session.messages.length === 0) {
      return 'Cuộc trò chuyện mới';
    }
    const lastMessage = session.messages[session.messages.length - 1];
    return lastMessage.content.substring(0, 50) + (lastMessage.content.length > 50 ? '...' : '');
  };

  const renderChatItem = ({ item }: { item: ChatSession }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AIChat', { sessionId: item.id })}
      style={tw`bg-white rounded-2xl p-4 mb-3 mx-6 border border-gray-100`}
    >
      <View style={tw`flex-row items-start`}>
        {/* AI Avatar */}
        <View style={tw`w-12 h-12 bg-primary rounded-full items-center justify-center mr-3`}>
          <Bot size={24} color="#FFFFFF" />
        </View>

        {/* Chat Info */}
        <View style={tw`flex-1`}>
          <View style={tw`flex-row justify-between items-start mb-1`}>
            <Text style={tw`text-brandDark font-bold text-base`}>
              Trợ lý sức khỏe Lành AI
            </Text>
            <TouchableOpacity
              onPress={() => handleDeleteChat(item.id)}
              style={tw`p-2`}
            >
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
          <Text style={tw`text-textSub text-sm mb-1`} numberOfLines={2}>
            {getPreviewMessage(item)}
          </Text>
          <Text style={tw`text-textSub text-xs`}>
            {formatTimeAgo(item.updatedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={tw`flex-1 bg-background items-center justify-center`}>
        <ActivityIndicator size="large" color="#7FB069" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={tw`bg-white pt-14 pb-4 px-6 border-b border-gray-100`}>
        <View style={tw`flex-row items-center justify-between`}>
          <View>
            <Text style={tw`text-xs text-primary font-bold mb-1`}>LÀNH CARE AI</Text>
            <Text style={tw`text-xl font-bold text-brandDark`}>Trợ lý sức khỏe</Text>
          </View>
          <View style={tw`w-10 h-10 bg-primary rounded-full items-center justify-center`}>
            <Bot size={20} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Chat List */}
      {chatSessions.length > 0 ? (
        <FlatList
          data={chatSessions}
          keyExtractor={item => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={tw`py-4`}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <View style={tw`w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4`}>
            <Bot size={48} color="#9CA3AF" />
          </View>
          <Text style={tw`text-brandDark font-bold text-lg mb-2 text-center`}>
            Chưa có cuộc trò chuyện nào
          </Text>
          <Text style={tw`text-textSub text-sm text-center mb-6`}>
            Bắt đầu trò chuyện với Lành AI để được tư vấn về sức khỏe
          </Text>
        </View>
      )}

      {/* Create New Chat Button */}
      <TouchableOpacity
        onPress={handleCreateChat}
        activeOpacity={0.9}
        style={tw`absolute bottom-6 right-6`}
      >
        <View style={tw`w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg`}>
          <Plus size={28} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AIChatListScreen;
