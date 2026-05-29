import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { ITeamRepository } from '../../../domain/interfaces/ITeamRepository';
import { UserDTO, toUserDTO } from '../../dtos/UserDTO';
import { TeamDTO, toTeamDTO } from '../../dtos/TeamDTO';

/** Full profile response with team info if player has one */
export interface ProfileResponse {
  user: UserDTO;
  team?: TeamDTO;
  isTeamCaptain: boolean;
}

/**
 * Use case: Get full user profile for personal cabinet.
 * Includes team membership and captain status.
 */
export class GetProfileUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly teamRepo: ITeamRepository,
  ) {}

  async execute(userId: string): Promise<ProfileResponse> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userDTO = toUserDTO(user);

    // If user is in a team, fetch team details
    if (user.teamId) {
      const team = await this.teamRepo.findById(user.teamId);
      if (team) {
        const players = await this.userRepo.findByTeamId(team.id);
        const captain = players.find(p => p.id === team.captainId);

        return {
          user: userDTO,
          team: toTeamDTO(
            team,
            players.map(p => ({
              id: p.id,
              username: p.username,
              fullName: p.fullName,
              position: p.position,
            })),
            captain
              ? { id: captain.id, username: captain.username, fullName: captain.fullName }
              : undefined,
          ),
          isTeamCaptain: team.captainId === userId,
        };
      }
    }

    return {
      user: userDTO,
      isTeamCaptain: false,
    };
  }
}