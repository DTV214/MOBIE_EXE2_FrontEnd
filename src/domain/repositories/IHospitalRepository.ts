// src/domain/repositories/IHospitalRepository.ts
import { Facility, FacilityType, SymptomBasedSuggestion } from '../entities/Hospital';

export interface IHospitalRepository {
  // Search
  searchFacilities(query: string, type?: FacilityType): Promise<Facility[]>;
  getFacilityById(id: string): Promise<Facility | null>;
  
  // Location-based
  getNearbyFacilities(
    latitude: number,
    longitude: number,
    radius: number, // in km
    type?: FacilityType,
  ): Promise<Facility[]>;
  
  // Symptom-based suggestions
  suggestFacilitiesBySymptoms(symptoms: string[]): Promise<SymptomBasedSuggestion>;
  
  // Filter
  getFacilitiesBySpecialty(specialty: string): Promise<Facility[]>;
  getFacilitiesByType(type: FacilityType): Promise<Facility[]>;
}
