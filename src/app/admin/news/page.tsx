/**
 * Admin news management page.
 * Access: EDITOR or ADMIN only.
 * Create, edit, delete, publish/unpublish news posts.
 */
import { getServerSession } from 'next-auth';
import { authOptions } from '@/infrastructure/auth/authOptions';
import { PrismaNewsRepository } from '@/infrastructure/database/repositories/PrismaNewsRepository';
import { redirect } from 'next/navigation';
import NewsAdminPanel from '@/presentation/components/news/NewsAdminPanel';

export default async function AdminNewsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/signin');

  const role = (session.user as any).role;
  if (role !== 'ADMIN' && role !== 'EDITOR') {
    return <div>Access denied. Editors and Admins only.</div>;
  }

  const newsRepo = new PrismaNewsRepository();
  const { posts, total, page, totalPages } = await newsRepo.findAll(1, 20);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>Управление новостями</h1>
      <NewsAdminPanel
        posts={posts.map((p) => ({
          id: p.id,
          title: p.title,
          isPublished: p.isPublished,
          createdAt: p.createdAt.toISOString(),
        }))}
        total={total}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}