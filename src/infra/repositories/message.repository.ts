import { IMessageRepository } from '../../core/domain/interfaces/message.interface';
import Message from '../db/models/message.model';

export class MySQLMessageRepository implements IMessageRepository {
    async saveMessage(
        conversationId: string,
        senderId: number,
        senderPhone: string,
        senderType: 'user' | 'agent',
        content: string
    ): Promise<void> {
        await Message.create({ conversationId, senderId, senderPhone, senderType, content });
    }

    async fetchMessagesByPhone(conversationId: string, page: number, limit: number) {
        const offset = (page - 1) * limit;

        const user = { id: '00000' }
        if (!user) {
            return { total: 0, page, last_page: 1, messages: [] };
        }

        const { count, rows } = await Message.findAndCountAll({
            where: { conversationId: conversationId },
            offset,
            limit,
            order: [['id', 'DESC']]
        });

        return {
            total: count,
            page,
            messages: rows
        };
    }
}