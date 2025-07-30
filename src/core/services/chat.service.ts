import { IMessageRepository } from '../domain/interfaces/message.interface';

export class ChatService {
    constructor(private readonly messageRepo: IMessageRepository) { }

    async sendMessage(
        conversationId: string,
        customer_id: number,
        sender_type: 'user' | 'agent',
        message: string,
        message_type: 'text' | 'image' | 'video' | 'file' | 'system'
    ) {
        await this.messageRepo.saveMessage(conversationId, customer_id, sender_type, message, message_type);
    }
}