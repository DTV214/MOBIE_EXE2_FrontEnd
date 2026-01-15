// src/data/repositories/MockForumRepository.ts
import { IForumRepository } from '../../domain/repositories/IForumRepository';
import { Post, Comment, Topic, UserProfile } from '../../domain/entities/Post';

// Mock users
const MOCK_USERS: UserProfile[] = [
  {
    id: '1',
    name: 'Dr. Nguyễn Minh',
    role: 'expert',
    roleLabel: 'Chuyên gia',
    specialty: 'Tim mạch',
    isVerified: true,
  },
  {
    id: '2',
    name: 'Mai Linh',
    role: 'trainer',
    roleLabel: 'PT',
    specialty: 'Yoga',
  },
  {
    id: '3',
    name: 'Trần Quang',
    role: 'user',
  },
  {
    id: '4',
    name: 'Lê Minh C',
    role: 'trainer',
    roleLabel: 'PT',
    specialty: 'Cardio',
  },
  {
    id: '5',
    name: 'BS. Phạm Thị D',
    role: 'doctor',
    roleLabel: 'Bác sĩ',
    specialty: 'Dinh dưỡng',
    isVerified: true,
  },
  {
    id: '6',
    name: 'BS. Nguyễn Văn A',
    role: 'doctor',
    roleLabel: 'BS.',
    specialty: 'Tim mạch',
    isVerified: true,
  },
  {
    id: '7',
    name: 'ThS. Trần Thị B',
    role: 'expert',
    roleLabel: 'ThS.',
    specialty: 'Dinh dưỡng',
    isVerified: true,
  },
];

// Mock topics
const MOCK_TOPICS: Topic[] = [
  { id: '1', name: 'Dinh dưỡng', hashtag: '#DinhDưỡng', postCount: 1245 },
  { id: '2', name: 'Tập luyện', hashtag: '#TậpLuyện', postCount: 892 },
  { id: '3', name: 'Sống khỏe', hashtag: '#SốngKhỏe', postCount: 567 },
  { id: '4', name: 'Sức khỏe tinh thần', hashtag: '#SứcKhỏeTinhThần', postCount: 432 },
  { id: '5', name: 'Tim mạch', hashtag: '#TimMạch', postCount: 234 },
  { id: '6', name: 'Yoga', hashtag: '#Yoga', postCount: 189 },
  { id: '7', name: 'Giấc ngủ', hashtag: '#GiấcNgủ', postCount: 156 },
  { id: '8', name: 'Cardio', hashtag: '#Cardio', postCount: 98 },
];

// Mock posts
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: MOCK_USERS[0],
    content:
      'Chia sẻ 5 thực phẩm tốt nhất cho sức khỏe tim mạch mà bạn nên bổ sung vào chế độ ăn hàng ngày. Đặc biệt là quả óc chó và cá hồi rất giàu Omega-3! ❤️',
    media: [{ type: 'image', url: 'https://example.com/salmon.jpg' }],
    hashtags: ['#DinhDưỡng', '#TimMạch', '#SốngKhỏe'],
    stats: {
      nutritionTip: 'Gợi ý định dưỡng: 30g quả óc chó/ngày cung cấp đủ Omega-3',
    },
    likes: 24,
    comments: 8,
    shares: 5,
    isLiked: false,
    isSaved: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: '2',
    author: MOCK_USERS[1],
    content:
      'Vừa hoàn thành buổi tập yoga buổi sáng! Cảm giác thật tuyệt vời khi bắt đầu ngày mới với năng lượng tích cực. Ai cũng tập với mình không? 🙏✨',
    media: [{ type: 'image', url: 'https://example.com/yoga.jpg' }],
    hashtags: ['#TậpLuyện', '#Yoga', '#TinhThần'],
    stats: {
      caloriesBurned: 150,
      duration: '30 phút',
    },
    likes: 42,
    comments: 15,
    shares: 8,
    isLiked: true,
    isSaved: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    id: '3',
    author: MOCK_USERS[2],
    content:
      'Mình đã thay đổi thói quen ngủ và cảm thấy tinh thần tốt hơn rất nhiều! Chia sẻ với mọi người 7 mẹo để có giấc ngủ chất lượng mà mình đã áp dụng 😴💤',
    hashtags: ['#GiấcNgủ', '#SứcKhỏeTinhThần', '#ThóiQuen'],
    likes: 18,
    comments: 5,
    shares: 3,
    isLiked: false,
    isSaved: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    id: '4',
    author: MOCK_USERS[3],
    content:
      'Chia sẻ bài tập cardio đơn giản tại nhà giúp đốt cháy calo hiệu quả! 💪 Chỉ cần 20 phút mỗi ngày, các bạn sẽ thấy sự thay đổi rõ rệt.',
    media: [
      { type: 'image', url: 'https://example.com/cardio1.jpg' },
      { type: 'image', url: 'https://example.com/cardio2.jpg' },
    ],
    hashtags: ['#TậpLuyện', '#Cardio', '#TạiNhà'],
    stats: {
      caloriesBurned: 250,
      duration: '20 phút',
    },
    likes: 24,
    comments: 8,
    shares: 6,
    isLiked: false,
    isSaved: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    author: MOCK_USERS[4],
    content:
      'Những thực phẩm tăng cường miễn dịch mùa đông mà mọi người nên bổ sung vào thực đơn hàng ngày 🍎🍊',
    media: [{ type: 'image', url: 'https://example.com/fruits.jpg' }],
    hashtags: ['#DinhDưỡng', '#MiễnDịch', '#MùaĐông'],
    likes: 156,
    comments: 42,
    shares: 28,
    isLiked: true,
    isSaved: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

export class MockForumRepository implements IForumRepository {
  private posts: Post[] = [...MOCK_POSTS];
  private likedPosts: Set<string> = new Set();
  private savedPosts: Set<string> = new Set();

  async getAllPosts(limit: number = 20, offset: number = 0): Promise<Post[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    return this.posts.slice(offset, offset + limit);
  }

  async getPostById(id: string): Promise<Post | null> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    const post = this.posts.find(p => p.id === id);
    if (post) {
      return {
        ...post,
        isLiked: this.likedPosts.has(id),
        isSaved: this.savedPosts.has(id),
      };
    }
    return null;
  }

  async searchPosts(query: string): Promise<Post[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    const lowerQuery = query.toLowerCase();
    return this.posts.filter(
      post =>
        post.content.toLowerCase().includes(lowerQuery) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(lowerQuery)),
    );
  }

  async getPostsByHashtag(hashtag: string): Promise<Post[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    return this.posts.filter(post =>
      post.hashtags.some(tag => tag.toLowerCase() === hashtag.toLowerCase()),
    );
  }

  async createPost(
    postData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'isLiked' | 'isSaved'>,
  ): Promise<Post> {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isSaved: false,
      createdAt: new Date().toISOString(),
    };
    this.posts.unshift(newPost);
    return newPost;
  }

  async likePost(postId: string): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    this.likedPosts.add(postId);
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      post.isLiked = true;
    }
  }

  async unlikePost(postId: string): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    this.likedPosts.delete(postId);
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.likes = Math.max(0, post.likes - 1);
      post.isLiked = false;
    }
  }

  async savePost(postId: string): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    this.savedPosts.add(postId);
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.isSaved = true;
    }
  }

  async unsavePost(postId: string): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    this.savedPosts.delete(postId);
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.isSaved = false;
    }
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    // Mock comments
    return [
      {
        id: '1',
        postId,
        author: MOCK_USERS[0],
        content: 'Cảm ơn bạn đã chia sẻ! Rất hữu ích.',
        likes: 5,
        isLiked: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        postId,
        author: MOCK_USERS[1],
        content: 'Mình cũng đang áp dụng và thấy hiệu quả!',
        likes: 3,
        isLiked: true,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ];
  }

  async createComment(
    commentData: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'isLiked'>,
  ): Promise<Comment> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    const newComment: Comment = {
      ...commentData,
      id: `comment-${Date.now()}`,
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };
    return newComment;
  }

  async likeComment(commentId: string): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    // Implementation would update comment likes
  }

  async unlikeComment(commentId: string): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    // Implementation would update comment likes
  }

  async getAllTopics(): Promise<Topic[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    return MOCK_TOPICS;
  }

  async getSuggestedTopics(): Promise<Topic[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    return MOCK_TOPICS.slice(0, 4);
  }

  async followTopic(topicId: string): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    const topic = MOCK_TOPICS.find(t => t.id === topicId);
    if (topic) {
      topic.isFollowing = true;
    }
  }

  async unfollowTopic(topicId: string): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    const topic = MOCK_TOPICS.find(t => t.id === topicId);
    if (topic) {
      topic.isFollowing = false;
    }
  }

  async getTrendingDiscussions(): Promise<Post[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    return this.posts
      .filter(p => p.comments > 10)
      .sort((a, b) => b.comments - a.comments)
      .slice(0, 5);
  }

  async getActiveExperts(): Promise<UserProfile[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    return MOCK_USERS.filter(u => u.role === 'expert' || u.role === 'doctor');
  }
}
