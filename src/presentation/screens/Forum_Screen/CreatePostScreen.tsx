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
import Toast from 'react-native-toast-message';

const MAX_IMAGES = 5;

const CreatePostScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useUserStore();
  const { createPost, isPublishing } = useForumStore();

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
      style={tw`flex-1 bg-white`}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Section */}
      <View
        style={tw`bg-white pt-14 pb-4 px-6 border-b border-gray-50 flex-row items-center justify-between shadow-sm z-10`}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2 -ml-2`}
        >
          <X size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text style={tw`text-lg font-black text-brandDark`}>Tạo bài viết</Text>

        <TouchableOpacity
          onPress={handlePublish}
          disabled={
            isPublishing || (!content.trim() && selectedImages.length === 0)
          }
          style={tw`bg-[#7FB069] px-6 py-2.5 rounded-full flex-row items-center ${
            isPublishing || (!content.trim() && selectedImages.length === 0)
              ? 'opacity-40'
              : ''
          }`}
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
            style={tw`w-12 h-12 rounded-full border-2 border-[#7FB069]/20`}
          />
          <View style={tw`ml-3`}>
            <Text style={tw`text-brandDark font-bold text-base`}>
              {user?.fullName || 'Thành viên Lành Care'}
            </Text>
            <View
              style={tw`bg-[#7FB069]/10 px-2 py-0.5 rounded-md self-start mt-1`}
            >
              <Text
                style={tw`text-[10px] text-[#7FB069] font-black uppercase tracking-wider`}
              >
                Công khai
              </Text>
            </View>
          </View>
        </View>

        {/* Input Area */}
        <TextInput
          placeholder="Bạn muốn chia sẻ điều gì về sức khỏe?"
          placeholderTextColor="#9CA3AF"
          style={tw`text-brandDark text-lg min-h-[180px] leading-7`}
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
              <Text style={tw`text-gray-400 text-xs font-bold`}>
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
                    style={tw`w-40 h-52 rounded-2xl bg-gray-100`}
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
                  style={tw`w-40 h-52 rounded-2xl border-2 border-dashed border-gray-200 items-center justify-center bg-gray-50 mr-4`}
                >
                  <Plus size={30} color="#9CA3AF" />
                  <Text style={tw`text-gray-400 font-bold text-xs mt-2`}>
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
        style={tw`px-6 py-4 border-t border-gray-50 flex-row justify-around bg-white mb-4`}
      >
        <TouchableOpacity
          onPress={onSelectImage}
          style={tw`flex-row items-center bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100`}
        >
          <ImageIcon size={20} color="#7FB069" />
          <Text style={tw`text-[#7FB069] font-bold text-sm ml-2`}>Ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-row items-center bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100`}
        >
          <Smile size={20} color="#7FB069" />
          <Text style={tw`text-[#7FB069] font-bold text-sm ml-2`}>Cảm xúc</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`p-3 bg-gray-50 rounded-2xl border border-gray-100`}
        >
          <Info size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Publishing Overlay */}
      {isPublishing && (
        <View
          style={tw`absolute inset-0 bg-white/80 items-center justify-center z-50`}
        >
          <View
            style={tw`bg-white p-8 rounded-3xl shadow-xl border border-gray-100 items-center`}
          >
            <ActivityIndicator size="large" color="#7FB069" />
            <Text style={tw`text-brandDark font-black mt-4`}>
              Đang đăng bài...
            </Text>
            <Text style={tw`text-gray-400 text-xs mt-1 text-center`}>
              Vui lòng không tắt ứng dụng
            </Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default CreatePostScreen;
