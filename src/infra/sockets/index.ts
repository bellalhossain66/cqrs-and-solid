import { Server, Socket } from 'socket.io';
import { validateSocketConnection } from '../../shared/middleware/auth.socket';
import { handleSendMessage } from './handlers/message.handler';
import { handleGetMessages } from './handlers/getmessages.handler';
import { connectedAgents } from '../cache/connectedagents';
import { ConversationService } from '../../core/services/conversation.service';
import { ConversationRepository } from '../repositories/conversation.repository';
import { userAgentMap } from '../cache/useragentmap';
import { GetOrCreateConversationHandler } from '../../core/use-cases/handlers/getorcreateconversation.handler';

export const RegisterChatSocket = (io: Server) => {
    const conversationHandler = new GetOrCreateConversationHandler(
        new ConversationService(new ConversationRepository())
    );

    io.on('connection', async (socket: Socket) => {
        const { token, userPhone: phone, type } = socket.handshake.query;
        if (!validateSocketConnection(socket)) return;

        if (type === 'agent') {
            const agentId = phone;
            if (!agentId || typeof agentId !== 'string') {
                return socket.disconnect();
            }

            socket.data.agentId = agentId;
            socket.join(`agent_${agentId}`);
            connectedAgents.add(token as string, agentId, socket);
            console.log('connectedAgents: ', connectedAgents);

            socket.on('disconnect', () => {
                connectedAgents.remove(token as string, agentId);
            });
        } else {
            socket.join(`user_${phone}`);
        }

        socket.on('disconnect', () => {
            if (type === 'user') {
                userAgentMap.remove(phone as string);
            }
        });

        // Message Event Handlers
        handleGetMessages(io, socket, conversationHandler);
        handleSendMessage(io, socket, conversationHandler);
    });
};