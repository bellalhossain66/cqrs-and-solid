import { ConversationRepository } from '../../infra/repositories/conversation.repository';

export class ConversationService {
    constructor(private readonly conversationRepo: ConversationRepository) { }

    async getOrCreate(company_id: number, name: string|null, phone?: string | null, email?: string | null) {
        return await this.conversationRepo.getOrCreateConversation(company_id, name, phone, email);
    }
}