// src/domain/usecases/hospital/GetHospitalDetail.ts
import { IHospitalNewRepository } from '../../repositories/IHospitalNewRepository';
import { Hospital } from '../../entities/HospitalNew';

export class GetHospitalDetail {
  constructor(private hospitalRepository: IHospitalNewRepository) {}

  async execute(id: number): Promise<Hospital> {
    return await this.hospitalRepository.getHospitalById(id);
  }
}