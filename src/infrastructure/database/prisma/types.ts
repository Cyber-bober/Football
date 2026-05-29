/**
 * Raw Prisma record types for repository mappers.
 * Used ONLY in infrastructure layer — never leak to domain/application.
 */

export interface PrismaUser {
  id: string;
  username: string;
  passwordHash: string;
  fullName: string;
  birthDate: Date;
  city: string;
  role: string;
  position: string | null;
  photos: string[];
  contacts: any;
  stats: any;
  teamId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaTeam {
  id: string;
  name: string;
  logoUrl: string | null;
  captainId: string | null;
  stats: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaMatch {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  status: string;
  score: any;
  stats: any;
  venue: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaNewsPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string | null;
  matchId: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  isRead: boolean;
  createdAt: Date;
}