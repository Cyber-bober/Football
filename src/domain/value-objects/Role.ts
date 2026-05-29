/**
 * User roles for authorization and access control.
 * 
 * - USER: Default role after registration. Read access + chat.
 * - EDITOR: Can manage news feed and text broadcasts.
 * - CAPTAIN: Can manage own team (add/remove players).
 * - ADMIN: Full system access.
 */
export enum Role {
  USER = 'USER',
  EDITOR = 'EDITOR',
  CAPTAIN = 'CAPTAIN',
  ADMIN = 'ADMIN',
}

/**
 * Maps role to its numeric privilege level.
 * Higher number = more permissions.
 */
export const RoleHierarchy: Record<Role, number> = {
  [Role.USER]: 1,
  [Role.EDITOR]: 2,
  [Role.CAPTAIN]: 2,
  [Role.ADMIN]: 3,
};

/**
 * Check if a role has at least the required privilege level.
 */
export function hasMinimumRole(userRole: Role, requiredRole: Role): boolean {
  return RoleHierarchy[userRole] >= RoleHierarchy[requiredRole];
}