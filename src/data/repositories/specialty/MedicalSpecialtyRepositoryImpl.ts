// src/data/repositories/specialty/MedicalSpecialtyRepositoryImpl.ts
import { IMedicalSpecialtyRepository } from '../../../domain/repositories/IMedicalSpecialtyRepository';
import { MedicalSpecialty } from '../../../domain/entities/MedicalSpecialty';
import {
  MedicalSpecialtyResponseDTO,
  SingleSpecialtyResponseDTO,
  SpecialtyListResponseDTO,
} from '../../dtos/specialty/MedicalSpecialtyResponseDTO';
import hospitalApiClient from '../../apis/hospitalApiClient';

export class MedicalSpecialtyRepositoryImpl implements IMedicalSpecialtyRepository {
  
  async getSpecialtyById(id: number): Promise<MedicalSpecialty> {
    try {
      const response = await hospitalApiClient.get<SingleSpecialtyResponseDTO>(
        `/api/v1/medical-specialties/${id}`
      );

      if (response.data.status !== 0) {
        throw new Error(response.data.message || 'Specialty not found');
      }

      return this.mapToMedicalSpecialty(response.data.data);
    } catch (error: any) {
      console.error('[MedicalSpecialtyRepository] getSpecialtyById error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch specialty detail');
    }
  }

  async getSpecialtiesByHospital(hospitalId: number): Promise<MedicalSpecialty[]> {
    try {
      const response = await hospitalApiClient.get<SpecialtyListResponseDTO>(
        `/api/v1/medical-specialties/hospitals/${hospitalId}`
      );

      if (response.data.status !== 0) {
        throw new Error(response.data.message || 'Failed to fetch hospital specialties');
      }

      return response.data.data.map(dto => this.mapToMedicalSpecialty(dto));
    } catch (error: any) {
      console.error('[MedicalSpecialtyRepository] getSpecialtiesByHospital error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch hospital specialties');
    }
  }

  async getSpecialtiesByIcd11(icdUri: string): Promise<MedicalSpecialty[]> {
    try {
      const response = await hospitalApiClient.get<SpecialtyListResponseDTO>(
        `/api/v1/medical-specialties/icd11s/${encodeURIComponent(icdUri)}`
      );

      if (response.data.status !== 0) {
        throw new Error(response.data.message || 'Failed to fetch specialties by ICD11');
      }

      return response.data.data.map(dto => this.mapToMedicalSpecialty(dto));
    } catch (error: any) {
      console.error('[MedicalSpecialtyRepository] getSpecialtiesByIcd11 error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch specialties by ICD11');
    }
  }

  // Private mapping method
  private mapToMedicalSpecialty(dto: MedicalSpecialtyResponseDTO): MedicalSpecialty {
    return {
      id: dto.id,
      nameVn: dto.nameVn,
      nameEn: dto.nameEn,
      status: dto.status,
      // Extended fields for future use
      description: undefined,
      icd11Uri: undefined,
    };
  }
}