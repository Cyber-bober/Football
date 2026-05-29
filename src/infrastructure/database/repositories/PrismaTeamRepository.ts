import { Team, TeamStats } from '../../../domain/entities/Team';
import { ITeamRepository } from '../../../domain/interfaces/ITeamRepository';
import { prisma } from '../client';

export class PrismaTeamRepository implements ITeamRepository {
  async findById(id: string): Promise<Team | null> {
    const record: any = await prisma.team.findUnique({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findAll(): Promise<Team[]> {
    const records: any[] = await prisma.team.findMany({ orderBy: { name: 'asc' } });
    return records.map((r) => this.toDomain(r));
  }

  async create(team: Team): Promise<Team> {
    const created: any = await prisma.team.create({
      data: {
        id: team.id,
        name: team.name,
        logoUrl: team.logoUrl,
        captainId: team.captainId,
        stats: team.stats as any,
      },
    });
    return this.toDomain(created);
  }

  async update(team: Team): Promise<Team> {
    const updated: any = await prisma.team.update({
      where: { id: team.id },
      data: {
        name: team.name,
        logoUrl: team.logoUrl,
        captainId: team.captainId,
        stats: team.stats as any,
      },
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.team.delete({ where: { id } });
  }

  async findByCaptainId(captainId: string): Promise<Team | null> {
    const record: any = await prisma.team.findFirst({ where: { captainId } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async searchByName(query: string): Promise<Team[]> {
    const records: any[] = await prisma.team.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      take: 10,
    });
    return records.map((r) => this.toDomain(r));
  }

  private toDomain(record: any): Team {
    return new Team(
      record.id,
      record.name,
      record.logoUrl ?? undefined,
      [],
      record.captainId ?? undefined,
      record.stats as TeamStats ?? undefined,
    );
  }
}