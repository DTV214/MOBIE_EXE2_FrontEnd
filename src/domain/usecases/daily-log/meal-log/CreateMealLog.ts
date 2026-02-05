import { MealLog, MealType } from "../../../entities/MealLog";
import { IMealLogRepository } from "../../../repositories/daily-log/IMealLogRepository";

export class CreateMealLogUseCase {
  constructor(private mealLogRepository: IMealLogRepository) {}

  async execute(
    dailyLogId: number,
    mealType: MealType,
    loggedTime: string,
    notes?: string,
  ): Promise<MealLog> {
    return await this.mealLogRepository.createMealLog(
      dailyLogId,
      mealType,
      loggedTime,
      notes,
    );
  }
}
