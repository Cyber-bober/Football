import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/infrastructure/auth/authOptions';
import { SendMessageUseCase } from '@/application/use-cases/chat/SendMessageUseCase';
import { PrismaChatRepository } from '@/infrastructure/database/repositories/PrismaChatRepository';
import { PrismaUserRepository } from '@/infrastructure/database/repositories/PrismaUserRepository';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Return empty messages for now — will be extended
  return NextResponse.json({ messages: [] });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { text } = await req.json();
  const useCase = new SendMessageUseCase(
    new PrismaChatRepository(),
    new PrismaUserRepository(),
  );

  try {
    const message = await useCase.sendMessage(
      { receiverId: 'default', text },
      (session.user as any).id,
    );
    return NextResponse.json(message);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}