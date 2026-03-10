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
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,

} from 'react-native';
import tw from '../../../utils/tailwind';
import { X, Image as ImageIcon, Smile, Info, Check, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { useUserStore } from '../../viewmodels/useUserStore';
import { useForumStore } from '../../viewmodels/useForumStore';
import { useTheme } from '../../../contexts/ThemeContext';
import Toast from 'react-native-toast-message';

const MAX_IMAGES = 5;

const CreatePostScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useUserStore();
  const { createPost, isPublishing } = useForumStore();
  const { colors } = useTheme();

  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<Asset[]>([]);

  const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.fullName || 'User',
  )}&background=7FB069&color=fff&bold=true`;

  const onSelectImage = async () => {
    if (selectedImages.length >= MAX_IMAGES) {
      Toast.show({
        type: 'info',
        text1: 'Giới hạn hình ảnh',
        text2: `Bạn chỉ có thể chọn tối đa ${MAX_IMAGES} ảnh cho mỗi bài viết.`,
      });
      return;
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: MAX_IMAGES - selectedImages.length,
      quality: 0.8,
    });

    if (result.assets) {
      setSelectedImages([...selectedImages, ...result.assets]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!content.trim() && selectedImages.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Nội dung trống',
        text2: 'Hãy nhập nội dung hoặc chọn ít nhất một hình ảnh.',
      });
      return;
    }

    try {
      // Gọi hành động đăng bài từ Store
      await createPost(content, selectedImages);

      Toast.show({
        type: 'success',
        text1: 'Đăng bài thành công',
        text2: 'Bài viết của bạn đã được chia sẻ đến cộng đồng.',
      });
      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi đăng bài',
        text2: err.message || 'Không thể gửi bài viết lúc này.',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[tw`flex-1`, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.statusBarBackground}
      />

      {/* Header Section */}
      <View
        style={[
          tw`pt-14 pb-4 px-6 border-b shadow-sm z-10 flex-row items-center justify-between`,
          { backgroundColor: colors.background, borderBottomColor: colors.border }
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2 -ml-2`}
        >
          <X size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[tw`text-lg font-black`, { color: colors.text }]}>Tạo bài viết</Text>

        <TouchableOpacity
          onPress={handlePublish}
          disabled={
            isPublishing || (!content.trim() && selectedImages.length === 0)
          }
          style={[
            tw`px-6 py-2.5 rounded-full flex-row items-center`,
            { backgroundColor: colors.primary },
            (isPublishing || (!content.trim() && selectedImages.length === 0)) && tw`opacity-40`
          ]}
        >
          {isPublishing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={tw`text-white font-bold mr-1`}>Đăng</Text>
              <Check size={16} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={tw`flex-1 px-6 pt-6`}
      >
        {/* User Info */}
        <View style={tw`flex-row items-center mb-6`}>
          <Image
            source={{ uri: userAvatar }}
            style={[
              tw`w-12 h-12 rounded-full border-2`,
              { borderColor: `${colors.primary}30` }
            ]}
          />
          <View style={tw`ml-3`}>
            <Text style={[tw`font-bold text-base`, { color: colors.text }]}>
              {user?.fullName || 'Thành viên Lành Care'}
            </Text>
            <View
              style={[
                tw`px-2 py-0.5 rounded-md self-start mt-1`,
                { backgroundColor: `${colors.primary}20` }
              ]}
            >
              <Text
                style={[
                  tw`text-[10px] font-black uppercase tracking-wider`,
                  { color: colors.primary }
                ]}
              >
                Công khai
              </Text>
            </View>
          </View>
        </View>

        {/* Input Area */}
        <TextInput
          placeholder="Bạn muốn chia sẻ điều gì về sức khỏe?"
          placeholderTextColor={colors.textSecondary}
          style={[
            tw`text-lg min-h-[180px] leading-7`,
            { color: colors.text }
          ]}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          autoFocus={true}
        />

        {/* Selected Images Gallery */}
        {selectedImages.length > 0 && (
          <View style={tw`mb-10`}>
            <View style={tw`flex-row justify-between items-end mb-3`}>
              <Text style={[tw`text-xs font-bold`, { color: colors.textSecondary }]}>
                HÌNH ẢNH ({selectedImages.length}/{MAX_IMAGES})
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={tw`flex-row`}
            >
              {selectedImages.map((img, index) => (
                <View key={index} style={tw`relative mr-4`}>
                  <Image
                    source={{ uri: img.uri }}
                    style={[
                      tw`w-40 h-52 rounded-2xl`,
                      { backgroundColor: colors.surface }
                    ]}
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    style={tw`absolute top-2 right-2 bg-black/60 rounded-full p-1.5 border border-white/20`}
                  >
                    <X size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
              {selectedImages.length < MAX_IMAGES && (
                <TouchableOpacity
                  onPress={onSelectImage}
                  style={[
                    tw`w-40 h-52 rounded-2xl border-2 border-dashed items-center justify-center mr-4`,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.surface
                    }
                  ]}
                >
                  <Plus size={30} color={colors.textSecondary} />
                  <Text style={[tw`font-bold text-xs mt-2`, { color: colors.textSecondary }]}>
                    THÊM TIẾP
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Action Bar */}
      <View
        style={[
          tw`px-6 py-4 border-t flex-row justify-around mb-4`,
          {
            borderTopColor: colors.border,
            backgroundColor: colors.background
          }
        ]}
      >
        <TouchableOpacity
          onPress={onSelectImage}
          style={[
            tw`flex-row items-center px-5 py-3 rounded-2xl border`,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border
            }
          ]}
        >
          <ImageIcon size={20} color={colors.primary} />
          <Text style={[tw`font-bold text-sm ml-2`, { color: colors.primary }]}>Ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            tw`flex-row items-center px-5 py-3 rounded-2xl border`,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border
            }
          ]}
        >
          <Smile size={20} color={colors.primary} />
          <Text style={[tw`font-bold text-sm ml-2`, { color: colors.primary }]}>Cảm xúc</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            tw`p-3 rounded-2xl border`,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border
            }
          ]}
        >
          <Info size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Publishing Overlay */}
      {isPublishing && (
        <View
          style={[
            tw`absolute inset-0 items-center justify-center z-50`,
            { backgroundColor: `${colors.background}CC` }
          ]}
        >
          <View
            style={[
              tw`p-8 rounded-3xl shadow-xl border items-center`,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border
              }
            ]}
          >
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[tw`font-black mt-4`, { color: colors.text }]}>
              Đang đăng bài...
            </Text>
            <Text style={[
              tw`text-xs mt-1 text-center`,
              { color: colors.textSecondary }
            ]}>
              Vui lòng không tắt ứng dụng
            </Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default CreatePostScreen;