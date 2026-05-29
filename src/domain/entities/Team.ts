/** Team statistics aggregated from matches */
export interface TeamStats {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
}

/**
 * Football team entity.
 * Teams are managed by ADMIN or CAPTAIN.
 * Contains roster and statistics.
 */
export class Team {
  constructor(
    public readonly id: string,
    public name: string,
    public logoUrl?: string,
    public playerIds: string[] = [],
    public captainId?: string,
    public stats?: TeamStats,
  ) {}

  /** Add a player to the team */
  addPlayer(userId: string): void {
    if (this.playerIds.includes(userId)) {
      throw new Error('Player already in team');
    }
    this.playerIds.push(userId);
  }

  /** Remove a player from the team */
  removePlayer(userId: string): void {
    if (userId === this.captainId) {
      throw new Error('Cannot remove captain from team');
    }
    this.playerIds = this.playerIds.filter((id) => id !== userId);
  }

  /** Set team captain (must be a team member) */
  setCaptain(userId: string): void {
    if (!this.playerIds.includes(userId)) {
      throw new Error('Captain must be a team member');
    }
    this.captainId = userId;
  }

  /** Team roster size */
  get playerCount(): number {
    return this.playerIds.length;
  }
}