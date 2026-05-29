/**
 * Prisma implementation of IChatRepository.
 * Maps between Prisma DB records and domain ChatMessage entities.
 */
import { ChatMessage } from '../../../domain/entities/ChatMessage';
import { IChatRepository } from '../../../domain/interfaces/IChatRepository';
import { prisma } from '../client';
import { PrismaChatMessage } from '../prisma/types';

export class PrismaChatRepository implements IChatRepository {
  async getConversation(
    userId1: string,
    userId2: string,
    limit: number = 50,
  ): Promise<ChatMessage[]> {
    const records = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
    return records.map((r: PrismaChatMessage) => this.toDomain(r));
  }

  async send(message: ChatMessage): Promise<ChatMessage> {
    const created = await prisma.chatMessage.create({
      data: {
        id: message.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        text: message.text,
        isRead: message.isRead,
      },
    });
    return this.toDomain(created as PrismaChatMessage);
  }

  async markAsRead(messageId: string): Promise<void> {
    await prisma.chatMessage.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return prisma.chatMessage.count({
      where: { receiverId: userId, isRead: false },
    });
  }

  async getUserConversations(userId: string): Promise<ChatMessage[]> {
    const records = await prisma.chatMessage.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return records.map((r: PrismaChatMessage) => this.toDomain(r));
  }

  async delete(messageId: string): Promise<void> {
    await prisma.chatMessage.delete({ where: { id: messageId } });
  }

  // ─── Private mapper ───────────────────────────────

  private toDomain(record: PrismaChatMessage): ChatMessage {
    return new ChatMessage(
      record.id,
      record.senderId,
      record.receiverId,
      record.text,
      record.createdAt,
      record.isRead,
    );
  }
}