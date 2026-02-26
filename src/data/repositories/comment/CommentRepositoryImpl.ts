// src/data/repositories/comment/CommentRepositoryImpl.ts

import { Comment } from '../../../domain/entities/Comment';
import { ICommentRepository } from '../../../domain/repositories/comment/ICommentRepository';
import axiosInstance from '../../apis/axiosInstance';

export class CommentRepositoryImpl implements ICommentRepository {
  /** * Lấy danh sách bình luận theo postId
   * Endpoint: GET /api/comments/post/{postId}
   */
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    const response = await axiosInstance.get(`/api/comments/post/${postId}`);
   const result = response.data.data || response.data;
   return Array.isArray(result) ? result : []; // Trả về danh sách bình luận kèm replies lồng nhau
  }

  /** * Tạo mới bình luận hoặc phản hồi
   * Endpoint: POST /api/comments
   */
  async createComment(data: {
    content: string;
    mediaUrls: string[];
    postId: number;
    parentCommentId?: number;
  }): Promise<Comment> {
    const response = await axiosInstance.post('/api/comments', data);
    return response.data.data; // Trả về bình luận vừa tạo
  }

  /** * Cập nhật nội dung bình luận
   * Endpoint: PUT /api/comments/{id}
   */
  async updateComment(
    id: number,
    data: { content: string; mediaUrls: string[] },
  ): Promise<Comment> {
    const response = await axiosInstance.put(`/api/comments/${id}`, data);
    return response.data.data;
  }

  /** * Xóa bình luận vĩnh viễn
   * Endpoint: DELETE /api/comments/{id}
   */
  async deleteComment(id: number): Promise<void> {
    await axiosInstance.delete(`/api/comments/${id}`);
  }
}
