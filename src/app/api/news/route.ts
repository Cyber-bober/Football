import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/infrastructure/auth/authOptions';
import { PublishNewsUseCase } from '@/application/use-cases/news/PublishNewsUseCase';
import { PrismaNewsRepository } from '@/infrastructure/database/repositories/PrismaNewsRepository';
import { PrismaUserRepository } from '@/infrastructure/database/repositories/PrismaUserRepository';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  const newsRepo = new PrismaNewsRepository();
  const result = await newsRepo.findPublished(page, pageSize);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== 'ADMIN' && role !== 'EDITOR') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { title, content } = await req.json();
  const useCase = new PublishNewsUseCase(new PrismaNewsRepository(), new PrismaUserRepository());

  try {
    const post = await useCase.createPost({ title, content }, (session.user as any).id);
    return NextResponse.json(post);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const useCase = new PublishNewsUseCase(new PrismaNewsRepository(), new PrismaUserRepository());
  await useCase.deletePost(id, (session.user as any).id);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const useCase = new PublishNewsUseCase(new PrismaNewsRepository(), new PrismaUserRepository());
  const post = await useCase.togglePublish(id, (session.user as any).id);
  return NextResponse.json(post);
}