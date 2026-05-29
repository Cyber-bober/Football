/** Possible match statuses */
export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED',
}

/** Score at a specific point in match */
export interface MatchScore {
  home: number;
  away: number;
}

/** Detailed match statistics */
export interface MatchStats {
  possession: number;    // single number for home team (away = 100 - home)
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
}

/**
 * Football match entity.
 * Links two teams with date, score, and detailed stats.
 */
export class Match {
  constructor(
    public readonly id: string,
    public readonly homeTeamId: string,
    public readonly awayTeamId: string,
    public date: Date,
    public status: MatchStatus = MatchStatus.SCHEDULED,
    public score?: MatchScore,
    public stats?: MatchStats,
    public venue?: string,
  ) {}

  /** Check if match is upcoming (scheduled for future) */
  isUpcoming(): boolean {
    return this.status === MatchStatus.SCHEDULED && this.date > new Date();
  }

  /** Check if match is currently live */
  isLive(): boolean {
    return this.status === MatchStatus.LIVE;
  }

  /** Check if match is finished */
  isFinished(): boolean {
    return this.status === MatchStatus.FINISHED;
  }

  /** Update score (typically during live text broadcast) */
  updateScore(home: number, away: number): void {
    this.score = { home, away };
    this.status = MatchStatus.LIVE;
  }

  /** End the match with final score */
  finishMatch(): void {
    if (!this.score) {
      throw new Error('Cannot finish match without score');
    }
    this.status = MatchStatus.FINISHED;
  }

  /** Get winner team ID, or null if draw */
  getWinnerId(): string | null {
    if (!this.score) return null;
    if (this.score.home > this.score.away) return this.homeTeamId;
    if (this.score.away > this.score.home) return this.awayTeamId;
    return null;
  }
}