import { IExerciseRepository } from "../../repositories/exercise/IExerciseRepository";

// UpdateExerciseLogUseCase.ts
export class UpdateExerciseLogUseCase {
  constructor(private repository: IExerciseRepository) {}
  async execute(
    id: number,
    payload: { duration: number; exerciseTypeId: number; dailyLogId: number },
  ) {
    return await this.repository.updateExerciseLog(id, payload);
  }
}
