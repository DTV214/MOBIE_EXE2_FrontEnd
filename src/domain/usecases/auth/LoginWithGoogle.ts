import { IAuthRepository } from "../../repositories/auth/IAuthRepository";


export class LoginWithGoogle {
  constructor(private authRepository: IAuthRepository) {}

  async execute(idToken: string) {
    const result = await this.authRepository.loginWithGoogle(idToken);
    // Sau khi login BE thành công, lưu token vào bộ nhớ máy
    await this.authRepository.saveToken(result.jwt);
    return result.user;
  }
}
