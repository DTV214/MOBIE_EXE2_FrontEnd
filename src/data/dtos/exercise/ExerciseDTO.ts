// DTO cho loại môn tập
export interface ExerciseTypeDTO {
  id: number;
  activity: string;
  examples: string;
  metValue: number;
}

// Cấu trúc phân trang cho Exercise Type
export interface ExerciseTypePageDTO {
  content: ExerciseTypeDTO[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// DTO phản hồi từ nhật ký tập luyện
export interface ExerciseLogResponseDTO {
  id: number;
  exerciseId: number;
  dailyLogId: number;
  duration: number;
  activity: string;
  metValue: number;
  caloriesOut: number;
  dailyLogDate: string;
}

// DTO gửi đi khi thêm/sửa tập luyện
export interface ExerciseLogRequestDTO {
  duration: number;
  exerciseTypeId: number;
  dailyLogId: number;
}
