import { IMessageRepository } from '../interfaces/message.interface';

export class ChatService {
    constructor(private readonly messageRepo: IMessageRepository) { }

    async sendMessage(
        senderId: number,
        senderPhone: string,
        conversationId: string,
        content: string,
        senderType: 'user' | 'agent'
    ): Promise<void> {
        await this.messageRepo.saveMessage(conversationId, senderId, senderPhone, senderType, content);
    }
}