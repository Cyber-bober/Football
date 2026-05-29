/**
 * Prisma implementation of INewsRepository.
 * Maps between Prisma DB records and domain NewsPost entities.
 * Supports pagination, filtering by category, and full-text search.
 */
import { NewsPost, NewsCategory } from '../../../domain/entities/NewsPost';
import { INewsRepository, PaginatedNews } from '../../../domain/interfaces/INewsRepository';
import { prisma } from '../client';
import { PrismaNewsPost } from '../prisma/types';

export class PrismaNewsRepository implements INewsRepository {
  async findPublished(page: number, pageSize: number): Promise<PaginatedNews> {
    const where = { isPublished: true };
    const [posts, total] = await Promise.all([
      prisma.newsPost.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.newsPost.count({ where }),
    ]);

    return {
      posts: posts.map((p: PrismaNewsPost) => this.toDomain(p)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findAll(page: number, pageSize: number): Promise<PaginatedNews> {
    const [posts, total] = await Promise.all([
      prisma.newsPost.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.newsPost.count(),
    ]);

    return {
      posts: posts.map((p: PrismaNewsPost) => this.toDomain(p)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(id: string): Promise<NewsPost | null> {
    const record = await prisma.newsPost.findUnique({ where: { id } });
    if (!record) return null;
    return this.toDomain(record as PrismaNewsPost);
  }

  async findByCategory(
    category: NewsCategory,
    page: number,
    pageSize: number,
  ): Promise<PaginatedNews> {
    const where = { category, isPublished: true };
    const [posts, total] = await Promise.all([
      prisma.newsPost.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.newsPost.count({ where }),
    ]);

    return {
      posts: posts.map((p: PrismaNewsPost) => this.toDomain(p)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findByMatchId(matchId: string): Promise<NewsPost[]> {
    const records = await prisma.newsPost.findMany({
      where: { matchId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r: PrismaNewsPost) => this.toDomain(r));
  }

  async search(query: string, page: number, pageSize: number): Promise<PaginatedNews> {
    const where = {
      isPublished: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' as const } },
        { content: { contains: query, mode: 'insensitive' as const } },
      ],
    };

    const [posts, total] = await Promise.all([
      prisma.newsPost.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.newsPost.count({ where }),
    ]);

    return {
      posts: posts.map((p: PrismaNewsPost) => this.toDomain(p)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async create(post: NewsPost): Promise<NewsPost> {
    const created = await prisma.newsPost.create({
      data: {
        id: post.id,
        authorId: post.authorId,
        title: post.title,
        content: post.content,
        category: post.category,
        imageUrl: post.imageUrl,
        matchId: post.matchId,
        isPublished: post.isPublished,
      },
    });
    return this.toDomain(created as PrismaNewsPost);
  }

  async update(post: NewsPost): Promise<NewsPost> {
    const updated = await prisma.newsPost.update({
      where: { id: post.id },
      data: {
        title: post.title,
        content: post.content,
        category: post.category,
        imageUrl: post.imageUrl,
        matchId: post.matchId,
        isPublished: post.isPublished,
      },
    });
    return this.toDomain(updated as PrismaNewsPost);
  }

  async delete(id: string): Promise<void> {
    await prisma.newsPost.delete({ where: { id } });
  }

  // ─── Private mapper ───────────────────────────────

  private toDomain(record: PrismaNewsPost): NewsPost {
    return new NewsPost(
      record.id,
      record.authorId,
      record.title,
      record.content,
      record.createdAt,
      record.updatedAt,
      record.category as NewsCategory,
      record.imageUrl ?? undefined,
      record.matchId ?? undefined,
      record.isPublished,
    );
  }
}