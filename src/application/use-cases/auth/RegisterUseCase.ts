import { User } from '../../../domain/entities/User';
import { Role } from '../../../domain/value-objects/Role';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { RegisterUserInput, UserDTO, toUserDTO } from '../../dtos/UserDTO';

/**
 * Use case: Register a new user.
 * Validates input, checks uniqueness, creates user with USER role.
 */
export class RegisterUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: RegisterUserInput): Promise<UserDTO> {
    // Validate username
    if (!input.username || input.username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(input.username)) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }

    // Validate password
    if (!input.password || input.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Validate full name
    if (!input.fullName || input.fullName.length < 2) {
      throw new Error('Full name is required');
    }

    // Check uniqueness
    const exists = await this.userRepo.existsByUsername(input.username);
    if (exists) {
      throw new Error('Username already taken');
    }

    // Create user entity (password hashing happens in infrastructure)
    const user = new User(
      crypto.randomUUID(),
      input.username,
      input.fullName,
      input.birthDate,
      input.city,
      Role.USER,
      input.position,
    );

    const created = await this.userRepo.create(user);
    return toUserDTO(created, new Date());
  }
}