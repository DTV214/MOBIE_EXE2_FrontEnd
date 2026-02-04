import { MealLog } from "../../../entities/MealLog";
import { IMealLogRepository } from "../../../repositories/daily-log/IMealLogRepository";

export class GetMealLogsByDailyLogIdUseCase {
  constructor(private mealLogRepository: IMealLogRepository) {}

  async execute(dailyLogId: number): Promise<MealLog[]> {
    return await this.mealLogRepository.getByDailyLogId(dailyLogId);
  }
}
