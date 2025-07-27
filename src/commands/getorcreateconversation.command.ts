export class GetOrCreateConversationCommand {
    constructor(
        public readonly userId: number,
        public readonly user_phone?: string | null,
        public readonly user_email?: string | null
    ) { }
}