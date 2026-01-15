// src/domain/entities/Hospital.ts
export type FacilityType = 'clinic' | 'hospital' | 'gym';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  district?: string;
  city: string;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  location: Location;
  specialty?: string; // e.g., "Thần kinh", "Nội tổng quát", "Da khoa"
  distance?: number; // in km
  rating: number; // 0-5
  reviewCount?: number;
  phone?: string;
  website?: string;
  openingHours?: {
    open: string; // e.g., "08:00"
    close: string; // e.g., "17:00"
    is24Hours?: boolean;
  };
  isOpen: boolean; // Current status
  statusText?: string; // e.g., "Đang mở cửa", "24/7"
  imageUrl?: string;
  description?: string;
  services?: string[]; // List of services offered
  priceRange?: 'low' | 'medium' | 'high';
}

export interface SymptomBasedSuggestion {
  symptoms: string[]; // e.g., ["đau đầu", "chóng mặt"]
  suggestedFacilities: Facility[];
  reason?: string; // Why these facilities are suggested
}
