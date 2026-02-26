// src/domain/usecases/comment/GetCommentsByPostId.ts
import { Comment } from '../../entities/Comment';
import { ICommentRepository } from '../../repositories/comment/ICommentRepository';

export class GetCommentsByPostId {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(postId: number): Promise<Comment[]> {
    // Gọi repository để lấy dữ liệu từ endpoint GET /api/comments/post/{postId}
    return await this.commentRepository.getCommentsByPostId(postId);
  }
}
