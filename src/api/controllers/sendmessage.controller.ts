import { Request, Response } from 'express';
import { ConversationRepository } from '../../infra/repositories/conversation.repository';
import { ConversationService } from '../../core/services/conversation.service';
import { GetOrCreateConversationHandler } from '../../core/use-cases/handlers/getorcreateconversation.handler';
import { GetOrCreateConversationCommand } from '../../core/use-cases/commands/getorcreateconversation.command';
import { SendMessageCommand } from '../../core/use-cases/commands/sendmessage.command';
import { MySQLMessageRepository } from '../../infra/repositories/message.repository';
import { ChatService } from '../../core/services/chat.service';
import { SendMessageHandler } from '../../core/use-cases/handlers/sendmessage.handler';
import { userAgentMap } from '../../infra/cache/useragentmap';
import { connectedAgents } from '../../infra/cache/connectedagents';

export class SendMessageController {
    async SendMessages(req: Request, res: Response): Promise<void> {
        const { message, message_type, phone, token } = req.body;
        const sender_type = 'user' as 'user' | 'agent';

        const conversationHandler = new GetOrCreateConversationHandler(new ConversationService(new ConversationRepository()));
        const conversation = await conversationHandler.handle(
            new GetOrCreateConversationCommand(14, 'Mr Customer', phone as string, 'user@example.com')
        );

        if (!conversation?.conversationId) {
            res.status(404).json({ message: 'Company not found' });
            return;
        }

        const userMessage = {
            conversationId: conversation?.conversationId,
            customer_id: conversation?.customer_id,
            sender_type: sender_type,
            message: message,
            message_type: message_type
        };

        try {
            const command = new SendMessageCommand(
                userMessage.conversationId,
                userMessage.customer_id,
                userMessage.sender_type,
                userMessage.message,
                userMessage.message_type
            );
            const sendMessageHandler = new SendMessageHandler(new ChatService(new MySQLMessageRepository()));
            await sendMessageHandler.handle(command);

            let assignedAgentId = userAgentMap.getAgentId(phone as string);

            if (!assignedAgentId) {
                const agentSockets = connectedAgents.getAll(token as string);
                if (agentSockets.length > 0) {
                    const randomAgent = agentSockets[0];
                    assignedAgentId = randomAgent.data?.agentId || randomAgent.handshake.query.agentId;
                    console.log('agentSockets: ', randomAgent.data, randomAgent.handshake.query);
                    if (assignedAgentId) {
                        userAgentMap.assign(phone as string, assignedAgentId);
                        console.log('userAgentMap: ', userAgentMap);
                    }
                }
            }

            if (assignedAgentId && connectedAgents.has(token as string, assignedAgentId)) {
                const agentSocket = connectedAgents.get(token as string, assignedAgentId);
                agentSocket?.emit('new_message', { ...userMessage, createdAt: new Date() });
            } else {
                console.log('No available agent found');
            }

        } catch (err) {
            res.status(404).json({ error: 'Message failed to send' });
            return;
        }
    }
}