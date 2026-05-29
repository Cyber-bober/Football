'use client';

import { useState, useEffect } from 'react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

interface Props {
  currentUserId: string;
}

export default function ChatWidget({ currentUserId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/chat')
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
      setText('');
    }
  };

  if (loading) return <div>Loading chat...</div>;

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
      <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 12 }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: 8,
              margin: '4px 0',
              background: msg.senderId === currentUserId ? '#e3f2fd' : '#f5f5f5',
              borderRadius: 8,
            }}
          >
            <strong>{msg.senderName}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Сообщение..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={handleSend} style={{ padding: '8px 16px' }}>
          Отправить
        </button>
      </div>
    </div>
  );
}