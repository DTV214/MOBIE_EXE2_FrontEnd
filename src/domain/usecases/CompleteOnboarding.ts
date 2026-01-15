// src/domain/usecases/CompleteOnboarding.ts
import { IStorageRepository } from '../repositories/IStorageRepository';

export class CompleteOnboarding {
  constructor(private storageRepository: IStorageRepository) {}

  async execute(): Promise<void> {
    await this.storageRepository.setOnboardingCompleted();
  }
}
