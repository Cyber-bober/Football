import { ChatMessage } from '../entities/ChatMessage';

/**
 * Repository interface for ChatMessage aggregate.
 * Supports 1-on-1 messaging between users.
 */
export interface IChatRepository {
  /** Get conversation between two users (ordered by time) */
  getConversation(userId1: string, userId2: string, limit?: number): Promise<ChatMessage[]>;

  /** Send a new message */
  send(message: ChatMessage): Promise<ChatMessage>;

  /** Mark message as read */
  markAsRead(messageId: string): Promise<void>;

  /** Get unread message count for a user */
  getUnreadCount(userId: string): Promise<number>;

  /** Get all conversations for a user (last message preview) */
  getUserConversations(userId: string): Promise<ChatMessage[]>;

  /** Delete message (sender or admin) */
  delete(messageId: string): Promise<void>;
}