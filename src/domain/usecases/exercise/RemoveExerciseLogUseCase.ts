import { IExerciseRepository } from "../../repositories/exercise/IExerciseRepository";

// RemoveExerciseLogUseCase.ts
export class RemoveExerciseLogUseCase {
  constructor(private repository: IExerciseRepository) {}
  async execute(id: number) {
    return await this.repository.removeExerciseLog(id);
  }
}
