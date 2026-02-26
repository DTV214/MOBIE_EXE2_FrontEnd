// src/domain/usecases/health/CreateHealthProfile.ts
import {
  IHealthProfileRepository,
  HealthProfileRequestData,
} from '../../repositories/health/IHealthProfileRepository';

export class CreateHealthProfile {
  private repository: IHealthProfileRepository;

  constructor(repository: IHealthProfileRepository) {
    this.repository = repository;
  }

  async execute(data: HealthProfileRequestData): Promise<boolean> {
    return await this.repository.createProfile(data);
  }
}
