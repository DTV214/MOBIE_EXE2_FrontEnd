// src/domain/usecases/SearchFacilities.ts
import { IHospitalRepository } from '../repositories/IHospitalRepository';
import { Facility, FacilityType } from '../entities/Hospital';

export class SearchFacilities {
  constructor(private hospitalRepository: IHospitalRepository) {}

  async execute(query: string, type?: FacilityType): Promise<Facility[]> {
    return await this.hospitalRepository.searchFacilities(query, type);
  }
}
