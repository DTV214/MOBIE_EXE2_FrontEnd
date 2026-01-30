// src/domain/usecases/auth/GetAccountProfile.ts
import { IAuthRepository } from '../../repositories/auth/IAuthRepository';
import { User } from '../../entities/User';

export class GetAccountProfile {
  // Dependency Injection: Inject Interface, không inject implementation
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  // Hàm thực thi
  async execute(): Promise<User> {
    return await this.authRepository.getProfile();
  }
}
