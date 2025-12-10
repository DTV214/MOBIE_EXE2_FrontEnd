import { MockUserRepository } from '../data/repositories/MockUserRepository';
import { GetUserProfile } from '../domain/usecases/GetUserProfile';

// Sau này có API thật thì chỉ cần đổi dòng này là xong
const userRepository = new MockUserRepository();

export const getUserProfileUseCase = new GetUserProfile(userRepository);
