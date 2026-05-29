import { Team } from '../../../domain/entities/Team';
import { ITeamRepository } from '../../../domain/interfaces/ITeamRepository';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { Role } from '../../../domain/value-objects/Role';
import { TeamDTO, toTeamDTO, CreateTeamInput, UpdateTeamInput, ManageTeamRosterInput } from '../../dtos/TeamDTO';

/**
 * Use case: All team management operations.
 * Access control: ADMIN can do everything, CAPTAIN can manage own team.
 */
export class ManageTeamUseCase {
  constructor(
    private readonly teamRepo: ITeamRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  /** Create a new team (ADMIN only) */
  async createTeam(input: CreateTeamInput, actorId: string): Promise<TeamDTO> {
    const actor = await this.userRepo.findById(actorId);
    if (!actor || !actor.isAdmin()) {
      throw new Error('Only admin can create teams');
    }

    if (!input.name || input.name.length < 2) {
      throw new Error('Team name must be at least 2 characters');
    }

    const team = new Team(crypto.randomUUID(), input.name, input.logoUrl);
    const created = await this.teamRepo.create(team);

    return toTeamDTO(created, []);
  }

  /** Update team info (ADMIN or team CAPTAIN) */
  async updateTeam(input: UpdateTeamInput, actorId: string): Promise<TeamDTO> {
    const team = await this.teamRepo.findById(input.teamId);
    if (!team) throw new Error('Team not found');

    const actor = await this.userRepo.findById(actorId);
    if (!actor) throw new Error('Actor not found');

    // Only admin or team captain can update
    if (!actor.isAdmin() && team.captainId !== actorId) {
      throw new Error('Only admin or team captain can update team');
    }

    if (input.name) team.name = input.name;
    if (input.logoUrl !== undefined) team.logoUrl = input.logoUrl;

    const updated = await this.teamRepo.update(team);
    const players = await this.userRepo.findByTeamId(team.id);

    return toTeamDTO(
      updated,
      players.map(p => ({ id: p.id, username: p.username, fullName: p.fullName, position: p.position })),
    );
  }

  /** Add player to team (ADMIN or CAPTAIN) */
  async addPlayer(input: ManageTeamRosterInput, actorId: string): Promise<TeamDTO> {
    const team = await this.teamRepo.findById(input.teamId);
    if (!team) throw new Error('Team not found');

    const actor = await this.userRepo.findById(actorId);
    if (!actor) throw new Error('Actor not found');

    if (!actor.isAdmin() && team.captainId !== actorId) {
      throw new Error('Only admin or team captain can add players');
    }

    const player = await this.userRepo.findById(input.userId);
    if (!player) throw new Error('Player not found');

    team.addPlayer(input.userId);
    const updated = await this.teamRepo.update(team);

    // Update player's teamId
    player.teamId = team.id;
    await this.userRepo.update(player);

    const players = await this.userRepo.findByTeamId(team.id);
    return toTeamDTO(
      updated,
      players.map(p => ({ id: p.id, username: p.username, fullName: p.fullName, position: p.position })),
    );
  }

  /** Remove player from team (ADMIN or CAPTAIN) */
  async removePlayer(input: ManageTeamRosterInput, actorId: string): Promise<TeamDTO> {
    const team = await this.teamRepo.findById(input.teamId);
    if (!team) throw new Error('Team not found');

    const actor = await this.userRepo.findById(actorId);
    if (!actor) throw new Error('Actor not found');

    if (!actor.isAdmin() && team.captainId !== actorId) {
      throw new Error('Only admin or team captain can remove players');
    }

    team.removePlayer(input.userId);
    const updated = await this.teamRepo.update(team);

    // Clear player's teamId
    const player = await this.userRepo.findById(input.userId);
    if (player) {
      player.teamId = undefined;
      await this.userRepo.update(player);
    }

    const players = await this.userRepo.findByTeamId(team.id);
    return toTeamDTO(
      updated,
      players.map(p => ({ id: p.id, username: p.username, fullName: p.fullName, position: p.position })),
    );
  }

  /** Set team captain (ADMIN only or current captain can transfer) */
  async setCaptain(teamId: string, newCaptainId: string, actorId: string): Promise<TeamDTO> {
    const team = await this.teamRepo.findById(teamId);
    if (!team) throw new Error('Team not found');

    const actor = await this.userRepo.findById(actorId);
    if (!actor) throw new Error('Actor not found');

    // Only ADMIN can set captain, or current captain can transfer
    if (!actor.isAdmin() && team.captainId !== actorId) {
      throw new Error('Only admin or current captain can change captain');
    }

    team.setCaptain(newCaptainId);
    const updated = await this.teamRepo.update(team);

    const players = await this.userRepo.findByTeamId(team.id);
    const captain = players.find(p => p.id === updated.captainId);

    return toTeamDTO(
      updated,
      players.map(p => ({ id: p.id, username: p.username, fullName: p.fullName, position: p.position })),
      captain ? { id: captain.id, username: captain.username, fullName: captain.fullName } : undefined,
    );
  }
}