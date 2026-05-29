/**
 * Global Next.js middleware with NextAuth protection.
 * Protects routes that require authentication.
 */
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Redirect to login if not authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

/**
 * Routes that require authentication.
 * Public routes are excluded.
 */
export const config = {
  matcher: [
    '/profile/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/api/chat/:path*',
  ],
};