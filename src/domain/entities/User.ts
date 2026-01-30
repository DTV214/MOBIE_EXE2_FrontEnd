// src/domain/entities/User.ts

export interface User {
  id: number;
  email: string;
  fullName: string; // Đổi từ 'fullname' của BE sang 'fullName' cho chuẩn JS/TS
  role: string; // Ví dụ: "USER", "ADMIN"
  status: string; // Ví dụ: "ACTIVE"
  avatar?: string; // Có thể mở rộng sau này
  bmi?: number | null; // Optional: Vì API Account hiện tại chưa trả về, ta để null
}
