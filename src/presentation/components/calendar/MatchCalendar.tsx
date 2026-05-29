'use client';

import { Match } from '@/domain/entities/Match';
import Link from 'next/link';

interface Props {
  matches: Match[];
}

export default function MatchCalendar({ matches }: Props) {
  if (matches.length === 0) {
    return <p>Матчей пока нет</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {matches.map((match) => (
        <Link
          key={match.id}
          href={`/matches/${match.id}`}
          style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: 12,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <strong>{match.homeTeamId}</strong> vs <strong>{match.awayTeamId}</strong>
          </div>
          <div>
            <div>{match.date.toLocaleDateString()}</div>
            {match.score && (
              <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                {match.score.home} : {match.score.away}
              </div>
            )}
            <div style={{ fontSize: 12, color: match.isLive() ? 'red' : '#666' }}>
              {match.status}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}