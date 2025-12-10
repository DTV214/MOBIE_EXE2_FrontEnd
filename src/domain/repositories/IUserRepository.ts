import { User } from '../entities/User';

export interface IUserRepository {
  getUserProfile(id: string): Promise<User>;
}
