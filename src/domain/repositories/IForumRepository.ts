// src/domain/repositories/IForumRepository.ts
import { Post, Comment, Topic } from '../entities/Post';

export interface IForumRepository {
  // Posts
  getAllPosts(limit?: number, offset?: number): Promise<Post[]>;
  getPostById(id: string): Promise<Post | null>;
  searchPosts(query: string): Promise<Post[]>;
  getPostsByHashtag(hashtag: string): Promise<Post[]>;
  createPost(post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'isLiked' | 'isSaved'>): Promise<Post>;
  likePost(postId: string): Promise<void>;
  unlikePost(postId: string): Promise<void>;
  savePost(postId: string): Promise<void>;
  unsavePost(postId: string): Promise<void>;
  
  // Comments
  getCommentsByPostId(postId: string): Promise<Comment[]>;
  createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'isLiked'>): Promise<Comment>;
  likeComment(commentId: string): Promise<void>;
  unlikeComment(commentId: string): Promise<void>;
  
  // Topics
  getAllTopics(): Promise<Topic[]>;
  getSuggestedTopics(): Promise<Topic[]>;
  followTopic(topicId: string): Promise<void>;
  unfollowTopic(topicId: string): Promise<void>;
  
  // Trending
  getTrendingDiscussions(): Promise<Post[]>;
  getActiveExperts(): Promise<UserProfile[]>;
}
