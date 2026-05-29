/**
 * Support page with feedback form.
 * Any authenticated user can send a message.
 * Messages go to admin.
 */
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function SupportPage() {
  const { data: session } = useSession();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    const res = await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message }),
    });

    if (res.ok) {
      setSent(true);
      setSubject('');
      setMessage('');
    }
  };

  if (!session) {
    return <p>Please log in to send feedback</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Поддержка</h1>

      {sent && <p style={{ color: 'green' }}>Сообщение отправлено!</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Тема</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Сообщение</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Отправить</button>
      </form>

      <div style={{ marginTop: 40, padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
        <h3>Контакты</h3>
        <p>Email администратора: admin@football-hub.ru</p>
        <p>Telegram: @football_admin</p>
      </div>
    </div>
  );
}