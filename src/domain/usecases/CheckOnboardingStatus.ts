// src/domain/usecases/CheckOnboardingStatus.ts
import { IStorageRepository } from '../repositories/IStorageRepository';

export class CheckOnboardingStatus {
  constructor(private storageRepository: IStorageRepository) {}

  async execute(): Promise<boolean> {
    return await this.storageRepository.hasCompletedOnboarding();
  }
}
