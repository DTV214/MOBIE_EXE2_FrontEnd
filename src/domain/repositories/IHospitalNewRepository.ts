// src/domain/repositories/IHospitalNewRepository.ts
import { Hospital, HospitalFilter, PaginatedHospitals } from '../entities/HospitalNew';

export interface IHospitalNewRepository {
  // Get all hospitals with pagination and filters
  getAllHospitals(filter?: HospitalFilter): Promise<PaginatedHospitals>;
  
  // Get hospital detail by ID
  getHospitalById(id: number): Promise<Hospital>;
  
  // Get hospitals by specialty ID
  getHospitalsBySpecialty(specialtyId: number): Promise<Hospital[]>;
}