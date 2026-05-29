/**
 * NextAuth type extensions.
 * Adds custom fields (role, id, fullName) to session and JWT.
 */
import { Role } from '../../domain/value-objects/Role';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    role?: Role;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
      fullName?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    fullName?: string;
  }
}