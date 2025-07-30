import { Socket, Server } from 'socket.io';
import { MySQLMessageRepository } from '../../repositories/message.repository';
import { GetMessagesQuery } from '../../../core/use-cases/queries/getmessage.query';
import { GetOrCreateConversationCommand } from '../../../core/use-cases/commands/getorcreateconversation.command';
import { GetMessagesHandler } from '../../../core/use-cases/handlers/getmessage.handler';
import { GetOrCreateConversationHandler } from '../../../core/use-cases/handlers/getorcreateconversation.handler';

const getMessagesHandler = new GetMessagesHandler(new MySQLMessageRepository());

export const handleGetMessages = (io: Server, socket: Socket, conversationHandler: GetOrCreateConversationHandler) => {
    const { userPhone: phone } = socket.handshake.query;

    socket.on('get_messages', async ({ page = 1, limit = 20 }) => {
        try {
            const conversation = await conversationHandler.handle(
                new GetOrCreateConversationCommand(123, phone as string, 'user@example.com')
            );

            const query = new GetMessagesQuery(conversation.conversationId, page, limit);
            const messages = await getMessagesHandler.handle(query);
            messages.messages.reverse();
            socket.emit('messages', messages);
        } catch (err) {
            socket.emit('error', { message: 'Failed to load messages' });
        }
    });
};