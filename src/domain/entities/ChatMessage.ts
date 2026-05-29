/**
 * Chat message entity.
 * Represents a single message between two users.
 * Used for 1-on-1 chats (player to player, admin to user).
 */
export class ChatMessage {
  constructor(
    public readonly id: string,
    public readonly senderId: string,
    public readonly receiverId: string,
    public text: string,
    public createdAt: Date = new Date(),
    public isRead: boolean = false,
  ) {}

  /** Mark message as read by receiver */
  markAsRead(): void {
    this.isRead = true;
  }

  /** Check if message is from a specific user */
  isFrom(userId: string): boolean {
    return this.senderId === userId;
  }

  /** Check if message is addressed to a specific user */
  isTo(userId: string): boolean {
    return this.receiverId === userId;
  }

  /** Validate message content */
  validate(): void {
    if (!this.text.trim()) {
      throw new Error('Message cannot be empty');
    }
    if (this.text.length > 2000) {
      throw new Error('Message too long (max 2000 characters)');
    }
  }
}