import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { UserDTO, toUserDTO } from '../../dtos/UserDTO';

/** Login credentials input */
export interface LoginInput {
  username: string;
  password: string;
}

/**
 * Use case: Authenticate user by username and password.
 * Does NOT generate token (that's infrastructure/auth layer).
 * Returns user data if credentials are valid.
 */
export class LoginUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly passwordValidator: (plain: string, hash: string) => Promise<boolean>,
  ) {}

  async execute(input: LoginInput): Promise<UserDTO> {
    if (!input.username || !input.password) {
      throw new Error('Username and password are required');
    }

    const user = await this.userRepo.findByUsername(input.username);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Password validation is injected (bcrypt in production, mock in tests)
    const isValid = await this.passwordValidator(input.password, (user as any).passwordHash);
    if (!isValid) {
      throw new Error('Invalid username or password');
    }

    return toUserDTO(user, (user as any).createdAt);
  }
}