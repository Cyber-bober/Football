import { Match, MatchStatus, MatchStats } from '../../../domain/entities/Match';
import { IMatchRepository } from '../../../domain/interfaces/IMatchRepository';
import { ITeamRepository } from '../../../domain/interfaces/ITeamRepository';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { MatchDTO, CreateMatchInput, UpdateScoreInput, UpdateStatsInput, toMatchDTO, MatchTeamSummary } from '../../dtos/MatchDTO';

/**
 * Use case: Match management.
 * EDITOR can create matches, update scores (live text broadcast).
 * ADMIN has full control.
 */
export class ManageMatchUseCase {
  constructor(
    private readonly matchRepo: IMatchRepository,
    private readonly teamRepo: ITeamRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  /** Create a new match (EDITOR/ADMIN) */
  async createMatch(input: CreateMatchInput, actorId: string): Promise<MatchDTO> {
    const actor = await this.userRepo.findById(actorId);
    if (!actor || !actor.canManageNews()) {
      throw new Error('Only editors and admins can create matches');
    }

    const homeTeam = await this.teamRepo.findById(input.homeTeamId);
    if (!homeTeam) throw new Error('Home team not found');

    const awayTeam = await this.teamRepo.findById(input.awayTeamId);
    if (!awayTeam) throw new Error('Away team not found');

    if (input.homeTeamId === input.awayTeamId) {
      throw new Error('Team cannot play against itself');
    }

    const match = new Match(
      crypto.randomUUID(),
      input.homeTeamId,
      input.awayTeamId,
      input.date,
      MatchStatus.SCHEDULED,
      undefined,
      undefined,
      input.venue,
    );

    const created = await this.matchRepo.create(match);

    return toMatchDTO(
      created,
      { id: homeTeam.id, name: homeTeam.name, logoUrl: homeTeam.logoUrl },
      { id: awayTeam.id, name: awayTeam.name, logoUrl: awayTeam.logoUrl },
    );
  }

  /** Update score during live text broadcast (EDITOR/ADMIN) */
  async updateScore(input: UpdateScoreInput, actorId: string): Promise<MatchDTO> {
    const actor = await this.userRepo.findById(actorId);
    if (!actor || !actor.canManageNews()) throw new Error('Permission denied');

    const match = await this.matchRepo.findById(input.matchId);
    if (!match) throw new Error('Match not found');

    if (match.isFinished()) throw new Error('Cannot update finished match');

    match.updateScore(input.homeScore, input.awayScore);
    const updated = await this.matchRepo.update(match);

    const homeTeam = await this.teamRepo.findById(match.homeTeamId);
    const awayTeam = await this.teamRepo.findById(match.awayTeamId);

    return toMatchDTO(
      updated,
      { id: homeTeam!.id, name: homeTeam!.name, logoUrl: homeTeam!.logoUrl },
      { id: awayTeam!.id, name: awayTeam!.name, logoUrl: awayTeam!.logoUrl },
    );
  }

  /** Update detailed match stats */
  async updateStats(input: UpdateStatsInput, actorId: string): Promise<MatchDTO> {
    const actor = await this.userRepo.findById(actorId);
    if (!actor || !actor.canManageNews()) throw new Error('Permission denied');

    const match = await this.matchRepo.findById(input.matchId);
    if (!match) throw new Error('Match not found');

    match.stats = input.stats;
    const updated = await this.matchRepo.update(match);

    const homeTeam = await this.teamRepo.findById(match.homeTeamId);
    const awayTeam = await this.teamRepo.findById(match.awayTeamId);

    return toMatchDTO(
      updated,
      { id: homeTeam!.id, name: homeTeam!.name, logoUrl: homeTeam!.logoUrl },
      { id: awayTeam!.id, name: awayTeam!.name, logoUrl: awayTeam!.logoUrl },
    );
  }

  /** Finish match (final whistle) */
  async finishMatch(matchId: string, actorId: string): Promise<MatchDTO> {
    const actor = await this.userRepo.findById(actorId);
    if (!actor || !actor.canManageNews()) throw new Error('Permission denied');

    const match = await this.matchRepo.findById(matchId);
    if (!match) throw new Error('Match not found');

    match.finishMatch();
    const updated = await this.matchRepo.update(match);

    const homeTeam = await this.teamRepo.findById(match.homeTeamId);
    const awayTeam = await this.teamRepo.findById(match.awayTeamId);

    return toMatchDTO(
      updated,
      { id: homeTeam!.id, name: homeTeam!.name, logoUrl: homeTeam!.logoUrl },
      { id: awayTeam!.id, name: awayTeam!.name, logoUrl: awayTeam!.logoUrl },
    );
  }

  /** Get upcoming matches for calendar */
  async getUpcomingMatches(limit: number = 10): Promise<MatchDTO[]> {
    const matches = await this.matchRepo.findUpcoming(limit);
    return this.enrichMatchesWithTeams(matches);
  }

  /** Get matches for a specific team */
  async getTeamMatches(teamId: string): Promise<MatchDTO[]> {
    const matches = await this.matchRepo.findByTeamId(teamId);
    return this.enrichMatchesWithTeams(matches);
  }

  /** Helper: add team summaries to matches */
  private async enrichMatchesWithTeams(matches: Match[]): Promise<MatchDTO[]> {
    const teamIds = [...new Set(matches.flatMap(m => [m.homeTeamId, m.awayTeamId]))];
    const teams = await Promise.all(teamIds.map(id => this.teamRepo.findById(id)));
    const teamMap = new Map(teams.filter(Boolean).map(t => [t!.id, t!]));

    return matches.map(match => {
      const homeTeam = teamMap.get(match.homeTeamId);
      const awayTeam = teamMap.get(match.awayTeamId);
      return toMatchDTO(
        match,
        { id: homeTeam!.id, name: homeTeam!.name, logoUrl: homeTeam!.logoUrl },
        { id: awayTeam!.id, name: awayTeam!.name, logoUrl: awayTeam!.logoUrl },
      );
    });
  }
}