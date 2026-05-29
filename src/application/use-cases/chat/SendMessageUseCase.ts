import { ChatMessage } from '../../../domain/entities/ChatMessage';
import { IChatRepository } from '../../../domain/interfaces/IChatRepository';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { ChatMessageDTO, ConversationPreviewDTO, SendMessageInput, toChatMessageDTO } from '../../dtos/ChatDTO';

/**
 * Use case: Chat messaging.
 * Users can send messages to each other.
 * Anyone registered can use chat.
 */
export class SendMessageUseCase {
  constructor(
    private readonly chatRepo: IChatRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  /** Send a message to another user */
  async sendMessage(input: SendMessageInput, senderId: string): Promise<ChatMessageDTO> {
    const sender = await this.userRepo.findById(senderId);
    if (!sender) throw new Error('Sender not found');

    const receiver = await this.userRepo.findById(input.receiverId);
    if (!receiver) throw new Error('Receiver not found');

    const message = new ChatMessage(
      crypto.randomUUID(),
      senderId,
      input.receiverId,
      input.text,
      new Date(),
    );

    message.validate();
    const saved = await this.chatRepo.send(message);

    return toChatMessageDTO(saved, sender.fullName);
  }

  /** Get conversation between current user and another user */
  async getConversation(userId: string, otherUserId: string, limit: number = 50): Promise<ChatMessageDTO[]> {
    const messages = await this.chatRepo.getConversation(userId, otherUserId, limit);

    // Collect unique sender IDs for name mapping
    const userIds = [...new Set(messages.map(m => m.senderId))];
    const users = await Promise.all(userIds.map(id => this.userRepo.findById(id)));
    const userMap = new Map(users.filter(Boolean).map(u => [u!.id, u!.fullName]));

    return messages.map(m => toChatMessageDTO(m, userMap.get(m.senderId) ?? 'Unknown'));
  }

  /** Mark a message as read */
  async markAsRead(messageId: string, readerId: string): Promise<void> {
    const messages = await this.chatRepo.getConversation(readerId, readerId);
    const message = messages.find(m => m.id === messageId);
    if (!message) throw new Error('Message not found');
    if (message.receiverId !== readerId) throw new Error('Can only mark your own received messages as read');

    await this.chatRepo.markAsRead(messageId);
  }

  /** Get user's conversation list (previews) */
  async getConversationList(userId: string): Promise<ConversationPreviewDTO[]> {
    const messages = await this.chatRepo.getUserConversations(userId);

    // Group by conversation partner
    const partnerMap = new Map<string, ChatMessage>();
    for (const msg of messages) {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!partnerMap.has(partnerId) || msg.createdAt > partnerMap.get(partnerId)!.createdAt) {
        partnerMap.set(partnerId, msg);
      }
    }

    // Build previews
    const previews: ConversationPreviewDTO[] = [];
    for (const [partnerId, lastMsg] of partnerMap) {
      const partner = await this.userRepo.findById(partnerId);
      const unreadCount = await this.chatRepo.getUnreadCount(userId);

      previews.push({
        otherUserId: partnerId,
        otherUserName: partner?.fullName ?? 'Unknown',
        lastMessage: lastMsg.text.substring(0, 100),
        lastMessageTime: lastMsg.createdAt.toISOString(),
        unreadCount,
      });
    }

    return previews.sort((a, b) => b.lastMessageTime.localeCompare(a.lastMessageTime));
  }
}