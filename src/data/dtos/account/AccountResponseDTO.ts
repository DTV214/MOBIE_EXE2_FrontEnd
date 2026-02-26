export interface AccountResponseDTO {
  id: number;
  email: string;
  fullname: string; // Backend trả về 'fullname' (viết thường)
  role: string;
  status: string;
  isHaveHealthProfile: boolean; // ✅ MỚI: Thêm trường này để hứng dữ liệu từ BE
}
