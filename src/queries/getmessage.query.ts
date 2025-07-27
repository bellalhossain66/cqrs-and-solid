export class GetMessagesQuery {
    constructor(
        public readonly conversationId: string,
        public readonly page: number = 1,
        public readonly limit: number = 20
    ) { }
}