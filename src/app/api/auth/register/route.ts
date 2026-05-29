import { NextRequest, NextResponse } from 'next/server';
import { RegisterUseCase } from '@/application/use-cases/auth/RegisterUseCase';
import { PrismaUserRepository } from '@/infrastructure/database/repositories/PrismaUserRepository';
import bcrypt from 'bcryptjs';
import { prisma } from '@/infrastructure/database/client';

export async function POST(req: NextRequest) {
  const { username, password, fullName, city, birthDate } = await req.json();

  try {
    // Create user via use case
    const userRepo = new PrismaUserRepository();
    const useCase = new RegisterUseCase(userRepo);

    const userDTO = await useCase.execute({
      username,
      password,
      fullName,
      birthDate: new Date(birthDate),
      city,
    });

    // Set password hash directly via prisma (bypasses domain for auth)
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: userDTO.id },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true, user: userDTO });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}