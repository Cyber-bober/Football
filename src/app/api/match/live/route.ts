/**
 * Live match text broadcast API.
 * GET — get current match score + events.
 * POST — update score (EDITOR/ADMIN only).
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/infrastructure/auth/authOptions';
import { PrismaMatchRepository } from '@/infrastructure/database/repositories/PrismaMatchRepository';

// In-memory live events store (replace with Redis in production)
const liveEvents: Record<string, { time: string; text: string }[]> = {};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get('matchId');

  if (!matchId) {
    return NextResponse.json({ error: 'matchId required' }, { status: 400 });
  }

  const matchRepo = new PrismaMatchRepository();
  const match = await matchRepo.findById(matchId);

  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  }

  return NextResponse.json({
    matchId: match.id,
    status: match.status,
    score: match.score,
    isLive: match.isLive(),
    events: liveEvents[matchId] || [],
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== 'ADMIN' && role !== 'EDITOR') {
    return NextResponse.json({ error: 'Forbidden: EDITOR or ADMIN only' }, { status: 403 });
  }

  const { matchId, homeScore, awayScore, event } = await req.json();

  if (!matchId) {
    return NextResponse.json({ error: 'matchId required' }, { status: 400 });
  }

  const matchRepo = new PrismaMatchRepository();
  const match = await matchRepo.findById(matchId);

  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  }

  // Update score
  if (homeScore !== undefined && awayScore !== undefined) {
    match.updateScore(homeScore, awayScore);
    await matchRepo.update(match);
  }

  // Add event
  if (event) {
    if (!liveEvents[matchId]) {
      liveEvents[matchId] = [];
    }
    liveEvents[matchId].push({
      time: new Date().toLocaleTimeString(),
      text: event,
    });
  }

  return NextResponse.json({
    matchId: match.id,
    status: match.status,
    score: match.score,
    isLive: match.isLive(),
    events: liveEvents[matchId] || [],
  });
}