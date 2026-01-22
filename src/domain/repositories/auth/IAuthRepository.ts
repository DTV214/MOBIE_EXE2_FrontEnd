import { User } from "../../entities/User";


export interface IAuthRepository {
  loginWithGoogle(idToken: string): Promise<{ user: User; jwt: string }>;
  saveToken(token: string): Promise<void>;
  getToken(): Promise<string | null>;
  logout(): Promise<void>;
}
