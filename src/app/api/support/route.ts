/**
 * Support / feedback API.
 * POST — send feedback message (any authenticated user).
 * GET — get all messages (ADMIN only).
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/infrastructure/auth/authOptions';

// In-memory store (replace with DB table in production)
const supportMessages: {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  createdAt: string;
}[] = [];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { subject, message } = await req.json();

  if (!subject || !message) {
    return NextResponse.json({ error: 'Subject and message required' }, { status: 400 });
  }

  supportMessages.push({
    id: crypto.randomUUID(),
    userId: (session.user as any).id,
    userName: session.user.name || 'Unknown',
    subject,
    message,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'ADMIN only' }, { status: 403 });
  }

  return NextResponse.json({ messages: supportMessages });
}