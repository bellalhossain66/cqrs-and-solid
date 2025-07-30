export class SendMessageCommand {
    constructor(
        public readonly conversationId: string,
        public readonly customer_id: number,
        public readonly sender_type: 'user' | 'agent',
        public readonly message: string,
        public readonly message_type: 'text' | 'image' | 'video' | 'file' | 'system'
    ) { }
}