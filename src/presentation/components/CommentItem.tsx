// src/presentation/components/CommentItem.tsx

import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import tw from '../../utils/tailwind';
import { Comment } from '../../domain/entities/Comment';
import { MoreHorizontal } from 'lucide-react-native';
import { useUserStore } from '../viewmodels/useUserStore';
import { useCommentStore } from '../viewmodels/useCommentStore';

interface CommentItemProps {
  comment: Comment;
  postId: number; // THÊM MỚI: Cần postId để refresh danh sách
  onReply: (parentComment: Comment) => void;
  onEdit: (comment: Comment) => void;
  isReply?: boolean;
}

const CommentItem = ({
  comment,
  postId, // Nhận postId từ props
  onReply,
  onEdit,
  isReply = false,
}: CommentItemProps) => {
  const { user } = useUserStore();
  const { removeComment } = useCommentStore();

  const isMine = user?.id === comment.accountId;

  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    comment.accountId.toString(),
  )}&background=EBF4FF&color=3B82F6&bold=true`;

  const handleDelete = () => {
    Alert.alert(
      'Xóa bình luận',
      'Bạn có chắc chắn muốn gỡ bỏ bình luận này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          // FIX LỖI: Truyền đủ 2 tham số: ID bình luận và ID bài viết
          onPress: () => removeComment(comment.id, postId),
        },
      ],
    );
  };

  const showOptions = () => {
    Alert.alert('Tùy chọn bình luận', '', [
      { text: 'Chỉnh sửa', onPress: () => onEdit(comment) },
      { text: 'Xóa', style: 'destructive', onPress: handleDelete },
      { text: 'Đóng', style: 'cancel' },
    ]);
  };

  return (
    <View style={tw`flex-row mb-5 ${isReply ? 'ml-12 mt-2' : ''}`}>
      <Image
        source={{ uri: avatar }}
        style={tw`${isReply ? 'w-7 h-7' : 'w-10 h-10'} rounded-full mr-3`}
      />

      <View style={tw`flex-1`}>
        <View style={tw`flex-row items-center`}>
          <View
            style={tw`bg-gray-100 px-4 py-2.5 rounded-[20px] max-w-[90%] shadow-sm`}
          >
            <Text style={tw`text-brandDark font-black text-[13px]`}>
              {isMine ? 'Bạn' : `Người dùng ${comment.accountId}`}
            </Text>

            <Text style={tw`text-gray-700 text-[14px] mt-0.5 leading-5`}>
              {comment.content}
            </Text>

            {comment.mediaUrls && comment.mediaUrls.length > 0 && (
              <View style={tw`flex-row flex-wrap mt-2`}>
                {comment.mediaUrls.map((url, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: url }}
                    style={tw`w-24 h-24 rounded-xl mr-2 mb-2 bg-gray-200 border border-gray-100`}
                    resizeMode="cover"
                  />
                ))}
              </View>
            )}
          </View>

          {isMine && (
            <TouchableOpacity onPress={showOptions} style={tw`p-2 ml-1`}>
              <MoreHorizontal size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        <View style={tw`flex-row items-center mt-1.5 ml-2`}>
          <Text style={tw`text-gray-400 text-[11px] mr-4`}>
            {comment.createdAt}
          </Text>
          <TouchableOpacity onPress={() => onReply(comment)}>
            <Text
              style={tw`text-gray-500 text-[11px] font-black uppercase tracking-tighter`}
            >
              Phản hồi
            </Text>
          </TouchableOpacity>
        </View>

        {comment.replies && comment.replies.length > 0 && (
          <View>
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId} // Chuyền tiếp postId cho các phản hồi con
                onReply={onReply}
                onEdit={onEdit}
                isReply={true}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default CommentItem;
