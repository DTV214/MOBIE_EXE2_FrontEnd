// src/domain/usecases/specialty/GetSpecialtyDetail.ts
import { IMedicalSpecialtyRepository } from '../../repositories/IMedicalSpecialtyRepository';
import { MedicalSpecialty } from '../../entities/MedicalSpecialty';

export class GetSpecialtyDetail {
  constructor(private specialtyRepository: IMedicalSpecialtyRepository) {}

  async execute(id: number): Promise<MedicalSpecialty> {
    return await this.specialtyRepository.getSpecialtyById(id);
  }
}