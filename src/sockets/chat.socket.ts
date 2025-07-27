import { Server, Socket } from 'socket.io';
import { SendMessageHandler } from '../handlers/sendmessage.handler';
import { ChatService } from '../services/chat.service';
import { MySQLMessageRepository } from '../repositories/message.repository';
import { SendMessageCommand } from '../commands/sendmessage.command';
import { v4 as uuidv4 } from 'uuid';
import { GetMessagesQuery } from '../queries/getmessage.query';
import { GetMessagesHandler } from '../handlers/getmessage.handler';
import { ConversationRepository } from '../repositories/conversation.repository';
import { ConversationService } from '../services/conversation.service';
import { GetOrCreateConversationHandler } from '../handlers/getorcreateconversation.handler';
import { GetOrCreateConversationCommand } from '../commands/getorcreateconversation.command';

export const RegisterChatSocket = (io: Server) => {
    const messageRepo = new MySQLMessageRepository();
    const service = new ChatService(messageRepo);
    const handler = new SendMessageHandler(service);
    const getMessagesHandler = new GetMessagesHandler(messageRepo);
    const conversationHandler = new GetOrCreateConversationHandler(new ConversationService(new ConversationRepository()));
    const connectedAgents: Map<string, Socket[]> = new Map();
    let conversation: any;

    io.on('connection', async (socket: Socket) => {
        const { token, userPhone: phone, type } = socket.handshake.query;
        if (token !== 'COMPANY-001' || !phone || typeof phone !== 'string') return socket.disconnect();

        console.log(token, phone);

        if (type === 'agent') {
            socket.join(`agent_${phone}`);
            if (!connectedAgents.has(token)) {
                connectedAgents.set(token, []);
            }
            connectedAgents.get(token)?.push(socket);

            socket.on('disconnect', () => {
                const agents = connectedAgents.get(token);
                if (agents) {
                    connectedAgents.set(
                        token,
                        agents.filter((s) => s.id !== socket.id)
                    );
                }
            });
        } else {
            socket.join(`user_${phone}`);

            conversation = await conversationHandler.handle(
                new GetOrCreateConversationCommand(123, phone, 'user@example.com')
            );
        }

        socket.on('get_messages', async ({ page = 1, limit = 20 }) => {
            try {
                const query = new GetMessagesQuery(conversation.conversationId, page, limit);

                const messages = await getMessagesHandler.handle(query);
                messages.messages.reverse();
                socket.emit('messages', messages);
            } catch (err) {
                socket.emit('error', { message: 'Failed to load messages' });
            }
        });

        socket.on('send_message', async (data) => {
            console.log('type:', type)
            const clientType = type as 'user' | 'agent';
            const receiverPhone = clientType === 'agent' ? data.receiverPhone : phone;
            if (!conversation && clientType == 'agent' && !data.receiverPhone) {
                conversation = await conversationHandler.handle(
                    new GetOrCreateConversationCommand(123, receiverPhone, 'user@example.com')
                );
            }
            const userMessage = {
                senderPhone: phone,
                senderType: clientType,
                content: data.message,
                senderId: 0,
                conversationId: conversation ? conversation.conversationId : uuidv4(),
            };
            const { senderId, senderPhone, conversationId, content, senderType } = userMessage;

            console.log(data, userMessage)

            try {
                const command = new SendMessageCommand(senderId, senderPhone, conversationId, content, senderType);
                await handler.handle(command);

                console.log(`user_${phone}`, `agent_${phone}`)
                if (type === 'user') {
                    const agentSockets = connectedAgents.get(token) || [];
                    agentSockets.forEach(agentSocket => {
                        agentSocket.emit('new_message', {
                            senderId,
                            senderPhone,
                            conversationId,
                            content,
                            senderType,
                            createdAt: new Date()
                        });
                    });
                } else {
                    io.to(`user_${receiverPhone}`).emit('new_message', {
                        senderId,
                        senderPhone,
                        conversationId,
                        content,
                        senderType,
                        createdAt: new Date()
                    });
                }
            } catch (err) {
                socket.emit('error', { error: 'Message failed to send' });
            }
        });
    });
};