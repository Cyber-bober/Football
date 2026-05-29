/**
 * Main page — news feed with tabs.
 * Tabs: News, Matches Calendar, Live Text Broadcast.
 */
import { PrismaNewsRepository } from '@/infrastructure/database/repositories/PrismaNewsRepository';
import { PrismaMatchRepository } from '@/infrastructure/database/repositories/PrismaMatchRepository';
import Link from 'next/link';
import MatchCalendar from '@/presentation/components/calendar/MatchCalendar';

export default async function HomePage() {
  const newsRepo = new PrismaNewsRepository();
  const matchRepo = new PrismaMatchRepository();

  const { posts } = await newsRepo.findPublished(1, 10);
  const upcomingMatches = await matchRepo.findUpcoming(5);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>Football Hub</h1>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, borderBottom: '1px solid #ddd', paddingBottom: 12 }}>
        <a href="#news" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#0070f3' }}>Новости</a>
        <a href="#calendar" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#0070f3' }}>Календарь матчей</a>
        <a href="#live" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#0070f3' }}>Текстовая трансляция</a>
      </div>

      {/* News feed */}
      <section id="news">
        <h2>Новости</h2>
        {posts.length === 0 ? (
          <p>Новостей пока нет</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <h3>{post.title}</h3>
              <p>{post.getPreview(200)}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: 14 }}>
                <span>{post.createdAt.toLocaleDateString()}</span>
                <span>{post.category}</span>
              </div>
              {post.matchId && (
                <Link href={`/matches/${post.matchId}`} style={{ color: '#0070f3', fontSize: 14 }}>
                  Смотреть матч →
                </Link>
              )}
            </div>
          ))
        )}
        <Link href="/news" style={{ color: '#0070f3' }}>Все новости →</Link>
      </section>

      {/* Calendar */}
      <section id="calendar" style={{ marginTop: 40 }}>
        <h2>Ближайшие матчи</h2>
        <MatchCalendar matches={upcomingMatches} />
      </section>

      {/* Live text broadcast placeholder */}
      <section id="live" style={{ marginTop: 40 }}>
        <h2>Текстовая трансляция</h2>
        <p>Сейчас нет активных трансляций</p>
      </section>
    </div>
  );
}