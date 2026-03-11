// src/data/repositories/hospital/HospitalRepositoryImpl.ts
import { IHospitalNewRepository } from '../../../domain/repositories/IHospitalNewRepository';
import { Hospital, HospitalFilter, PaginatedHospitals } from '../../../domain/entities/HospitalNew';
import { 
  HospitalResponseDTO, 
  PaginatedHospitalResponseDTO, 
  SingleHospitalResponseDTO,
  HospitalListBySpecialtyResponseDTO 
} from '../../dtos/hospital/HospitalResponseDTO';
import hospitalApiClient from '../../apis/hospitalApiClient';

export class HospitalRepositoryImpl implements IHospitalNewRepository {
  
  async getAllHospitals(filter?: HospitalFilter): Promise<PaginatedHospitals> {
    try {
      const params: any = {};
      
      if (filter?.search) params.search = filter.search;
      if (filter?.status) params.status = filter.status;
      if (filter?.page !== undefined) params.page = filter.page;
      if (filter?.size !== undefined) params.size = filter.size;

      const response = await hospitalApiClient.get<PaginatedHospitalResponseDTO>(
        '/api/public/hospitals',
        { params }
      );

      // Check if response is successful (status 200 from backend)
      if (response.data.status !== 200 && response.data.status !== 0) {
        throw new Error(response.data.message || 'Failed to fetch hospitals');
      }

      return this.mapToPaginatedHospitals(response.data);
    } catch (error: any) {
      console.error('[HospitalRepository] getAllHospitals error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch hospitals');
    }
  }

  async getHospitalById(id: number): Promise<Hospital> {
    try {
      const response = await hospitalApiClient.get<SingleHospitalResponseDTO>(
        `/api/public/hospitals/${id}`
      );

      // Check if response is successful
      if (response.data.status !== 200 && response.data.status !== 0) {
        throw new Error(response.data.message || 'Hospital not found');
      }

      return this.mapToHospital(response.data.data);
    } catch (error: any) {
      console.error('[HospitalRepository] getHospitalById error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch hospital detail');
    }
  }

  async getHospitalsBySpecialty(specialtyId: number): Promise<Hospital[]> {
    try {
      const response = await hospitalApiClient.get<HospitalListBySpecialtyResponseDTO>(
        `/api/public/hospitals/specialties/${specialtyId}`
      );

      // Check if response is successful
      if (response.data.status !== 200 && response.data.status !== 0) {
        throw new Error(response.data.message || 'Failed to fetch hospitals by specialty');
      }

      return response.data.data.map(dto => this.mapToHospital(dto));
    } catch (error: any) {
      console.error('[HospitalRepository] getHospitalsBySpecialty error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch hospitals by specialty');
    }
  }

  // Private mapping methods
  private mapToHospital(dto: HospitalResponseDTO): Hospital {
    return {
      id: dto.id,
      name: dto.name,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      status: dto.status,
      specialtyCount: dto.specialtyCount,
      // Extended fields - will be null for now, can be enhanced later
      phone: undefined,
      website: undefined,
      rating: undefined,
      reviewCount: undefined,
      distance: undefined,
      imageUrl: undefined,
      description: undefined,
      specialties: (dto as any).specialties || undefined,
    };
  }

  private mapToPaginatedHospitals(dto: PaginatedHospitalResponseDTO): PaginatedHospitals {
    return {
      content: dto.data.content.map(hospital => this.mapToHospital(hospital)),
      pageable: dto.data.pageable,
    };
  }
}