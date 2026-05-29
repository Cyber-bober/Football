/**
 * NextAuth API route handler.
 * All auth requests go through this endpoint.
 * POST /api/auth/signin — login
 * POST /api/auth/signout — logout
 * GET  /api/auth/session — get current session
 */
import NextAuth from 'next-auth';
import { authOptions } from '@/infrastructure/auth/authOptions';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };