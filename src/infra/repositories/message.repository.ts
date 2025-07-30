import { IMessageRepository } from '../../core/domain/interfaces/message.interface';
import CompanyCustomerMessage from '../db/models/company_customer_message.model';
import CompanyCustomerLog from '../db/models/company_customers_log.model';

export class MySQLMessageRepository implements IMessageRepository {
    async saveMessage(
        conversationId: string,
        customer_id: number,
        sender_type: 'user' | 'agent',
        message: string,
        message_type: 'text' | 'image' | 'video' | 'file' | 'system'
    ) {
        await CompanyCustomerMessage.create({
            conversation_id: conversationId,
            customer_id,
            agent_id: null,
            sender_type,
            message,
            message_type,
            message_status: 'sent',
        });

        await CompanyCustomerLog.create({
            action_by: customer_id,
            action_by_type: 'user',
            action: message,
            meta: null,
        });
    }

    async fetchMessagesByPhone(conversationId: string, page: number = 1, limit: number = 20) {
        console.log(page, limit)
        try {
            const offset = (page - 1) * limit;

            const user = { id: '00000' }
            if (!user) {
                return { total: 0, page, last_page: 1, messages: [] };
            }

            const { count, rows } = await CompanyCustomerMessage.findAndCountAll({
                where: { conversation_id: conversationId },
                offset,
                limit,
                order: [['id', 'DESC']]
            });

            return {
                total: count,
                page,
                messages: rows.map(msg => ({
                    id: msg.id,
                    text: msg.message,
                    sender: msg.sender_type,
                    type: msg.message_type,
                    createdAt: msg.created_at
                }))
            };
        } catch (err: any) {
            console.log(err);
            return {
                total: 0,
                page,
                messages: []
            }
        }
    }
}