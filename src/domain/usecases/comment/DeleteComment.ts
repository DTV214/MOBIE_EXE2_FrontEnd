import { ICommentRepository } from "../../repositories/comment/ICommentRepository";

export class DeleteComment {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(id: number): Promise<void> {
    // Thực thi lệnh DELETE /api/comments/{id}
    return await this.commentRepository.deleteComment(id);
  }
}
