// src/domain/repositories/comment/ICommentRepository.ts
import { Comment } from '../../entities/Comment';

export interface ICommentRepository {
  /** Lấy danh sách bình luận của một bài viết */
  getCommentsByPostId(postId: number): Promise<Comment[]>;

  /** Tạo bình luận mới hoặc phản hồi bài viết */
  createComment(data: {
    content: string;
    mediaUrls: string[];
    postId: number;
    parentCommentId?: number; // Nếu có ID này, hệ thống hiểu là phản hồi
  }): Promise<Comment>;

  /** Cập nhật nội dung bình luận */
  updateComment(
    id: number,
    data: {
      content: string;
      mediaUrls: string[];
    },
  ): Promise<Comment>;

  /** Xóa bình luận */
  deleteComment(id: number): Promise<void>;
}
