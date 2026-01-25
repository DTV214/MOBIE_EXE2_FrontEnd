import { IAuthRepository } from "../../repositories/auth/IAuthRepository";

export class LoginWithGoogle {
  constructor(private authRepository: IAuthRepository) {}

  async execute(idToken: string): Promise<string> {
    const jwt = await this.authRepository.loginWithGoogle(idToken);

    // Lưu token vào máy
    await this.authRepository.saveToken(jwt);

    return jwt;
  }
}
