import { ConversationRepository } from '../../infra/repositories/conversation.repository';

export class ConversationService {
    constructor(private readonly conversationRepo: ConversationRepository) { }

    async getOrCreate(userId: number, user_phone?: string | null, user_email?: string | null) {
        return await this.conversationRepo.getOrCreateConversation(userId, user_phone, user_email);
    }
}