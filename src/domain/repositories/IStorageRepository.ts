// src/domain/repositories/IStorageRepository.ts
export interface IStorageRepository {
  hasCompletedOnboarding(): Promise<boolean>;
  setOnboardingCompleted(): Promise<void>;
  clearOnboarding(): Promise<void>;
}
