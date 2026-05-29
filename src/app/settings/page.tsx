'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [language, setLanguage] = useState('ru');
  const [theme, setTheme] = useState('light');

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Настройки</h1>

      {/* Language */}
      <div style={{ marginTop: 20 }}>
        <h3>Язык / Language</h3>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Theme */}
      <div style={{ marginTop: 20 }}>
        <h3>Тема</h3>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Светлая</option>
          <option value="dark">Тёмная</option>
        </select>
      </div>

      {/* Request role */}
      <div style={{ marginTop: 20 }}>
        <h3>Права доступа</h3>
        <button onClick={() => alert('Запрос отправлен администратору')}>
          Запросить права редактора
        </button>
        <button
          onClick={() => alert('Запрос отправлен администратору')}
          style={{ marginLeft: 8 }}
        >
          Запросить права капитана
        </button>
      </div>

      {/* Cookie consent */}
      <div style={{ marginTop: 20, padding: 12, background: '#f0f0f0', borderRadius: 8 }}>
        <p>Мы используем cookie для улучшения работы сайта.</p>
        <button onClick={() => alert('Cookie приняты')}>Принять</button>
      </div>
    </div>
  );
}