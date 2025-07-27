export class SendMessageCommand {
    constructor(
        public readonly senderId: number,
        public readonly senderPhone: string,
        public readonly conversationId: string,
        public readonly content: string,
        public readonly senderType: 'user' | 'agent'
    ) { }
}