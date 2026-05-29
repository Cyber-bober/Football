import { Match, MatchStatus } from '../entities/Match';

/**
 * Repository interface for Match aggregate.
 * Supports calendar views, live updates, and historical stats.
 */
export interface IMatchRepository {
  /** Find match by ID */
  findById(id: string): Promise<Match | null>;

  /** Get matches for a specific team (past + upcoming) */
  findByTeamId(teamId: string): Promise<Match[]>;

  /** Get matches by status (e.g., all LIVE matches) */
  findByStatus(status: MatchStatus): Promise<Match[]>;

  /** Get upcoming matches (for calendar widget) */
  findUpcoming(limit?: number): Promise<Match[]>;

  /** Get matches in date range (for calendar page) */
  findByDateRange(start: Date, end: Date): Promise<Match[]>;

  /** Create new match (admin/editor) */
  create(match: Match): Promise<Match>;

  /** Update match (score, status, stats) */
  update(match: Match): Promise<Match>;

  /** Delete match (admin only) */
  delete(id: string): Promise<void>;

  /** Get recent finished matches for news feed */
  findRecent(limit?: number): Promise<Match[]>;
}