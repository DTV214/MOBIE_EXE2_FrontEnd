// src/domain/usecases/CreateComment.ts
import { IForumRepository } from '../repositories/IForumRepository';
import { Comment } from '../entities/Post';

export class CreateComment {
  constructor(private forumRepository: IForumRepository) {}

  async execute(
    commentData: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'isLiked'>,
  ): Promise<Comment> {
    return await this.forumRepository.createComment(commentData);
  }
}
