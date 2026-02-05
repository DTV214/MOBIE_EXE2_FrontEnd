export interface ExerciseType {
  id: number;
  activity: string; // Tên hoạt động (VD: Chạy bộ, Đạp xe)
  examples: string; // Các ví dụ cụ thể (VD: Chạy chậm, chạy nhanh)
  metValue: number; // Chỉ số chuyển đổi calo
}

// Interface phục vụ phân trang cho thư viện môn tập
export interface ExerciseTypePage {
  content: ExerciseType[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
