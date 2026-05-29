'use client';

import { User } from '@/domain/entities/User';
import { Team } from '@/domain/entities/Team';
import { PositionLabels } from '@/domain/value-objects/PlayerPosition';
import Link from 'next/link';

interface Props {
  user: User;
  team: Team | null;
}

export default function ProfileCard({ user, team }: Props) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 24, maxWidth: 600 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
        {user.photos.length > 0 ? (
          user.photos.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Photo ${i + 1}`}
              style={{ width: 80, height: 80, borderRadius: 40, objectFit: 'cover' }}
            />
          ))
        ) : (
          <div style={{ width: 80, height: 80, borderRadius: 40, background: '#ccc' }} />
        )}
      </div>

      <h1 style={{ margin: 0 }}>{user.fullName}</h1>
      <p style={{ color: '#666' }}>@{user.username}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
        <div><strong>Дата рождения:</strong> {user.birthDate.toLocaleDateString()}</div>
        <div><strong>Город:</strong> {user.city}</div>
        <div><strong>Позиция:</strong> {user.position ? PositionLabels[user.position] : 'Не указана'}</div>
        <div>
          <strong>Команда:</strong>{' '}
          {team ? (
            <Link href={`/teams/${team.id}`} style={{ color: '#0070f3' }}>{team.name}</Link>
          ) : ('Нет команды')}
        </div>
      </div>

      {user.contacts && (
        <div style={{ marginTop: 16 }}>
          <strong>Контакты:</strong>
          {user.contacts.email && <div>Email: {user.contacts.email}</div>}
          {user.contacts.phone && <div>Телефон: {user.contacts.phone}</div>}
          {user.contacts.telegram && <div>Telegram: @{user.contacts.telegram}</div>}
        </div>
      )}

      {user.stats && (
        <div style={{ marginTop: 16 }}>
          <h3>Статистика</h3>
          {Object.entries(user.stats).map(([key, value]) => (
            <div key={key}><strong>{key}:</strong> {value}</div>
          ))}
        </div>
      )}
    </div>
  );
}
