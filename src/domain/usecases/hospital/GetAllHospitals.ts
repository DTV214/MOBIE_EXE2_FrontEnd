// src/domain/usecases/hospital/GetAllHospitals.ts
import { IHospitalNewRepository } from '../../repositories/IHospitalNewRepository';
import { Hospital, HospitalFilter, PaginatedHospitals } from '../../entities/HospitalNew';

export class GetAllHospitals {
  constructor(private hospitalRepository: IHospitalNewRepository) {}

  async execute(filter?: HospitalFilter): Promise<PaginatedHospitals> {
    return await this.hospitalRepository.getAllHospitals(filter);
  }
}