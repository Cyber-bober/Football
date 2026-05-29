import { User, UserContacts } from '../../../domain/entities/User';
import { Role } from '../../../domain/value-objects/Role';
import { PlayerPosition } from '../../../domain/value-objects/PlayerPosition';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { prisma } from '../client';

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const record: any = await prisma.user.findUnique({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByUsername(username: string): Promise<User | null> {
    const record: any = await prisma.user.findUnique({ where: { username } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByTeamId(teamId: string): Promise<User[]> {
    const records: any[] = await prisma.user.findMany({ where: { teamId } });
    return records.map((r) => this.toDomain(r));
  }

  async create(user: User): Promise<User> {
    const created: any = await prisma.user.create({
      data: {
        id: user.id,
        username: user.username,
        passwordHash: '',
        fullName: user.fullName,
        birthDate: user.birthDate,
        city: user.city,
        role: user.role,
        position: user.position,
        photos: user.photos,
        contacts: user.contacts as any,
        teamId: user.teamId,
        stats: user.stats as any,
      },
    });
    return this.toDomain(created);
  }

  async update(user: User): Promise<User> {
    const updated: any = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: user.username,
        fullName: user.fullName,
        birthDate: user.birthDate,
        city: user.city,
        role: user.role,
        position: user.position,
        photos: user.photos,
        contacts: user.contacts as any,
        teamId: user.teamId,
        stats: user.stats as any,
      },
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await prisma.user.count({ where: { username } });
    return count > 0;
  }

  async findAll(filter?: { role?: string; teamId?: string }): Promise<User[]> {
    const where: any = {};
    if (filter?.role) where.role = filter.role;
    if (filter?.teamId) where.teamId = filter.teamId;

    const records: any[] = await prisma.user.findMany({ where });
    return records.map((r) => this.toDomain(r));
  }

  private toDomain(record: any): User {
    return new User(
      record.id,
      record.username,
      record.fullName,
      record.birthDate,
      record.city,
      record.role as Role,
      record.position as PlayerPosition ?? undefined,
      record.photos ?? [],
      record.contacts as UserContacts ?? {},
      record.teamId ?? undefined,
      record.stats as Record<string, number> ?? undefined,
    );
  }
}