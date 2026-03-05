// src/presentation/screens/AI_Screen/AIChatScreen.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { debugAIAPI, checkAuthStatus } from '../../../utils/debugAI';
import { audioPlayer } from '../../../utils/audioPlayer';
import { playAIAudioFallback, simpleAudioPlayer } from '../../../utils/audioPlayerSimple';
import {
  Send,
  Bot,
  ChevronLeft,
  MoreVertical,
  Heart,
  Mic,
  Play,
  Square,
  Crown,
  ArrowRight
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
// Import the repository directly for AI features
import { AIChatRepositoryImpl } from '../../../data/repositories/AIChatRepositoryImpl';
import { AIChatMessage } from '../../../domain/entities/AIChat';

const AIChatScreen = () => {
  const navigation = useNavigation<any>();

  // Initialize AI repository
  const [aiRepository] = useState(() => new AIChatRepositoryImpl());

  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSpeechMode, setIsSpeechMode] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const loadChatSession = useCallback(async () => {
    try {
      // Debug: Check authentication status first
      console.log('🔍 Checking auth status before loading AI chat...');
      await checkAuthStatus();

      const session = await aiRepository.getCurrentSession();
      setMessages(session.messages || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading chat session:', error);
      setLoading(false);
    }
  }, [aiRepository]);

  useEffect(() => {
    loadChatSession();

    // Debug AI API on component mount
    debugAIAPI().then(result => {
      console.log('🔬 AI API Debug Result:', result);
    });
  }, [loadChatSession]);

  useEffect(() => {
    // Auto scroll to bottom when new message arrives
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessageContent = inputText.trim();

    // Add user message to local state
    const userMessage: AIChatMessage = {
      id: `user_${Date.now()}`,
      content: userMessageContent,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Add user message to session
      await aiRepository.addUserMessage(userMessageContent);

      // Get AI response with speech mode
      const aiMessage = await aiRepository.sendAIMessage(userMessageContent, isSpeechMode);

      setMessages(prev => [...prev, aiMessage]);

      // Auto-play audio if in speech mode and audio available
      if (isSpeechMode && aiMessage.audioBase64) {
        handlePlayAudio(aiMessage.id, aiMessage.audioBase64);
      }

    } catch (error: any) {
      console.error('Error sending message:', error);

      const rawMsg = error.message || 'Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại.';
      const isQuotaError = rawMsg.startsWith('QUOTA_EXCEEDED::');
      const displayMsg = isQuotaError ? rawMsg.replace('QUOTA_EXCEEDED::', '') : rawMsg;

      if (isQuotaError) {
        setShowUpgradePrompt(true);
      }

      // Show error message
      const errorMessage: AIChatMessage = {
        id: `error_${Date.now()}`,
        content: displayMsg,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Audio playback functions
  const handlePlayAudio = async (messageId: string, audioBase64: string) => {
    try {
      setPlayingAudioId(messageId);
      console.log('🎵 Playing audio for message:', messageId);

      // Try fallback player (file-based first, then simple)
      await playAIAudioFallback(audioBase64);

    } catch (error) {
      console.error('❌ Error playing audio:', error);

      // Show user-friendly message if audio fails
      const errorMessage = error instanceof Error ? error.message : 'Không thể phát audio';
      console.log('📢 Audio error:', errorMessage);

    } finally {
      setPlayingAudioId(null);
    }
  };

  const handleStopAudio = () => {
    // Stop both possible audio players
    try {
      audioPlayer.stop();
    } catch {
      console.log('Complex audio player not active');
    }

    try {
      simpleAudioPlayer.stop();
    } catch {
      console.log('Simple audio player not active');
    }

    setPlayingAudioId(null);
  };

  // Toggle speech mode
  const toggleSpeechMode = () => {
    setIsSpeechMode(!isSpeechMode);

    // Stop any playing audio when toggling speech mode
    if (audioPlayer.getIsPlaying() || simpleAudioPlayer.getIsPlaying()) {
      handleStopAudio();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'CH' : 'SA'; // Vietnamese format
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const renderMessage = ({ item }: { item: AIChatMessage }) => {
    const isUser = item.sender === 'user';
    const isPlayingThis = playingAudioId === item.id;

    return (
      <View
        style={tw`mb-4 ${isUser ? 'items-end' : 'items-start'}`}
      >
        <View
          style={tw`flex-row max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}
        >
          {/* AI Avatar */}
          {!isUser && (
            <View style={tw`w-8 h-8 bg-primary rounded-full items-center justify-center mr-2 mb-1`}>
              <Bot size={16} color="#FFFFFF" />
            </View>
          )}

          {/* Message Bubble */}
          <View
            style={tw`px-4 py-3 rounded-2xl ${isUser
                ? 'bg-primary rounded-tr-none'
                : 'bg-primaryLight rounded-tl-none'
              }`}
          >
            <Text
              style={tw`text-sm leading-5 ${isUser ? 'text-white' : 'text-brandDark'
                }`}
            >
              {item.content}
            </Text>

            {/* Audio Controls for AI messages with audio */}
            {!isUser && item.hasAudio && item.audioBase64 && (
              <View style={tw`flex-row items-center mt-2 pt-2 border-t border-gray-200`}>
                <TouchableOpacity
                  style={tw`flex-row items-center px-2 py-1 rounded-lg ${isPlayingThis ? 'bg-red-100' : 'bg-green-100'
                    }`}
                  onPress={() =>
                    isPlayingThis
                      ? handleStopAudio()
                      : handlePlayAudio(item.id, item.audioBase64!)
                  }
                >
                  {isPlayingThis ? (
                    <Square size={12} color="#DC2626" />
                  ) : (
                    <Play size={12} color="#059669" />
                  )}
                  <Text style={tw`text-xs ml-1 ${isPlayingThis ? 'text-red-600' : 'text-green-600'
                    }`}>
                    {isPlayingThis ? 'Dừng' : 'Phát'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <Text
              style={tw`text-[10px] mt-1 ${isUser ? 'text-white/70' : 'text-textSub'
                }`}
            >
              {formatTime(item.timestamp)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={tw`flex-1 bg-background items-center justify-center`}>
        <ActivityIndicator size="large" color="#7FB069" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-background`}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={tw`bg-primary pt-14 pb-4 px-6`}>
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center flex-1`}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={tw`mr-4`}
            >
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={tw`w-10 h-10 bg-white rounded-full items-center justify-center mr-3`}>
              <Bot size={20} color="#7FB069" />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-white font-bold text-base`}>
                Trợ lý sức khỏe Lành AI
              </Text>
              <Text style={tw`text-white/80 text-xs`}>
                Đang hoạt động
              </Text>
            </View>
          </View>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity style={tw`mr-3`}>
              <Heart size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity>
              <MoreVertical size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={tw`px-6 py-4`}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isTyping ? (
            <View style={tw`mb-4 items-start`}>
              <View style={tw`flex-row items-center`}>
                <View style={tw`w-8 h-8 bg-primary rounded-full items-center justify-center mr-2`}>
                  <Bot size={16} color="#FFFFFF" />
                </View>
                <View style={tw`bg-primaryLight px-4 py-3 rounded-2xl rounded-tl-none`}>
                  <View style={tw`flex-row`}>
                    <View style={tw`w-2 h-2 bg-primary rounded-full mr-1`} />
                    <View style={tw`w-2 h-2 bg-primary rounded-full mr-1`} />
                    <View style={tw`w-2 h-2 bg-primary rounded-full`} />
                  </View>
                </View>
              </View>
            </View>
          ) : null
        }
      />

      {/* Upgrade Prompt */}
      {showUpgradePrompt && (
        <View style={tw`bg-amber-50 border-t border-amber-200 px-6 py-4`}>
          <View style={tw`flex-row items-center mb-2`}>
            <Crown size={20} color="#F59E0B" />
            <Text style={tw`text-amber-800 font-bold text-sm ml-2 flex-1`}>
              Hết lượt chat AI hôm nay
            </Text>
            <TouchableOpacity onPress={() => setShowUpgradePrompt(false)}>
              <Text style={tw`text-amber-600 text-xs`}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={tw`text-amber-700 text-xs mb-3`}>
            Nâng cấp gói dịch vụ để chat không giới hạn và mở khóa nhiều tính năng premium!
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChoosePlan')}
            style={tw`bg-amber-500 rounded-xl py-3 flex-row items-center justify-center`}
          >
            <Crown size={16} color="#FFFFFF" />
            <Text style={tw`text-white font-bold text-sm ml-2`}>Nâng cấp gói ngay</Text>
            <ArrowRight size={16} color="#FFFFFF" style={tw`ml-1`} />
          </TouchableOpacity>
        </View>
      )}

      {/* Input Bar */}
      <View style={tw`bg-white border-t border-gray-100 px-6 py-4`}>
        {/* Speech Mode Toggle */}
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <Text style={tw`text-textSub text-sm`}>Chế độ thoại</Text>
          <TouchableOpacity
            onPress={toggleSpeechMode}
            style={tw`flex-row items-center px-3 py-1 rounded-full ${isSpeechMode ? 'bg-green-100' : 'bg-gray-100'
              }`}
          >
            <Mic size={16} color={isSpeechMode ? "#059669" : "#6B7280"} />
            <Text style={tw`text-xs ml-1 ${isSpeechMode ? 'text-green-600' : 'text-gray-600'
              }`}>
              {isSpeechMode ? 'BẬT' : 'TẮT'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={tw`flex-row items-center`}>
          <View style={tw`flex-1 bg-gray-50 rounded-2xl px-4 py-3 mr-3 flex-row items-center`}>
            <TextInput
              placeholder={
                isSpeechMode
                  ? "Gửi tin nhắn và nhận phản hồi bằng giọng nói..."
                  : "Hỏi Lành AI bất cứ điều gì về sức khỏe..."
              }
              placeholderTextColor="#9CA3AF"
              style={tw`flex-1 text-brandDark text-sm`}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              autoCorrect={false}
              autoCapitalize="sentences"
              underlineColorAndroid="transparent"
              allowFontScaling={false}
              selection={undefined}
            />
          </View>
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            style={tw`w-12 h-12 bg-primary rounded-full items-center justify-center ${!inputText.trim() || isTyping ? 'opacity-50' : ''
              }`}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AIChatScreen;
