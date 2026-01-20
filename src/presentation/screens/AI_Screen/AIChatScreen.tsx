// src/presentation/screens/AI_Screen/AIChatScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
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
import {
  Send,
  Bot,
  ChevronLeft,
  MoreVertical,
  Heart,
  Mic,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getChatSessionUseCase,
  sendChatMessageUseCase,
  getSuggestedQuestionsUseCase,
} from '../../../di/Container';
import { ChatMessage, SuggestedQuestion } from '../../../domain/entities/Chat';

const AIChatScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { sessionId } = route.params || {};
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadChatSession();
    loadSuggestedQuestions();
  }, [sessionId]);

  useEffect(() => {
    // Auto scroll to bottom when new message arrives
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const loadChatSession = async () => {
    try {
      const session = await getChatSessionUseCase.execute();
      setMessages(session.messages);
    } catch (error) {
      console.error('Error loading chat session:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestedQuestions = async () => {
    try {
      const questions = await getSuggestedQuestionsUseCase.execute();
      setSuggestedQuestions(questions);
    } catch (error) {
      console.error('Error loading suggested questions:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      content: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponse = await sendChatMessageUseCase.execute(userMessage.content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = async (question: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      content: question,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const aiResponse = await sendChatMessageUseCase.execute(question);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
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

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';
    
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
            style={tw`px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-primary rounded-tr-none'
                : 'bg-primaryLight rounded-tl-none'
            }`}
          >
            <Text
              style={tw`text-sm leading-5 ${
                isUser ? 'text-white' : 'text-brandDark'
              }`}
            >
              {item.content}
            </Text>
            <Text
              style={tw`text-[10px] mt-1 ${
                isUser ? 'text-white/70' : 'text-textSub'
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

      {/* Suggested Questions */}
      {suggestedQuestions.length > 0 && messages.length <= 1 && (
        <View style={tw`px-6 pb-2`}>
          <Text style={tw`text-textSub text-xs mb-2`}>Câu hỏi gợi ý:</Text>
          <View style={tw`flex-row flex-wrap`}>
            {suggestedQuestions.map((question) => (
              <TouchableOpacity
                key={question.id}
                onPress={() => handleSuggestedQuestion(question.text)}
                style={tw`bg-primaryLight px-4 py-2 rounded-full mr-2 mb-2`}
              >
                <Text style={tw`text-primary font-semibold text-xs`}>
                  {question.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Input Bar */}
      <View style={tw`bg-white border-t border-gray-100 px-6 py-4`}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`flex-1 bg-gray-50 rounded-2xl px-4 py-3 mr-3 flex-row items-center`}>
            <TextInput
              placeholder="Hỏi Lành AI bất cứ điều gì về sức khỏe của..."
              placeholderTextColor="#9CA3AF"
              style={tw`flex-1 text-brandDark text-sm`}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={tw`ml-2`}>
              <Mic size={20} color="#7FB069" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            style={tw`w-12 h-12 bg-primary rounded-full items-center justify-center ${
              !inputText.trim() || isTyping ? 'opacity-50' : ''
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
