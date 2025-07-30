import { ConversationService } from '../../services/conversation.service';
import { GetOrCreateConversationCommand } from '../commands/getorcreateconversation.command';

export class GetOrCreateConversationHandler {
    constructor(private readonly service: ConversationService) { }

    async handle(command: GetOrCreateConversationCommand) {
        const { company_id, name, phone, email } = command;
        return await this.service.getOrCreate(company_id, name, phone, email);
    }
}