import { Request, Response } from 'express';
import { GetMessagesHandler } from '../../core/use-cases/handlers/getmessage.handler';
import { GetMessagesQuery } from '../../core/use-cases/queries/getmessage.query';
import { ConversationRepository } from '../../infra/repositories/conversation.repository';
import { ConversationService } from '../../core/services/conversation.service';
import { GetOrCreateConversationHandler } from '../../core/use-cases/handlers/getorcreateconversation.handler';
import { GetOrCreateConversationCommand } from '../../core/use-cases/commands/getorcreateconversation.command';

export class MessageController {
    constructor(private readonly getMessagesHandler: GetMessagesHandler) { }

    async GetMessages(req: Request, res: Response): Promise<void> {
        // const { phone, page, limit } = req.params || req.body;
        const phone = req.body.phone || req.params.phone;
        const page = Number(req.body.page || req.params.page || 1);
        const limit = Number(req.body.limit || req.params.limit || 20);
        console.log(Number(page), Number(limit), phone)

        const conversationHandler = new GetOrCreateConversationHandler(new ConversationService(new ConversationRepository()));

        const conversation = await conversationHandler.handle(
            new GetOrCreateConversationCommand(14, 'Mr Customer', phone, 'user@example.com')
        );
        if (!conversation?.conversationId) {
            res.status(404).json({ message: 'Conversation not found' });
            return;
        }

        const query = new GetMessagesQuery(conversation.conversationId, page, limit);
        const messages = await this.getMessagesHandler.handle(query);
        messages.messages.reverse();

        res.json(messages);
        return;
    }
}