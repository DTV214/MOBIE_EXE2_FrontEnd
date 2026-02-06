// src/data/dtos/forum/PostDTO.ts

export interface PostDTO {
  id: number;
  content: string;
  heart: number;
  isDeleted: boolean;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
  authorId: number;
  authorName: string;
  authorEmail: string;
  commentCount: number;
  mediaCount: number;
  mediaUrls: string[];
}

// Cấu trúc bọc dữ liệu của API (Dựa trên ảnh response status 200)
export interface PostResponseDTO {
  status: number;
  message: string;
  data: {
    content: PostDTO[];
    totalPages: number;
    totalElements: number;
  };
}
