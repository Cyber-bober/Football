/** News post categories */
export enum NewsCategory {
  GENERAL = 'GENERAL',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  MATCH_REPORT = 'MATCH_REPORT',
  TRANSFER = 'TRANSFER',
  INTERVIEW = 'INTERVIEW',
}

/**
 * News post entity.
 * Created by EDITOR or ADMIN. Displayed on main feed.
 * Can optionally link to a specific match.
 */
export class NewsPost {
  constructor(
    public readonly id: string,
    public readonly authorId: string,
    public title: string,
    public content: string,
    public createdAt: Date,
    public updatedAt: Date = new Date(),
    public category: NewsCategory = NewsCategory.GENERAL,
    public imageUrl?: string,
    public matchId?: string,       // optional link to match
    public isPublished: boolean = false,
  ) {}

  /** Publish the post (make visible to all users) */
  publish(): void {
    if (this.title.length < 3) {
      throw new Error('Title must be at least 3 characters');
    }
    if (this.content.length < 10) {
      throw new Error('Content must be at least 10 characters');
    }
    this.isPublished = true;
  }

  /** Unpublish (hide from feed, soft delete) */
  unpublish(): void {
    this.isPublished = false;
  }

  /** Update post content */
  update(data: Partial<Pick<NewsPost, 'title' | 'content' | 'category' | 'imageUrl'>>): void {
    if (data.title) this.title = data.title;
    if (data.content) this.content = data.content;
    if (data.category) this.category = data.category;
    if (data.imageUrl !== undefined) this.imageUrl = data.imageUrl;
    this.updatedAt = new Date();
  }

  /** Get short preview for feed cards */
  getPreview(maxLength: number = 150): string {
    return this.content.length > maxLength
      ? this.content.substring(0, maxLength) + '...'
      : this.content;
  }
}