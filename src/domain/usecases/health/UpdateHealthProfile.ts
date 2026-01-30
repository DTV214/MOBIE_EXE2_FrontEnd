// src/domain/usecases/health/UpdateHealthProfile.ts
import {
  IHealthProfileRepository,
  HealthProfileRequestData,
} from '../../repositories/health/IHealthProfileRepository';

export class UpdateHealthProfile {
  private repository: IHealthProfileRepository;

  constructor(repository: IHealthProfileRepository) {
    this.repository = repository;
  }

  async execute(data: HealthProfileRequestData): Promise<boolean> {
    return await this.repository.updateProfile(data);
  }
}
