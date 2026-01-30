// src/domain/usecases/health/GetPersonalHealthProfile.ts
import { IHealthProfileRepository } from '../../repositories/health/IHealthProfileRepository';
import { HealthProfile } from '../../entities/HealthProfile';

export class GetPersonalHealthProfile {
  private repository: IHealthProfileRepository;

  constructor(repository: IHealthProfileRepository) {
    this.repository = repository;
  }

  async execute(): Promise<HealthProfile> {
    return await this.repository.getPersonalProfile();
  }
}
