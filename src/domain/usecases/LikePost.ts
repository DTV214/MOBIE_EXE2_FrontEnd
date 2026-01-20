// src/domain/usecases/LikePost.ts
import { IForumRepository } from '../repositories/IForumRepository';

export class LikePost {
  constructor(private forumRepository: IForumRepository) {}

  async execute(postId: string, isLiked: boolean): Promise<void> {
    if (isLiked) {
      await this.forumRepository.unlikePost(postId);
    } else {
      await this.forumRepository.likePost(postId);
    }
  }
}
