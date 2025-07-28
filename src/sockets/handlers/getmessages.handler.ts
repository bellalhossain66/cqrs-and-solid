import { Socket, Server } from 'socket.io';
import { MySQLMessageRepository } from '../../repositories/message.repository';
import { GetMessagesHandler } from '../../handlers/getmessage.handler';
import { GetMessagesQuery } from '../../queries/getmessage.query';
import { GetOrCreateConversationHandler } from '../../handlers/getorcreateconversation.handler';
import { GetOrCreateConversationCommand } from '../../commands/getorcreateconversation.command';

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