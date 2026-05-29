import { User, UserContacts } from '../../domain/entities/User';
import { Role } from '../../domain/value-objects/Role';
import { PlayerPosition } from '../../domain/value-objects/PlayerPosition';

/**
 * Safe user data exposed to API responses.
 * Excludes sensitive fields (password hash, etc.).
 */
export interface UserDTO {
  id: string;
  username: string;
  fullName: string;
  birthDate: string;          // ISO date string for JSON
  city: string;
  role: Role;
  position?: PlayerPosition;
  photos: string[];
  contacts: UserContacts;
  teamId?: string;
  stats?: Record<string, number>;
  createdAt: string;
}

/**
 * Input data for user registration.
 */
export interface RegisterUserInput {
  username: string;
  password: string;
  fullName: string;
  birthDate: Date;
  city: string;
  position?: PlayerPosition;
}

/**
 * Input data for updating user profile.
 */
export interface UpdateProfileInput {
  fullName?: string;
  city?: string;
  position?: PlayerPosition;
  contacts?: UserContacts;
}

/**
 * Maps domain User entity to safe DTO for API responses.
 */
export function toUserDTO(user: User, createdAt?: Date): UserDTO {
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    birthDate: user.birthDate.toISOString(),
    city: user.city,
    role: user.role,
    position: user.position,
    photos: user.photos,
    contacts: user.contacts,
    teamId: user.teamId,
    stats: user.stats,
    createdAt: createdAt?.toISOString() ?? new Date().toISOString(),
  };
}