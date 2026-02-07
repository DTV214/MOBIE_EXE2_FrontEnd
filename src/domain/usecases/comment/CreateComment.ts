// src/domain/usecases/comment/CreateComment.ts
import { Comment } from '../../entities/Comment';
import { ICommentRepository } from '../../repositories/comment/ICommentRepository';

export class CreateComment {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(data: {
    content: string;
    mediaUrls: string[];
    postId: number;
    parentCommentId?: number; // Nếu có ID này, đây là một phản hồi
  }): Promise<Comment> {
    // Thực thi lệnh POST /api/comments
    return await this.commentRepository.createComment(data);
  }
}
