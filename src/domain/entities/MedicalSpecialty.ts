// src/domain/entities/MedicalSpecialty.ts

export type SpecialtyStatus = 'ACTIVE' | 'INACTIVE';

export interface MedicalSpecialty {
  id: number;
  nameVn: string;
  nameEn: string;
  status: SpecialtyStatus;
  description?: string;
  icd11Uri?: string;
}

export interface HospitalSpecialtyRelation {
  hospitalId: number;
  specialties: MedicalSpecialty[];
}