import { User } from '../entities/User';

/**
 * Repository interface for User aggregate.
 * Defines WHAT data operations are needed, not HOW.
 * Implemented by PrismaUserRepository in infrastructure layer.
 */
export interface IUserRepository {
  /** Find user by unique ID */
  findById(id: string): Promise<User | null>;

  /** Find user by username (used for login) */
  findByUsername(username: string): Promise<User | null>;

  /** Find users by team ID (roster) */
  findByTeamId(teamId: string): Promise<User[]>;

  /** Create a new user (registration) */
  create(user: User): Promise<User>;

  /** Update existing user profile */
  update(user: User): Promise<User>;

  /** Delete user by ID (admin only) */
  delete(id: string): Promise<void>;

  /** Check if username already taken */
  existsByUsername(username: string): Promise<boolean>;

  /** Find all users with optional role filter (admin) */
  findAll(filter?: { role?: string; teamId?: string }): Promise<User[]>;
}