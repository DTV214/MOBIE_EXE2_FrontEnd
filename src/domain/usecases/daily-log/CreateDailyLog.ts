import { DailyLog } from '../../entities/DailyLog';
import { IDailyLogRepository } from '../../repositories/daily-log/IDailyLogRepository';

export class CreateDailyLogUseCase {
  constructor(private dailyLogRepository: IDailyLogRepository) {}

  async execute(date: string): Promise<DailyLog> {
    // Có thể thêm logic kiểm tra nếu ngày được chọn quá cũ (ví dụ > 30 ngày)
    // thì không cho tạo, tùy vào policy của dự án.

    return await this.dailyLogRepository.createLog(date);
  }
}
