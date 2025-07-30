import { ChatService } from '../../services/chat.service';
import { SendMessageCommand } from '../commands/sendmessage.command';

export class SendMessageHandler {
    constructor(private readonly chatService: ChatService) { }

    async handle(command: SendMessageCommand): Promise<void> {
        await this.chatService.sendMessage(
            command.conversationId,
            command.customer_id,
            command.sender_type,
            command.message,
            command.message_type
        );
    }
}