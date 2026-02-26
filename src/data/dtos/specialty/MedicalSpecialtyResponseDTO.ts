// src/data/dtos/specialty/MedicalSpecialtyResponseDTO.ts

export interface MedicalSpecialtyResponseDTO {
  id: number;
  nameVn: string;
  nameEn: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface SingleSpecialtyResponseDTO {
  status: number;
  message: string;
  data: MedicalSpecialtyResponseDTO;
}

export interface SpecialtyListResponseDTO {
  status: number;
  message: string;
  data: MedicalSpecialtyResponseDTO[];
}