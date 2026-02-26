// src/domain/usecases/forum/DeletePost.ts
import { IForumRepository } from '../../repositories/forum/IForumRepository';

export class DeletePost {
  constructor(private forumRepository: IForumRepository) {}

  async execute(id: number): Promise<void> {
    return await this.forumRepository.deletePost(id);
  }
}
