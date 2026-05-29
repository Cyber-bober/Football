'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PostSummary {
  id: string;
  title: string;
  isPublished: boolean;
  createdAt: string;
}

interface Props {
  posts: PostSummary[];
  total: number;
  page: number;
  totalPages: number;
}

export default function NewsAdminPanel({ posts, total, page, totalPages }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreate = async () => {
    const res = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      setTitle('');
      setContent('');
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete post?')) return;
    await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
    router.refresh();
  };

  const handleToggle = async (id: string) => {
    await fetch(`/api/news?id=${id}`, { method: 'PATCH' });
    router.refresh();
  };

  return (
    <div>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <h3>{editingId ? 'Edit' : 'New Post'}</h3>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <button onClick={handleCreate} style={{ padding: '8px 16px' }}>
          {editingId ? 'Update' : 'Publish'}
        </button>
        {editingId && (
          <button
            onClick={() => { setEditingId(null); setTitle(''); setContent(''); }}
            style={{ padding: '8px 16px', marginLeft: 8 }}
          >
            Cancel
          </button>
        )}
      </div>

      <h3>All Posts ({total})</h3>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: '1px solid #eee',
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <strong>{post.title}</strong>
            <span style={{ marginLeft: 8, color: post.isPublished ? 'green' : 'red', fontSize: 12 }}>
              {post.isPublished ? 'Published' : 'Hidden'}
            </span>
            <div style={{ fontSize: 12, color: '#666' }}>{post.createdAt}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => handleToggle(post.id)} style={{ padding: '4px 8px' }}>
              {post.isPublished ? 'Hide' : 'Publish'}
            </button>
            <button onClick={() => handleDelete(post.id)} style={{ padding: '4px 8px', color: 'red' }}>
              Delete
            </button>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => router.push(`/admin/news?page=${p}`)}
            style={{
              padding: '4px 12px',
              background: p === page ? '#0070f3' : '#f0f0f0',
              color: p === page ? 'white' : 'black',
              border: 'none',
              borderRadius: 4,
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
