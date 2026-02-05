export interface Food {
  id: number;
  name: string;
  description: string | null;
  calo: number; // Calo tính trên standardServingSize
  servingUnit: string; // Đơn vị tính (g, quả, bát...)
  standardServingSize: number; // Định lượng chuẩn (VD: 100g)
  foodTypeName: string; // Loại món ăn (Trái cây, Thịt...)
  imageUrl: string | null;
  status: string; // ACTIVE, INACTIVE...
}

// Interface hỗ trợ cho việc phân trang khi gọi API Search
export interface FoodPage {
  content: Food[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Trang hiện tại
}
