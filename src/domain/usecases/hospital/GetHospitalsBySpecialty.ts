// src/domain/usecases/hospital/GetHospitalsBySpecialty.ts
import { IHospitalNewRepository } from '../../repositories/IHospitalNewRepository';
import { Hospital } from '../../entities/HospitalNew';

export class GetHospitalsBySpecialty {
  constructor(private hospitalRepository: IHospitalNewRepository) {}

  async execute(specialtyId: number): Promise<Hospital[]> {
    return await this.hospitalRepository.getHospitalsBySpecialty(specialtyId);
  }
}