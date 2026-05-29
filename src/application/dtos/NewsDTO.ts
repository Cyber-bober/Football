import { NewsPost, NewsCategory } from '../../domain/entities/NewsPost';
import { UserDTO } from './UserDTO';

/** News post as returned by API (includes author info) */
export interface NewsDTO {
  id: string;
  title: string;
  content: string;
  preview: string;            // truncated content for feed cards
  category: NewsCategory;
  imageUrl?: string;
  matchId?: string;
  isPublished: boolean;
  author: Pick<UserDTO, 'id' | 'username' | 'fullName'>;
  createdAt: string;
  updatedAt: string;
}

/** Input for creating/updating news post */
export interface NewsInput {
  title: string;
  content: string;
  category?: NewsCategory;
  imageUrl?: string;
  matchId?: string;
}

/**
 * Maps domain NewsPost to API response DTO.
 * Includes truncated preview and formatted dates.
 */
export function toNewsDTO(post: NewsPost, author: Pick<UserDTO, 'id' | 'username' | 'fullName'>): NewsDTO {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    preview: post.getPreview(150),
    category: post.category,
    imageUrl: post.imageUrl,
    matchId: post.matchId,
    isPublished: post.isPublished,
    author,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}