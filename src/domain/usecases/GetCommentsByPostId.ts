// src/domain/usecases/GetCommentsByPostId.ts
import { IForumRepository } from '../repositories/IForumRepository';
import { Comment } from '../entities/Post';

export class GetCommentsByPostId {
  constructor(private forumRepository: IForumRepository) {}

  async execute(postId: string): Promise<Comment[]> {
    return await this.forumRepository.getCommentsByPostId(postId);
  }
}
