// src/data/repositories/MockHospitalRepository.ts
import { IHospitalRepository } from '../../domain/repositories/IHospitalRepository';
import { Facility, FacilityType, SymptomBasedSuggestion } from '../../domain/entities/Hospital';

// Mock facilities data
const MOCK_FACILITIES: Facility[] = [
  {
    id: '1',
    name: 'Phòng khám Đa khoa Medlatec',
    type: 'clinic',
    location: {
      latitude: 21.0285,
      longitude: 105.8542,
      address: '42-44 Nghĩa Dũng',
      district: 'Ba Đình',
      city: 'Hà Nội',
    },
    specialty: 'Thần kinh',
    distance: 1.2,
    rating: 4.8,
    reviewCount: 245,
    phone: '024 3852 3852',
    openingHours: {
      open: '08:00',
      close: '17:00',
    },
    isOpen: true,
    statusText: 'Đang mở cửa',
    services: ['Khám tổng quát', 'Xét nghiệm', 'Siêu âm'],
  },
  {
    id: '2',
    name: 'Bệnh viện Bạch Mai',
    type: 'hospital',
    location: {
      latitude: 21.0029,
      longitude: 105.8444,
      address: '78 Giải Phóng',
      district: 'Đống Đa',
      city: 'Hà Nội',
    },
    specialty: 'Thần kinh',
    distance: 2.8,
    rating: 4.6,
    reviewCount: 1234,
    phone: '024 3869 3731',
    openingHours: {
      open: '07:00',
      close: '17:00',
    },
    isOpen: true,
    statusText: 'Đang mở cửa',
    services: ['Cấp cứu 24/7', 'Phẫu thuật', 'Điều trị nội trú'],
  },
  {
    id: '3',
    name: 'Phòng khám Vinmec Times City',
    type: 'clinic',
    location: {
      latitude: 20.9944,
      longitude: 105.8606,
      address: '458 Minh Khai',
      district: 'Hai Bà Trưng',
      city: 'Hà Nội',
    },
    specialty: 'Nội tổng quát',
    distance: 3.5,
    rating: 4.9,
    reviewCount: 567,
    phone: '024 3974 3556',
    openingHours: {
      open: '08:00',
      close: '20:00',
    },
    isOpen: true,
    statusText: 'Đang mở cửa',
    services: ['Khám chuyên khoa', 'Tư vấn dinh dưỡng', 'Xét nghiệm'],
  },
  {
    id: '4',
    name: 'Trung tâm Y tế Quận Ba Đình',
    type: 'clinic',
    location: {
      latitude: 21.0369,
      longitude: 105.8194,
      address: '27 Núi Trúc',
      district: 'Ba Đình',
      city: 'Hà Nội',
    },
    specialty: 'Da khoa',
    distance: 0.8,
    rating: 4.3,
    reviewCount: 89,
    phone: '024 3845 3845',
    openingHours: {
      open: '07:30',
      close: '16:30',
    },
    isOpen: true,
    statusText: 'Đang mở cửa',
    services: ['Khám da liễu', 'Điều trị mụn', 'Chăm sóc da'],
  },
  {
    id: '5',
    name: 'Phòng gym',
    type: 'gym',
    location: {
      latitude: 21.0285,
      longitude: 105.8542,
      address: '42-44 Nghĩa Dũng',
      district: 'Ba Đình',
      city: 'Hà Nội',
    },
    distance: 1.2,
    rating: 4.8,
    reviewCount: 156,
    phone: '024 3852 1234',
    openingHours: {
      open: '06:00',
      close: '22:00',
      is24Hours: false,
    },
    isOpen: true,
    statusText: 'Đang mở cửa',
    services: ['Cardio', 'Weight training', 'Yoga', 'Pilates'],
  },
  {
    id: '6',
    name: 'Phòng Gym',
    type: 'gym',
    location: {
      latitude: 20.9944,
      longitude: 105.8606,
      address: '15 Trần Đại Nghĩa',
      district: 'Hai Bà Trưng',
      city: 'Hà Nội',
    },
    distance: 0.8,
    rating: 4.6,
    reviewCount: 234,
    phone: '024 3974 5678',
    openingHours: {
      open: '05:00',
      close: '23:00',
      is24Hours: false,
    },
    isOpen: true,
    statusText: 'Đang mở cửa',
    services: ['CrossFit', 'Boxing', 'Swimming pool'],
  },
  {
    id: '7',
    name: 'City Gym',
    type: 'gym',
    location: {
      latitude: 21.0029,
      longitude: 105.8444,
      address: '78 Giải Phóng',
      district: 'Đống Đa',
      city: 'Hà Nội',
    },
    distance: 2.5,
    rating: 4.5,
    reviewCount: 189,
    phone: '024 3869 9999',
    openingHours: {
      open: '00:00',
      close: '23:59',
      is24Hours: true,
    },
    isOpen: true,
    statusText: '24/7',
    services: ['24/7 Access', 'Personal training', 'Group classes'],
  },
];

// Symptom to specialty mapping
const SYMPTOM_TO_SPECIALTY: Record<string, string[]> = {
  'đau đầu': ['Thần kinh', 'Nội tổng quát'],
  'chóng mặt': ['Thần kinh', 'Nội tổng quát'],
  'đau dạ dày': ['Tiêu hóa', 'Nội tổng quát'],
  'sốt': ['Nội tổng quát', 'Nhi khoa'],
  'ho': ['Hô hấp', 'Nội tổng quát'],
  'đau lưng': ['Cơ xương khớp', 'Nội tổng quát'],
  'mệt mỏi': ['Nội tổng quát'],
  'mất ngủ': ['Thần kinh', 'Tâm thần'],
};

export class MockHospitalRepository implements IHospitalRepository {
  async searchFacilities(query: string, type?: FacilityType): Promise<Facility[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    
    const lowerQuery = query.toLowerCase();
    let results = MOCK_FACILITIES.filter(facility => {
      if (type && facility.type !== type) return false;
      
      return (
        facility.name.toLowerCase().includes(lowerQuery) ||
        facility.location.address.toLowerCase().includes(lowerQuery) ||
        facility.specialty?.toLowerCase().includes(lowerQuery) ||
        facility.services?.some(s => s.toLowerCase().includes(lowerQuery))
      );
    });
    
    // Sort by distance if available
    return results.sort((a, b) => (a.distance || 999) - (b.distance || 999));
  }

  async getFacilityById(id: string): Promise<Facility | null> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    return MOCK_FACILITIES.find(f => f.id === id) || null;
  }

  async getNearbyFacilities(
    latitude: number,
    longitude: number,
    radius: number,
    type?: FacilityType,
  ): Promise<Facility[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    
    let results = MOCK_FACILITIES.filter(facility => {
      if (type && facility.type !== type) return false;
      return (facility.distance || 0) <= radius;
    });
    
    return results.sort((a, b) => (a.distance || 999) - (b.distance || 999));
  }

  async suggestFacilitiesBySymptoms(
    symptoms: string[],
  ): Promise<SymptomBasedSuggestion> {
    await new Promise<void>(resolve => setTimeout(resolve, 800));
    
    // Map symptoms to specialties
    const specialties = new Set<string>();
    symptoms.forEach(symptom => {
      const lowerSymptom = symptom.toLowerCase();
      Object.entries(SYMPTOM_TO_SPECIALTY).forEach(([key, specs]) => {
        if (lowerSymptom.includes(key)) {
          specs.forEach(spec => specialties.add(spec));
        }
      });
    });
    
    // Find facilities matching specialties
    const suggestedFacilities = MOCK_FACILITIES.filter(facility => {
      if (facility.type === 'gym') return false; // Don't suggest gyms for symptoms
      if (facility.specialty && specialties.has(facility.specialty)) {
        return true;
      }
      // If no specific specialty match, include general medicine
      if (specialties.size === 0 || facility.specialty === 'Nội tổng quát') {
        return true;
      }
      return false;
    });
    
    // Sort by distance and rating
    const sorted = suggestedFacilities
      .sort((a, b) => {
        const distanceDiff = (a.distance || 999) - (b.distance || 999);
        if (Math.abs(distanceDiff) < 0.5) {
          return b.rating - a.rating;
        }
        return distanceDiff;
      })
      .slice(0, 5); // Top 5 suggestions
    
    return {
      symptoms,
      suggestedFacilities: sorted,
      reason: `Dựa trên triệu chứng "${symptoms.join(', ')}", chúng tôi gợi ý các phòng khám chuyên khoa phù hợp.`,
    };
  }

  async getFacilitiesBySpecialty(specialty: string): Promise<Facility[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    return MOCK_FACILITIES.filter(
      f => f.specialty?.toLowerCase() === specialty.toLowerCase(),
    );
  }

  async getFacilitiesByType(type: FacilityType): Promise<Facility[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    return MOCK_FACILITIES.filter(f => f.type === type);
  }
}
