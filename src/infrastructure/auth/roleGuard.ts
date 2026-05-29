/**
 * Role-based access control utilities.
 * Used in API routes and server components to check permissions.
 */
import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';
import { Role } from '../../domain/value-objects/Role';

/** Extended user type with role from session */
export interface SessionUser {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  role: Role;
  fullName?: string;
}

/**
 * Get current user from session (server-side).
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user as unknown as SessionUser;
}

/**
 * Require authentication — throws if not logged in.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Require minimum role — throws if user doesn't have required role.
 */
export async function requireRole(requiredRole: Role): Promise<SessionUser> {
  const user = await requireAuth();

  const roleHierarchy: Record<Role, number> = {
    [Role.USER]: 1,
    [Role.EDITOR]: 2,
    [Role.CAPTAIN]: 2,
    [Role.ADMIN]: 3,
  };

  if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
    throw new Error(`Role ${requiredRole} required, you have ${user.role}`);
  }

  return user;
}

/**
 * Check if user has specific role (boolean, no throw).
 */
export async function hasRole(role: Role): Promise<boolean> {
  try {
    await requireRole(role);
    return true;
  } catch {
    return false;
  }
}

/**
 * Require admin role.
 */
export async function requireAdmin(): Promise<SessionUser> {
  return requireRole(Role.ADMIN);
}

/**
 * Require editor or admin role.
 */
export async function requireEditor(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== Role.EDITOR && user.role !== Role.ADMIN) {
    throw new Error('Editor or Admin role required');
  }
  return user;
}