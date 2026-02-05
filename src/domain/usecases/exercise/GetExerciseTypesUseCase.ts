import { IExerciseRepository } from '../../repositories/exercise/IExerciseRepository';

export class GetExerciseTypesUseCase {
  constructor(private repository: IExerciseRepository) {}
  async execute(page: number, size: number) {
    return await this.repository.getExerciseTypes(page, size);
  }
}
