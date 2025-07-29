import { v4 as uuidv4 } from 'uuid';
import Conversation from '../db/models/conversation.model';

export class ConversationRepository {
    async getOrCreateConversation(userId: number, user_phone?: string | null, user_email?: string | null) {
        let conversation = await Conversation.findOne({
            where: { userId, user_phone, user_email },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                userId,
                user_phone,
                user_email,
                conversationId: uuidv4(),
            });
        }

        return conversation;
    }
}