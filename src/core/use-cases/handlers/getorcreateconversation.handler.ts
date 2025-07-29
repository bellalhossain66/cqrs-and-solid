import { ConversationService } from '../../services/conversation.service';
import { GetOrCreateConversationCommand } from '../commands/getorcreateconversation.command';

export class GetOrCreateConversationHandler {
    constructor(private readonly service: ConversationService) { }

    async handle(command: GetOrCreateConversationCommand) {
        const { userId, user_phone, user_email } = command;
        return await this.service.getOrCreate(userId, user_phone, user_email);
    }
}