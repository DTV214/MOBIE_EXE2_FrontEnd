// src/domain/usecases/SuggestFacilitiesBySymptoms.ts
import { IHospitalRepository } from '../repositories/IHospitalRepository';
import { SymptomBasedSuggestion } from '../entities/Hospital';

export class SuggestFacilitiesBySymptoms {
  constructor(private hospitalRepository: IHospitalRepository) {}

  async execute(symptoms: string[]): Promise<SymptomBasedSuggestion> {
    return await this.hospitalRepository.suggestFacilitiesBySymptoms(symptoms);
  }
}
