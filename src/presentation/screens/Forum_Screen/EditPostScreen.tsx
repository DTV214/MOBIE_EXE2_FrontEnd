// src/presentation/screens/Forum_Screen/EditPostScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { ChevronLeft, X, Check, Camera } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker'; // Thư viện mới ổn định hơn
import tw from '../../../utils/tailwind';
import { useForumStore } from '../../viewmodels/useForumStore';
import { uploadMediaUseCase } from '../../../di/Container'; //
import Toast from 'react-native-toast-message';

const EditPostScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { post } = route.params; //

  // --- State quản lý dữ liệu ---
  const [content, setContent] = useState(post.content);
  // Danh sách URL "thành phẩm" sẽ gửi lên PUT
  const [dynamicMediaUrls, setDynamicMediaUrls] = useState<string[]>(
    post.mediaUrls || [],
  );

  const { updatePost, isActionLoading } = useForumStore();
  const [isUploading, setIsUploading] = useState(false);

  // 1. Logic XÓA: Loại bỏ URL trực tiếp khỏi danh sách hiển thị
  const handleRemoveUrl = (urlToRemove: string) => {
    setDynamicMediaUrls(prev => prev.filter(url => url !== urlToRemove));
  };

  // 2. Logic THÊM: Chọn ảnh -> Upload lấy URL -> Gắn vào danh sách
  const handleAddImage = async () => {
    const options: any = {
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
    };

    // BƯỚC 1: Gọi thư viện chọn ảnh mới
    const result = await launchImageLibrary(options);

    if (result.didCancel || !result.assets) return;

    const file = {
      uri: result.assets[0].uri,
      type: result.assets[0].type,
      name: result.assets[0].fileName,
    };

    // BƯỚC 2: Upload ngay lập tức để lấy URL từ Cloudinary
    setIsUploading(true);
    try {
      const newUrl = await uploadMediaUseCase.execute(file); //

      // BƯỚC 3: Gắn URL mới vào danh sách năng động
      setDynamicMediaUrls(prev => [...prev, newUrl]);
      Toast.show({ type: 'success', text1: 'Tải ảnh lên thành công' });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Không thể upload ảnh' });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // 3. Logic LƯU: Gửi lệnh PUT với danh sách URL cuối cùng
  const handleSave = async () => {
    if (!content.trim()) {
      Toast.show({ type: 'error', text1: 'Nội dung không được để trống' });
      return;
    }

    try {
      await updatePost(
        post.id,
        content,
        dynamicMediaUrls, // Gửi danh sách URL đã thêm/bớt
        post.heart, // Bảo toàn số tim
        post.accountId, // Bảo toàn ID người đăng
      );
      Toast.show({ type: 'success', text1: 'Cập nhật bài viết thành công' });
      navigation.goBack();
    } catch (error: any) {
      Toast.show({ type: 'error', text1: error.message || 'Lỗi cập nhật' });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-white`}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header Section */}
      <View
        style={tw`pt-14 pb-4 px-6 border-b border-gray-50 flex-row items-center justify-between bg-white`}
      >
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`p-2 -ml-2`}
          >
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-black text-brandDark ml-2`}>
            Sửa bài viết
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isActionLoading || isUploading}
          style={tw`bg-[#7FB069] px-6 py-2.5 rounded-full flex-row items-center shadow-sm`}
        >
          {isActionLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Text style={tw`text-white font-bold mr-2`}>Lưu</Text>
              <Check size={18} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={tw`flex-1 px-6 pt-6`}
      >
        <TextInput
          multiline
          placeholder="Bạn muốn sửa nội dung gì?"
          style={tw`text-[16px] text-brandDark min-h-[150px] leading-6`}
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />

        {/* Gallery Quản lý URL năng động */}
        <View style={tw`flex-row flex-wrap mt-6`}>
          {dynamicMediaUrls.map((url, index) => (
            <View key={index} style={tw`w-1/3 p-1 relative`}>
              <Image
                source={{ uri: url }}
                style={tw`w-full h-28 rounded-2xl bg-gray-50 border border-gray-100`}
              />
              <TouchableOpacity
                onPress={() => handleRemoveUrl(url)}
                style={tw`absolute top-2 right-2 bg-black/60 rounded-full p-1.5`}
              >
                <X size={12} color="white" />
              </TouchableOpacity>
              <View
                style={tw`absolute bottom-2 left-2 bg-black/30 px-2 py-0.5 rounded-md`}
              >
                <Text style={tw`text-white text-[8px] font-bold`}>ĐÃ LƯU</Text>
              </View>
            </View>
          ))}

          {/* Nút Thêm ảnh: Nơi kích hoạt luồng Upload Media */}
          <TouchableOpacity
            onPress={handleAddImage}
            disabled={isUploading}
            style={tw`w-1/3 p-1`}
          >
            <View
              style={tw`w-full h-28 rounded-2xl border-2 border-dashed border-gray-200 items-center justify-center bg-gray-50`}
            >
              {isUploading ? (
                <ActivityIndicator color="#7FB069" />
              ) : (
                <>
                  <Camera size={26} color="#9CA3AF" />
                  <Text
                    style={tw`text-[10px] text-gray-400 mt-1.5 font-bold uppercase tracking-tighter`}
                  >
                    Thêm ảnh
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={tw`h-20`} />
      </ScrollView>

      {/* Overlay loading khi đang xử lý API cập nhật */}
      {isActionLoading && (
        <View
          style={tw`absolute inset-0 bg-black/10 items-center justify-center z-50`}
        >
          <View style={tw`bg-white p-6 rounded-3xl shadow-xl items-center`}>
            <ActivityIndicator size="large" color="#7FB069" />
            <Text style={tw`mt-4 text-brandDark font-bold`}>
              Đang lưu thay đổi...
            </Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default EditPostScreen;
