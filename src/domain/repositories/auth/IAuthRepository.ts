// import { User } from "../../entities/User";


export interface IAuthRepository {
  // Chỉ trả về chuỗi JWT từ Backend
  loginWithGoogle(idToken: string): Promise<string>;
  saveToken(token: string): Promise<void>;
  getToken(): Promise<string | null>;
  logout(): Promise<void>;
}