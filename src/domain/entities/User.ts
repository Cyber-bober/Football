import { Role } from '../value-objects/Role';
import { PlayerPosition } from '../value-objects/PlayerPosition';

/** Contact information embedded in User entity */
export interface UserContacts {
  email?: string;
  phone?: string;
  telegram?: string;
}

/**
 * User aggregate root.
 * Contains core business rules for role-based access checks.
 * No infrastructure dependencies (pure domain logic).
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public fullName: string,
    public birthDate: Date,
    public city: string,
    public role: Role,
    public position?: PlayerPosition,
    public photos: string[] = [],
    public contacts: UserContacts = {},
    public teamId?: string,
    public stats?: Record<string, number>,
  ) {}

  /** Whether user can publish/edit news */
  canManageNews(): boolean {
    return this.role === Role.ADMIN || this.role === Role.EDITOR;
  }

  /** Whether user can add/remove team members */
  canManageTeam(): boolean {
    return this.role === Role.ADMIN || this.role === Role.CAPTAIN;
  }

  /** Whether user has full admin access */
  isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }

  /** Update profile with partial data */
  updateProfile(data: Partial<Pick<User, 'fullName' | 'city' | 'position' | 'contacts'>>): void {
    if (data.fullName) this.fullName = data.fullName;
    if (data.city) this.city = data.city;
    if (data.position) this.position = data.position;
    if (data.contacts) this.contacts = { ...this.contacts, ...data.contacts };
  }

  /** Add a photo URL (max 10, like Telegram) */
  addPhoto(url: string): void {
    if (this.photos.length >= 10) {
      throw new Error('Maximum 10 photos allowed');
    }
    this.photos.push(url);
  }

  /** Remove a photo by URL */
  removePhoto(url: string): void {
    this.photos = this.photos.filter(p => p !== url);
  }
}