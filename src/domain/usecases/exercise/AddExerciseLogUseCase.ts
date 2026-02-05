import { IExerciseRepository } from "../../repositories/exercise/IExerciseRepository";

export class AddExerciseLogUseCase {
  constructor(private repository: IExerciseRepository) {}
  async execute(payload: {
    duration: number;
    exerciseTypeId: number;
    dailyLogId: number;
  }) {
    return await this.repository.addExerciseLog(payload);
  }
}
