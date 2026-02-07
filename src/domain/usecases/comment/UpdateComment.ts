import { Comment } from "../../entities/Comment";
import { ICommentRepository } from "../../repositories/comment/ICommentRepository";

// src/domain/usecases/comment/UpdateComment.ts
export class UpdateComment {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(
    id: number,
    data: { content: string; mediaUrls: string[] },
  ): Promise<Comment> {
    // Thực thi lệnh PUT /api/comments/{id}
    return await this.commentRepository.updateComment(id, data);
  }
}


