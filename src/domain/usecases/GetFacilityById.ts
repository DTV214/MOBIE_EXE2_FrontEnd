// src/domain/usecases/GetFacilityById.ts
import { IHospitalRepository } from '../repositories/IHospitalRepository';
import { Facility } from '../entities/Hospital';

export class GetFacilityById {
  constructor(private hospitalRepository: IHospitalRepository) {}

  async execute(id: string): Promise<Facility | null> {
    return await this.hospitalRepository.getFacilityById(id);
  }
}
