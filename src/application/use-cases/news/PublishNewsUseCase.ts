import { NewsPost, NewsCategory } from '../../../domain/entities/NewsPost';
import { INewsRepository, PaginatedNews } from '../../../domain/interfaces/INewsRepository';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { NewsDTO, NewsInput, toNewsDTO } from '../../dtos/NewsDTO';

/**
 * Use case: News management.
 * EDITOR can create/edit/delete own posts.
 * ADMIN can manage all posts.
 */
export class PublishNewsUseCase {
  constructor(
    private readonly newsRepo: INewsRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  /** Create a news post */
  async createPost(input: NewsInput, authorId: string): Promise<NewsDTO> {
    const author = await this.userRepo.findById(authorId);
    if (!author) throw new Error('Author not found');
    if (!author.canManageNews()) {
      throw new Error('Only editors and admins can create posts');
    }

    const post = new NewsPost(
      crypto.randomUUID(),
      authorId,
      input.title,
      input.content,
      new Date(),
      new Date(),
      input.category ?? NewsCategory.GENERAL,
      input.imageUrl,
      input.matchId,
    );

    post.publish(); // validate and publish
    const created = await this.newsRepo.create(post);

    return toNewsDTO(created, {
      id: author.id,
      username: author.username,
      fullName: author.fullName,
    });
  }

  /** Update existing post */
  async updatePost(postId: string, input: Partial<NewsInput>, actorId: string): Promise<NewsDTO> {
    const actor = await this.userRepo.findById(actorId);
    if (!actor) throw new Error('Actor not found');

    const post = await this.newsRepo.findById(postId);
    if (!post) throw new Error('Post not found');

    // Editor can only edit own posts, admin can edit all
    if (!actor.isAdmin() && post.authorId !== actorId) {
      throw new Error('You can only edit your own posts');
    }

    post.update(input);
    const updated = await this.newsRepo.update(post);

    return toNewsDTO(updated, {
      id: actor.id,
      username: actor.username,
      fullName: actor.fullName,
    });
  }

  /** Delete a post */
  async deletePost(postId: string, actorId: string): Promise<void> {
    const actor = await this.userRepo.findById(actorId);
    if (!actor) throw new Error('Actor not found');

    const post = await this.newsRepo.findById(postId);
    if (!post) throw new Error('Post not found');

    if (!actor.isAdmin() && post.authorId !== actorId) {
      throw new Error('You can only delete your own posts');
    }

    await this.newsRepo.delete(postId);
  }

  /** Publish/unpublish toggle */
  async togglePublish(postId: string, actorId: string): Promise<NewsDTO> {
    const actor = await this.userRepo.findById(actorId);
    if (!actor) throw new Error('Actor not found');
    if (!actor.canManageNews()) throw new Error('Permission denied');

    const post = await this.newsRepo.findById(postId);
    if (!post) throw new Error('Post not found');

    if (post.isPublished) {
      post.unpublish();
    } else {
      post.publish();
    }

    const updated = await this.newsRepo.update(post);
    return toNewsDTO(updated, {
      id: actor.id,
      username: actor.username,
      fullName: actor.fullName,
    });
  }

  /** Get paginated feed (public) */
  async getFeed(page: number, pageSize: number): Promise<PaginatedNews> {
    return this.newsRepo.findPublished(page, pageSize);
  }

  /** Get all posts including unpublished (admin/editor) */
  async getAllPosts(page: number, pageSize: number, actorId: string): Promise<PaginatedNews> {
    const actor = await this.userRepo.findById(actorId);
    if (!actor || !actor.canManageNews()) throw new Error('Permission denied');
    return this.newsRepo.findAll(page, pageSize);
  }
}