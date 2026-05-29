import { ChatMessage } from '../../domain/entities/ChatMessage';

/** Single chat message for API */
export interface ChatMessageDTO {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

/** Conversation preview (last message) */
export interface ConversationPreviewDTO {
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

/** Input for sending a message */
export interface SendMessageInput {
  receiverId: string;
  text: string;
}

/**
 * Maps domain ChatMessage to API DTO.
 */
export function toChatMessageDTO(
  message: ChatMessage,
  senderName: string,
): ChatMessageDTO {
  return {
    id: message.id,
    senderId: message.senderId,
    senderName,
    receiverId: message.receiverId,
    text: message.text,
    createdAt: message.createdAt.toISOString(),
    isRead: message.isRead,
  };
}