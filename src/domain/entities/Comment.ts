// src/domain/entities/Comment.ts

export interface Comment {
  id: number; // ID duy nhất của bình luận
  content: string; // Nội dung văn bản
  createdAt: string; // Thời gian tạo (ISO Date)
  mediaUrls: string[]; // Mảng ảnh/video đính kèm
  accountId: number; // ID người bình luận
  replies?: Comment[]; // Danh sách các phản hồi lồng nhau
  postId?: number; // ID bài viết liên kết
}
