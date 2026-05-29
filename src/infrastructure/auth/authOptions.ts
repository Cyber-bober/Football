/**
 * NextAuth v4 configuration.
 * Credentials provider with role-based access.
 * JWT strategy — stateless, no database session storage needed.
 */
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaUserRepository } from '../database/repositories/PrismaUserRepository';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  // JWT strategy — session stored in cookie, not in DB
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Username and password are required');
        }

        const userRepo = new PrismaUserRepository();
        const user = await userRepo.findByUsername(credentials.username);

        if (!user) {
          throw new Error('Invalid username or password');
        }

        // Get password hash from raw record (bypasses domain entity)
        const { prisma } = await import('../database/client');
        const record = await prisma.user.findUnique({
          where: { username: credentials.username },
          select: { passwordHash: true },
        });

        if (!record) {
          throw new Error('Invalid username or password');
        }

        const isValid = await bcrypt.compare(credentials.password, record.passwordHash);

        if (!isValid) {
          throw new Error('Invalid username or password');
        }

        // Return user object that goes into JWT token
        return {
          id: user.id,
          name: user.fullName,
          email: user.contacts.email ?? null,
          image: user.photos[0] ?? null,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    /**
     * JWT callback — called when token is created or updated.
     * Adds role and other custom fields to token.
     */
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.fullName = user.name ?? undefined;
      }

      // Handle role updates (when admin changes someone's role)
      if (trigger === 'update') {
        const userRepo = new PrismaUserRepository();
        const updatedUser = await userRepo.findById(token.sub!);
        if (updatedUser) {
          token.role = updatedUser.role;
        }
      }

      return token;
    },

    /**
     * Session callback — called when session is checked.
     * Exposes token data to client-side useSession().
     */
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).fullName = token.fullName;
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  secret: process.env.NEXTAUTH_SECRET,
};