export interface ExerciseLogDetail {
  id: number; // ID của bản ghi nhật ký tập luyện
  exerciseId: number; // ID của môn tập gốc
  dailyLogId: number; // ID của ngày nhật ký
  duration: number; // Thời gian tập (phút)
  activity: string; // Tên hoạt động
  metValue: number;
  caloriesOut: number; // Lượng calo tiêu hao đã được Server tính toán
  dailyLogDate: string; // Ngày ghi nhận (YYYY-MM-DD)
}
