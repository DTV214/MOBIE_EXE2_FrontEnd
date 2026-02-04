import { DailyLog } from '../../entities/DailyLog';
import { IDailyLogRepository } from '../../repositories/daily-log/IDailyLogRepository';

export class GetDailyLogByDateUseCase {
  constructor(private dailyLogRepository: IDailyLogRepository) {}

  async execute(date: string): Promise<DailyLog | null> {
    // Logic nghiệp vụ: Không cho phép xem nhật ký của ngày tương lai
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 59);

    if (selectedDate > today) {
      throw new Error('Không thể xem hoặc tạo nhật ký cho ngày tương lai');
    }

    return await this.dailyLogRepository.getLogByDate(date);
  }
}
