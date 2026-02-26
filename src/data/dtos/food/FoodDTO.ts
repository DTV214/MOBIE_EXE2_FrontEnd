export interface FoodDTO {
  id: number;
  name: string;
  description: string | null;
  calo: number;
  servingUnit: string;
  standardServingSize: number;
  status: string;
  foodTypeName: string;
  imageUrl: string | null;
  nutrientCount: number;
}

// Cấu trúc phân trang từ API public/foods/items
export interface FoodPageDTO {
  content: FoodDTO[];
  pageable: any;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number; // Trang hiện tại
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
