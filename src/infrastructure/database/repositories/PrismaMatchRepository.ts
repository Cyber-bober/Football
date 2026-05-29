import { Match, MatchStatus, MatchScore, MatchStats } from '../../../domain/entities/Match';
import { IMatchRepository } from '../../../domain/interfaces/IMatchRepository';
import { prisma } from '../client';

export class PrismaMatchRepository implements IMatchRepository {
  async findById(id: string): Promise<Match | null> {
    const record: any = await prisma.match.findUnique({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByTeamId(teamId: string): Promise<Match[]> {
    const records: any[] = await prisma.match.findMany({
      where: { OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }] },
      orderBy: { date: 'desc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  async findByStatus(status: MatchStatus): Promise<Match[]> {
    const records: any[] = await prisma.match.findMany({
      where: { status },
      orderBy: { date: 'asc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  async findUpcoming(limit: number = 10): Promise<Match[]> {
    const records: any[] = await prisma.match.findMany({
      where: { status: MatchStatus.SCHEDULED, date: { gte: new Date() } },
      orderBy: { date: 'asc' },
      take: limit,
    });
    return records.map((r) => this.toDomain(r));
  }

  async findByDateRange(start: Date, end: Date): Promise<Match[]> {
    const records: any[] = await prisma.match.findMany({
      where: { date: { gte: start, lte: end } },
      orderBy: { date: 'asc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  async create(match: Match): Promise<Match> {
    const created: any = await prisma.match.create({
      data: {
        id: match.id,
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        date: match.date,
        status: match.status,
        score: match.score as any,
        stats: match.stats as any,
        venue: match.venue,
      },
    });
    return this.toDomain(created);
  }

  async update(match: Match): Promise<Match> {
    const updated: any = await prisma.match.update({
      where: { id: match.id },
      data: {
        date: match.date,
        status: match.status,
        score: match.score as any,
        stats: match.stats as any,
        venue: match.venue,
      },
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.match.delete({ where: { id } });
  }

  async findRecent(limit: number = 5): Promise<Match[]> {
    const records: any[] = await prisma.match.findMany({
      where: { status: MatchStatus.FINISHED },
      orderBy: { date: 'desc' },
      take: limit,
    });
    return records.map((r) => this.toDomain(r));
  }

  private toDomain(record: any): Match {
    return new Match(
      record.id,
      record.homeTeamId,
      record.awayTeamId,
      record.date,
      record.status as MatchStatus,
      record.score as MatchScore ?? undefined,
      record.stats as MatchStats ?? undefined,
      record.venue ?? undefined,
    );
  }
}