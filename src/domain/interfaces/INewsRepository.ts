import { NewsPost, NewsCategory } from '../entities/NewsPost';

/** Paginated result for news feed */
export interface PaginatedNews {
  posts: NewsPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Repository interface for NewsPost aggregate.
 * Supports pagination, filtering by category, and CRUD.
 */
export interface INewsRepository {
  /** Get published posts with pagination (main feed) */
  findPublished(page: number, pageSize: number): Promise<PaginatedNews>;

  /** Get all posts including unpublished (admin/editor) */
  findAll(page: number, pageSize: number): Promise<PaginatedNews>;

  /** Find post by ID */
  findById(id: string): Promise<NewsPost | null>;

  /** Filter posts by category */
  findByCategory(category: NewsCategory, page: number, pageSize: number): Promise<PaginatedNews>;

  /** Get posts linked to a specific match */
  findByMatchId(matchId: string): Promise<NewsPost[]>;

  /** Search posts by title/content */
  search(query: string, page: number, pageSize: number): Promise<PaginatedNews>;

  /** Create new post */
  create(post: NewsPost): Promise<NewsPost>;

  /** Update existing post */
  update(post: NewsPost): Promise<NewsPost>;

  /** Delete post (admin/editor) */
  delete(id: string): Promise<void>;
}