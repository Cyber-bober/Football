import { Team, TeamStats } from '../../domain/entities/Team';
import { UserDTO } from './UserDTO';

/** Team data exposed to API */
export interface TeamDTO {
  id: string;
  name: string;
  logoUrl?: string;
  captain?: Pick<UserDTO, 'id' | 'username' | 'fullName'>;
  players: Pick<UserDTO, 'id' | 'username' | 'fullName' | 'position'>[];
  playerCount: number;
  stats?: TeamStats;
}

/** Input for creating a new team */
export interface CreateTeamInput {
  name: string;
  logoUrl?: string;
}

/** Input for updating team */
export interface UpdateTeamInput {
  teamId: string;
  name?: string;
  logoUrl?: string;
  captainId?: string;
}

/** Input for adding/removing players */
export interface ManageTeamRosterInput {
  teamId: string;
  userId: string;
}

/**
 * Maps domain Team entity to API response DTO.
 * Requires player and captain details for rich display.
 */
export function toTeamDTO(
  team: Team,
  players: Pick<UserDTO, 'id' | 'username' | 'fullName' | 'position'>[],
  captain?: Pick<UserDTO, 'id' | 'username' | 'fullName'>,
): TeamDTO {
  return {
    id: team.id,
    name: team.name,
    logoUrl: team.logoUrl,
    captain,
    players,
    playerCount: team.playerCount,
    stats: team.stats,
  };
}