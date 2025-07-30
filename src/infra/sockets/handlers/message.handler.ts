import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { ChatService } from '../../../core/services/chat.service';
import { MySQLMessageRepository } from '../../repositories/message.repository';
import { SendMessageCommand } from '../../../core/use-cases/commands/sendmessage.command';
import { connectedAgents } from '../../cache/connectedagents';
import { GetOrCreateConversationCommand } from '../../../core/use-cases/commands/getorcreateconversation.command';
import { SendMessageHandler } from '../../../core/use-cases/handlers/sendmessage.handler';
import { GetOrCreateConversationHandler } from '../../../core/use-cases/handlers/getorcreateconversation.handler';
import { userAgentMap } from '../../cache/useragentmap';

const handler = new SendMessageHandler(new ChatService(new MySQLMessageRepository()));

export const handleSendMessage = (io: Server, socket: Socket, conversationHandler: GetOrCreateConversationHandler) => {
    const { userPhone: phone, type, token } = socket.handshake.query;

    socket.on('send_message', async (data) => {
        const clientType = type as 'user' | 'agent';
        const receiverPhone = clientType === 'agent' ? data.receiverPhone : phone;

        const conversation = await conversationHandler.handle(
            new GetOrCreateConversationCommand(14, 'Mr Customer', phone as string, 'user@example.com')
        );

        if (!conversation?.conversationId) {
            socket.emit('error', { message: 'Conversation not found' });
            return;
        }

        const userMessage = {
            conversationId: conversation?.conversationId,
            customer_id: conversation?.customer_id,
            sender_type: clientType,
            message: data.message,
            message_type: data.message_type
        };

        try {
            const command = new SendMessageCommand(
                userMessage.conversationId,
                userMessage.customer_id,
                userMessage.sender_type,
                userMessage.message,
                userMessage.message_type
            );
            await handler.handle(command);

            if (clientType === 'user') {
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
            } else {
                const receiverPhone = data.receiverPhone;
                io.to(`user_${receiverPhone}`).emit('new_message', { ...userMessage, createdAt: new Date() });
            }
        } catch (err) {
            socket.emit('error', { error: 'Message failed to send' });
        }
    });
};