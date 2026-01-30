// src/data/dtos/account/AccountResponseDTO.ts

// Đây là khuôn mẫu chính xác của dữ liệu JSON từ Backend
export interface AccountResponseDTO {
  id: number;
  email: string;
  fullname: string; // Lưu ý: Backend trả về 'fullname' (viết thường, dính liền)
  role: string; // Ví dụ: "USER"
  status: string; // Ví dụ: "ACTIVE"
}
