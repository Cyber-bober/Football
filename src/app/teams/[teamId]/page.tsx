/**
 * Team detail page.
 * Shows logo, name, calendar, roster, stats.
 * Public view — anyone can see.
 * Edit buttons visible only for admin/captain.
 */
import { PrismaTeamRepository } from '@/infrastructure/database/repositories/PrismaTeamRepository';
import { PrismaUserRepository } from '@/infrastructure/database/repositories/PrismaUserRepository';
import { PrismaMatchRepository } from '@/infrastructure/database/repositories/PrismaMatchRepository';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/infrastructure/auth/authOptions';
import Link from 'next/link';
import MatchCalendar from '@/presentation/components/calendar/MatchCalendar';

interface Props {
  params: { teamId: string };
}

export default async function TeamPage({ params }: Props) {
  const teamRepo = new PrismaTeamRepository();
  const userRepo = new PrismaUserRepository();
  const matchRepo = new PrismaMatchRepository();

  const team = await teamRepo.findById(params.teamId);
  if (!team) return <div>Team not found</div>;

  const players = await userRepo.findByTeamId(team.id);
  const matches = await matchRepo.findByTeamId(team.id);

  const session = await getServerSession(authOptions);
  const isCaptain = session ? (session.user as any).id === team.captainId : false;
  const isAdmin = session ? (session.user as any).role === 'ADMIN' : false;
  const canEdit = isCaptain || isAdmin;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      {/* Logo + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        {team.logoUrl && <img src={team.logoUrl} alt={team.name} style={{ width: 80, height: 80 }} />}
        <div>
          <h1>{team.name}</h1>
          {canEdit && <Link href={`/teams/${team.id}/edit`}>Редактировать</Link>}
        </div>
      </div>

      {/* Roster */}
      <h2>Состав ({players.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {players.map((p) => (
          <div key={p.id} style={{ padding: 8, border: '1px solid #eee', borderRadius: 4 }}>
            <Link href={`/profile/${p.id}`} style={{ fontWeight: 'bold' }}>
              {p.fullName}
            </Link>
            <span style={{ marginLeft: 8, color: '#666' }}>@{p.username}</span>
          </div>
        ))}
      </div>

      {/* Statistics */}
      {team.stats && (
        <div style={{ marginTop: 24 }}>
          <h2>Статистика</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>Матчей: {team.stats.matchesPlayed}</div>
            <div>Побед: {team.stats.wins}</div>
            <div>Ничьих: {team.stats.draws}</div>
            <div>Поражений: {team.stats.losses}</div>
            <div>Забито: {team.stats.goalsScored}</div>
            <div>Пропущено: {team.stats.goalsConceded}</div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div style={{ marginTop: 24 }}>
        <h2>Календарь матчей</h2>
        <MatchCalendar matches={matches} />
      </div>
    </div>
  );
}