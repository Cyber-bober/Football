import { Match, MatchStatus, MatchScore, MatchStats } from '../../domain/entities/Match';

/** Team summary needed for match display */
export interface MatchTeamSummary {
  id: string;
  name: string;
  logoUrl?: string;
}

/** Match data for API responses (calendar, live, history) */
export interface MatchDTO {
  id: string;
  homeTeam: MatchTeamSummary;
  awayTeam: MatchTeamSummary;
  date: string;
  status: MatchStatus;
  score?: MatchScore;
  stats?: MatchStats;
  venue?: string;
  isLive: boolean;
  isUpcoming: boolean;
  isFinished: boolean;
  winnerId: string | null;
}

/** Input for creating a new match */
export interface CreateMatchInput {
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  venue?: string;
}

/** Input for updating live match score */
export interface UpdateScoreInput {
  matchId: string;
  homeScore: number;
  awayScore: number;
}

/** Input for updating match stats */
export interface UpdateStatsInput {
  matchId: string;
  stats: MatchStats;
}

/**
 * Maps domain Match entity to API response DTO.
 * Includes computed flags and team summaries.
 */
export function toMatchDTO(
  match: Match,
  homeTeam: MatchTeamSummary,
  awayTeam: MatchTeamSummary,
): MatchDTO {
  return {
    id: match.id,
    homeTeam,
    awayTeam,
    date: match.date.toISOString(),
    status: match.status,
    score: match.score,
    stats: match.stats,
    venue: match.venue,
    isLive: match.isLive(),
    isUpcoming: match.isUpcoming(),
    isFinished: match.isFinished(),
    winnerId: match.getWinnerId(),
  };
}