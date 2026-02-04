// src/data/dtos/hospital/HospitalResponseDTO.ts

export interface HospitalResponseDTO {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'ACTIVE' | 'INACTIVE' | 'UNDER_CONSTRUCTION' | 'TEMPORARILY_CLOSED';
  specialtyCount: number;
}

export interface PaginatedHospitalResponseDTO {
  status: number;
  message: string;
  data: {
    content: HospitalResponseDTO[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      totalElements: number;
      totalPages: number;
      first: boolean;
      last: boolean;
    };
  };
}

export interface SingleHospitalResponseDTO {
  status: number;
  message: string;
  data: HospitalResponseDTO;
}

export interface HospitalListBySpecialtyResponseDTO {
  status: number;
  message: string;
  data: HospitalResponseDTO[];
}