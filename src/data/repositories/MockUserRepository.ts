import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class MockUserRepository implements IUserRepository {
  async getUserProfile(id: string): Promise<User> {
    // Giả lập độ trễ mạng 1 giây
    await new Promise<void>(resolve => setTimeout(resolve, 1000));

    return {
      id: id,
      name: 'Nguyễn Văn Health',
      email: 'demo@healthapp.com',
      bmi: 22.5,
    };
  }
}
