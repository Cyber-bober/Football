'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookiesAccepted');
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#222',
      color: '#fff',
      padding: '16px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 9999,
      flexWrap: 'wrap',
      gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <p style={{ margin: 0, fontSize: 14 }}>
          Мы используем cookie для улучшения работы сайта. Продолжая использовать сайт,
          вы соглашаетесь с{' '}
          <Link href="/terms" style={{ color: '#4da6ff', textDecoration: 'underline' }}>
            пользовательским соглашением
          </Link>
          .
        </p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleDecline}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            color: '#fff',
            border: '1px solid #fff',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Отказаться
        </button>
        <button
          onClick={handleAccept}
          style={{
            padding: '8px 16px',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Принять
        </button>
      </div>
    </div>
  );
}