// src/presentation/screens/Forum_Screen/CreatePostScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  ChevronLeft,
  X,
  Image as ImageIcon,
  Hash,
  Send,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createPostUseCase, getSuggestedTopicsUseCase } from '../../../di/Container';
import { Topic, UserProfile } from '../../../domain/entities/Post';

const CreatePostScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { type } = route.params || {};

  const [content, setContent] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [suggestedTopics, setSuggestedTopics] = useState<Topic[]>([]);
  const [media, setMedia] = useState<string[]>([]);

  React.useEffect(() => {
    loadSuggestedTopics();
  }, []);

  const loadSuggestedTopics = async () => {
    try {
      const topics = await getSuggestedTopicsUseCase.execute();
      setSuggestedTopics(topics);
    } catch (error) {
      console.error('Error loading topics:', error);
    }
  };

  const toggleHashtag = (hashtag: string) => {
    if (selectedHashtags.includes(hashtag)) {
      setSelectedHashtags(selectedHashtags.filter(tag => tag !== hashtag));
    } else {
      setSelectedHashtags([...selectedHashtags, hashtag]);
    }
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      // Show error
      return;
    }

    try {
      // Mock current user
      const currentUser: UserProfile = {
        id: 'current-user',
        name: 'Bạn',
        role: 'user',
      };

      await createPostUseCase.execute({
        author: currentUser,
        content,
        hashtags: selectedHashtags,
        media: media.map(url => ({ type: 'image' as const, url })),
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={tw`bg-white pt-14 pb-4 px-6 border-b border-gray-100 flex-row items-center justify-between`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-brandDark`}>Tạo bài viết</Text>
        <TouchableOpacity
          onPress={handlePublish}
          disabled={!content.trim()}
        >
          <Text
            style={tw`font-semibold ${
              content.trim() ? 'text-primary' : 'text-gray-300'
            }`}
          >
            Đăng
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
        <View style={tw`px-6 py-4`}>
          {/* User Info */}
          <View style={tw`flex-row items-center mb-4`}>
            <View style={tw`w-10 h-10 bg-gray-200 rounded-full mr-3`} />
            <Text style={tw`text-brandDark font-semibold`}>Bạn</Text>
          </View>

          {/* Content Input */}
          <TextInput
            placeholder="Bạn muốn chia sẻ điều gì về sức khỏe?"
            placeholderTextColor="#9CA3AF"
            style={tw`text-brandDark text-base min-h-[200px]`}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            autoCorrect={false}
            autoCapitalize="sentences"
            underlineColorAndroid="transparent"
            allowFontScaling={false}
          />

          {/* Media Preview */}
          {media.length > 0 && (
            <View style={tw`flex-row flex-wrap mb-4`}>
              {media.map((url, index) => (
                <View key={index} style={tw`relative mr-2 mb-2`}>
                  <View style={tw`w-24 h-24 bg-gray-200 rounded-xl`} />
                  <TouchableOpacity
                    onPress={() => setMedia(media.filter((_, i) => i !== index))}
                    style={tw`absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center`}
                  >
                    <X size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Suggested Hashtags */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-brandDark font-bold text-base mb-3`}>
              Gợi ý chủ đề
            </Text>
            <View style={tw`flex-row flex-wrap`}>
              {suggestedTopics.map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  onPress={() => toggleHashtag(topic.hashtag)}
                  style={tw`px-4 py-2 rounded-full mr-2 mb-2 ${
                    selectedHashtags.includes(topic.hashtag)
                      ? 'bg-primary'
                      : 'bg-primary/10'
                  }`}
                >
                  <Text
                    style={tw`font-semibold text-sm ${
                      selectedHashtags.includes(topic.hashtag)
                        ? 'text-white'
                        : 'text-primary'
                    }`}
                  >
                    {topic.hashtag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={tw`flex-row justify-between`}>
            <TouchableOpacity
              style={tw`flex-row items-center bg-gray-50 px-4 py-3 rounded-xl`}
            >
              <ImageIcon size={20} color="#7FB069" />
              <Text style={tw`text-primary font-semibold text-sm ml-2`}>
                Thêm hình ảnh
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-row items-center bg-gray-50 px-4 py-3 rounded-xl`}
            >
              <Hash size={20} color="#7FB069" />
              <Text style={tw`text-primary font-semibold text-sm ml-2`}>
                Thêm hashtag
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreatePostScreen;
