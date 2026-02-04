// src/domain/repositories/IMedicalSpecialtyRepository.ts
import { MedicalSpecialty } from '../entities/MedicalSpecialty';

export interface IMedicalSpecialtyRepository {
  // Get specialty detail by ID
  getSpecialtyById(id: number): Promise<MedicalSpecialty>;
  
  // Get all specialties of a specific hospital
  getSpecialtiesByHospital(hospitalId: number): Promise<MedicalSpecialty[]>;
  
  // Get specialties by ICD11 URI (advanced feature)
  getSpecialtiesByIcd11(icdUri: string): Promise<MedicalSpecialty[]>;
}