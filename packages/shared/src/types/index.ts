// Shared Types for Engineering Hub
// All interfaces and types used across frontend and backend

// ============================================
// ARTICLE TYPES
// ============================================

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  images?: string[];
  category: Category;
  tags: string[];
  author: Author;
  publishedAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  status: ArticleStatus;
  isFeatured: boolean;
  readTime: number; // in minutes
  source?: ArticleSource;
}

export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface ArticleSource {
  name: string;
  url: string;
  scrapedAt: Date;
}

export interface ArticleCardData {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: Pick<Category, '_id' | 'name' | 'slug'>;
  author: Pick<Author, '_id' | 'name' | 'avatar'>;
  publishedAt: Date;
  readTime: number;
  views: number;
}

export interface CreateArticleDTO {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage: string;
  categoryId: string;
  tags: string[];
  authorId: string;
  status?: ArticleStatus;
  isFeatured?: boolean;
}

export interface UpdateArticleDTO extends Partial<CreateArticleDTO> {
  _id: string;
}

// ============================================
// CATEGORY TYPES
// ============================================

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const CATEGORIES = [
  'NEWS',
  'VIDEOS', 
  'ENERGY',
  'SCIENCE',
  'MILITARY',
  'HEALTH',
  'TRANSPORTATION',
  'SPACE',
  'INNOVATION',
  'CULTURE',
] as const;

export type CategoryType = typeof CATEGORIES[number];

// ============================================
// AUTHOR TYPES
// ============================================

export interface Author {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  socialLinks?: SocialLinks;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

// ============================================
// USER TYPES  
// ============================================

export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  preferences: UserPreferences;
  bookmarkedArticles: string[];
  likedArticles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'editor' | 'author' | 'user';

export interface UserPreferences {
  theme: 'light' | 'dark';
  categories: string[];
  emailNotifications: boolean;
  weeklyNewsletter: boolean;
}

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// ============================================
// COMMENT TYPES
// ============================================

export interface Comment {
  _id: string;
  articleId: string;
  userId: string;
  content: string;
  parentId?: string; // for nested comments
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  user: Pick<User, '_id' | 'name' | 'avatar'>;
  replies?: Comment[];
}

export interface CreateCommentDTO {
  articleId: string;
  content: string;
  parentId?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

// ============================================
// SEARCH TYPES
// ============================================

export interface SearchParams {
  query: string;
  category?: string;
  tags?: string[];
  author?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'date' | 'views' | 'likes';
}

export interface SearchResult {
  articles: ArticleCardData[];
  total: number;
  took: number; // search time in ms
}

// ============================================
// SCRAPER TYPES
// ============================================

export interface ScraperConfig {
  _id: string;
  name: string;
  url: string;
  selectors: {
    article: string;
    title: string;
    content: string;
    image: string;
    date: string;
  };
  schedule: string; // cron expression
  isActive: boolean;
  lastRun?: Date;
  createdAt: Date;
}

export interface ScraperResult {
  success: boolean;
  articlesScraped: number;
  errors: string[];
  timestamp: Date;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface ArticleAnalytics {
  articleId: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  avgReadTime: number;
  bounceRate: number;
  sources: {
    direct: number;
    search: number;
    social: number;
    referral: number;
  };
}

export interface DashboardStats {
  totalArticles: number;
  totalViews: number;
  totalUsers: number;
  avgReadTime: number;
  topArticles: ArticleCardData[];
  topCategories: Array<{
    category: string;
    count: number;
  }>;
  recentActivity: Array<{
    type: 'article' | 'comment' | 'user';
    description: string;
    timestamp: Date;
  }>;
}

// ============================================
// FILTER TYPES
// ============================================

export interface ArticleFilters {
  category?: string;
  tags?: string[];
  author?: string;
  status?: ArticleStatus;
  isFeatured?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface SortOptions {
  field: 'publishedAt' | 'views' | 'likes' | 'title';
  order: 'asc' | 'desc';
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'new_article'
  | 'comment_reply'
  | 'like'
  | 'mention'
  | 'system';

// ============================================
// SUBSCRIPTION TYPES
// ============================================

export interface Subscription {
  _id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
}

export type SubscriptionPlan = 'free' | 'premium' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

// ============================================
// NEWSLETTER TYPES
// ============================================

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  name?: string;
  categories: string[];
  frequency: 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  subscribedAt: Date;
}

// ============================================
// UTILITY TYPES
// ============================================

export type ID = string;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Timestamp = Date | string;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  // Re-export everything for convenience
};
