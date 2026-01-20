// src/domain/usecases/GetTrendingDiscussions.ts
import { IForumRepository } from '../repositories/IForumRepository';
import { Post } from '../entities/Post';

export class GetTrendingDiscussions {
  constructor(private forumRepository: IForumRepository) {}

  async execute(): Promise<Post[]> {
    return await this.forumRepository.getTrendingDiscussions();
  }
}
