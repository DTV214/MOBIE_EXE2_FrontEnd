// src/domain/usecases/specialty/GetHospitalSpecialties.ts
import { IMedicalSpecialtyRepository } from '../../repositories/IMedicalSpecialtyRepository';
import { MedicalSpecialty } from '../../entities/MedicalSpecialty';

export class GetHospitalSpecialties {
  constructor(private specialtyRepository: IMedicalSpecialtyRepository) {}

  async execute(hospitalId: number): Promise<MedicalSpecialty[]> {
    return await this.specialtyRepository.getSpecialtiesByHospital(hospitalId);
  }
}