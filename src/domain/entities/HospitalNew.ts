// src/domain/entities/HospitalNew.ts
import { MedicalSpecialty } from './MedicalSpecialty';

export type HospitalStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_CONSTRUCTION' | 'TEMPORARILY_CLOSED';

export interface Hospital {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: HospitalStatus;
  specialtyCount: number;
  // Extended fields for better UX (can be null from API)
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  distance?: number; // calculated client-side
  imageUrl?: string;
  description?: string;
  // Related specialties
  specialties?: MedicalSpecialty[];
}

export interface HospitalFilter {
  search?: string;
  status?: HospitalStatus;
  specialtyId?: number;
  latitude?: number;
  longitude?: number;
  radius?: number; // km
  page?: number;
  size?: number;
}

export interface PaginatedHospitals {
  content: Hospital[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
}