import { IExerciseRepository } from "../../repositories/exercise/IExerciseRepository";

export class GetExercisesByDailyLogIdUseCase {
  constructor(private repository: IExerciseRepository) {}
  async execute(dailyLogId: number) {
    return await this.repository.getExercisesByDailyLogId(dailyLogId);
  }
}
