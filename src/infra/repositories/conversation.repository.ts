import { v4 as uuidv4 } from 'uuid';
import { Transaction } from 'sequelize';
import CompanyCustomerConversation from '../db/models/company_customer_conversation.model';
import CompanyCustomer from '../db/models/company_customer.model';
import sequelizeDB from '../../shared/config/db.config';

export class ConversationRepository {
    async getOrCreateConversation(
        company_id: number,
        name: string | null,
        phone?: string | null,
        email?: string | null
    ): Promise<CompanyCustomerConversation | null> {

        console.log(company_id, name, phone, email);

        const where: any = { company_id };

        if (phone != null) where.phone = phone;
        if (email != null) where.email = email;

        let conversation: CompanyCustomerConversation | null = null;

        const transaction = await sequelizeDB.transaction();

        try {
            const [customer, created] = await CompanyCustomer.findOrCreate({
                where,
                defaults: {
                    company_id,
                    name,
                    phone: phone ?? '',
                    email: email ?? '',
                    is_active: 1,
                },
                transaction,
            });

            conversation = await CompanyCustomerConversation.findOne({
                where: { company_id, customer_id: customer.id },
                transaction,
            });

            if (!conversation) {
                conversation = await CompanyCustomerConversation.create(
                    {
                        conversationId: uuidv4(),
                        company_id,
                        customer_id: customer.id,
                        agent_id: null,
                        is_active: 1,
                    },
                    { transaction }
                );
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            console.error('Error in getOrCreateConversation:', error);
            throw error;
        }

        return conversation;
    }
}