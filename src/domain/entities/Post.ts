// src/domain/entities/Post.ts

export interface Post {
  id: number;
  content: string;
  heart: number; // Số lượng tương tác (tym)
  isDeleted: boolean; // Trạng thái xóa
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; // Trạng thái kiểm duyệt
  rejectionReason: string | null; // Lý do bị từ chối (nếu có)
  createdAt: string; // Định dạng ISO: 2026-02-06T...
  authorId: number;
  authorName: string;
  authorEmail: string;
  isLiked: boolean;

  // Các trường bổ sung từ API Detail
  totalComments: number;
  activeComments: number;
  deletedComments: number;
  mediaUrls: string[]; // Danh sách các URL ảnh/video
}

export interface PostPage {
  content: Post[];
  totalPages: number;
  totalElements: number;
}
