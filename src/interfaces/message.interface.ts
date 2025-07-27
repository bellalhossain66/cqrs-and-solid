export interface IMessageRepository {
    saveMessage(
        conversationId: string,
        senderId: number,
        senderPhone: string,
        senderType: 'user' | 'agent',
        content: string
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