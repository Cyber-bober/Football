import { Team } from '../entities/Team';

/**
 * Repository interface for Team aggregate.
 */
export interface ITeamRepository {
  /** Find team by ID */
  findById(id: string): Promise<Team | null>;

  /** Get all teams (public view) */
  findAll(): Promise<Team[]>;

  /** Create new team (admin only) */
  create(team: Team): Promise<Team>;

  /** Update team info (admin/captain) */
  update(team: Team): Promise<Team>;

  /** Delete team (admin only) */
  delete(id: string): Promise<void>;

  /** Find team by captain ID */
  findByCaptainId(captainId: string): Promise<Team | null>;

  /** Search teams by name (partial match) */
  searchByName(query: string): Promise<Team[]>;
}