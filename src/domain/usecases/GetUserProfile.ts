import { IUserRepository } from '../repositories/IUserRepository';
import { User } from '../entities/User';

export class GetUserProfile {
  constructor(private repo: IUserRepository) {}

  async execute(id: string): Promise<User> {
    if (!id) throw new Error('ID không hợp lệ');
    return this.repo.getUserProfile(id);
  }
}
