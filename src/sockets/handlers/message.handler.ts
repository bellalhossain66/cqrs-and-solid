import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { SendMessageHandler } from '../../handlers/sendmessage.handler';
import { ChatService } from '../../services/chat.service';
import { MySQLMessageRepository } from '../../repositories/message.repository';
import { SendMessageCommand } from '../../commands/sendmessage.command';
import { connectedAgents } from '../../utils/connectedagents';
import { GetOrCreateConversationHandler } from '../../handlers/getorcreateconversation.handler';
import { GetOrCreateConversationCommand } from '../../commands/getorcreateconversation.command';
import { userAgentMap } from '../../utils/useragentmap';

const handler = new SendMessageHandler(new ChatService(new MySQLMessageRepository()));

export const handleSendMessage = (io: Server, socket: Socket, conversationHandler: GetOrCreateConversationHandler) => {
    const { userPhone: phone, type, token } = socket.handshake.query;

    socket.on('send_message', async (data) => {
        const clientType = type as 'user' | 'agent';
        const receiverPhone = clientType === 'agent' ? data.receiverPhone : phone;
        const conversation = await conversationHandler.handle(
            new GetOrCreateConversationCommand(123, receiverPhone as string, 'user@example.com')
        );

        const userMessage = {
            senderPhone: phone as string,
            senderType: clientType,
            content: data.message,
            senderId: 0,
            conversationId: conversation?.conversationId || uuidv4(),
        };

        try {
            const command = new SendMessageCommand(
                userMessage.senderId,
                userMessage.senderPhone,
                userMessage.conversationId,
                userMessage.content,
                userMessage.senderType
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