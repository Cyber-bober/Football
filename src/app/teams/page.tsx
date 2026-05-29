/**
 * Teams list page — public, shows all teams.
 * Each team name links to team detail page.
 */
import { PrismaTeamRepository } from '@/infrastructure/database/repositories/PrismaTeamRepository';
import Link from 'next/link';

export default async function TeamsPage() {
  const teamRepo = new PrismaTeamRepository();
  const teams = await teamRepo.findAll();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>Команды</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/teams/${team.id}`}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            {team.logoUrl && (
              <img src={team.logoUrl} alt={team.name} style={{ width: 48, height: 48 }} />
            )}
            <h2>{team.name}</h2>
            <p>Игроков: {team.playerCount}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}