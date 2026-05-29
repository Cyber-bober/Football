'use client';

import { useState, useEffect } from 'react';

interface LiveData {
  matchId: string;
  status: string;
  score?: { home: number; away: number };
  isLive: boolean;
  events: { time: string; text: string }[];
}

interface Props {
  matchId: string;
  isEditor: boolean;
}

export default function LiveBroadcast({ matchId, isEditor }: Props) {
  const [data, setData] = useState<LiveData | null>(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [event, setEvent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/match/live?matchId=${matchId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.score) {
          setHomeScore(json.score.home);
          setAwayScore(json.score.away);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [matchId]);

  const handleUpdateScore = async () => {
    await fetch('/api/match/live', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, homeScore, awayScore }),
    });
    window.location.reload();
  };

  const handleAddEvent = async () => {
    if (!event.trim()) return;
    await fetch('/api/match/live', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, event }),
    });
    setEvent('');
    window.location.reload();
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
      {/* Scoreboard */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 32, fontWeight: 'bold' }}>
          {data.score ? `${data.score.home} : ${data.score.away}` : '0 : 0'}
        </div>
        <div style={{ color: data.isLive ? 'red' : '#666', fontSize: 14, marginTop: 4 }}>
          {data.isLive ? '● LIVE' : data.status}
        </div>
      </div>

      {/* Editor controls */}
      {isEditor && data.isLive && (
        <div style={{ border: '1px solid #eee', padding: 12, marginBottom: 16, borderRadius: 8 }}>
          <h4>Обновить счёт</h4>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <input
              type="number"
              value={homeScore}
              onChange={(e) => setHomeScore(Number(e.target.value))}
              style={{ width: 60, padding: 4 }}
            />
            <span>:</span>
            <input
              type="number"
              value={awayScore}
              onChange={(e) => setAwayScore(Number(e.target.value))}
              style={{ width: 60, padding: 4 }}
            />
            <button onClick={handleUpdateScore} style={{ padding: '4px 12px' }}>Обновить</button>
          </div>

          <h4>Добавить событие</h4>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              placeholder="Например: ГОЛ! Иванов, 45'"
              style={{ flex: 1, padding: 4 }}
            />
            <button onClick={handleAddEvent} style={{ padding: '4px 12px' }}>Добавить</button>
          </div>
        </div>
      )}

      {/* Events timeline */}
      <div>
        <h4>События матча</h4>
        {data.events.length === 0 ? (
          <p style={{ color: '#666' }}>Событий пока нет</p>
        ) : (
          data.events.map((ev, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ color: '#666', marginRight: 8 }}>{ev.time}</span>
              {ev.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}