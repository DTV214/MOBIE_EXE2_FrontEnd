// src/domain/entities/Post.ts
export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  role?: 'expert' | 'doctor' | 'trainer' | 'user';
  roleLabel?: string; // e.g., "Chuyên gia", "Bác sĩ", "PT"
  specialty?: string; // e.g., "Tim mạch", "Dinh dưỡng"
  isVerified?: boolean;
}

export interface PostMedia {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export interface PostStats {
  caloriesBurned?: number; // For workout posts
  duration?: string; // e.g., "30 phút"
  nutritionTip?: string; // For nutrition posts
}

export interface Post {
  id: string;
  author: UserProfile;
  content: string;
  media?: PostMedia[];
  hashtags: string[];
  stats?: PostStats;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string; // ISO date string
  updatedAt?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: UserProfile;
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  replies?: Comment[];
}

export interface Topic {
  id: string;
  name: string;
  hashtag: string; // e.g., "#DinhDưỡng"
  description?: string;
  postCount?: number;
  isFollowing?: boolean;
}
