export interface IMessageRepository {
    saveMessage(
        conversationId: string,
        customer_id: number,
        sender_type: 'user' | 'agent',
        message: string,
        message_type: 'text' | 'image' | 'video' | 'file' | 'system'
    ): Promise<void>;

    fetchMessagesByPhone(
        conversationId: string,
        page: number,
        limit: number
    ): Promise<{
        total: number;
        page: number;
        messages: any[];
    }>;
}