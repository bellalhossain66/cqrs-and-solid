export class GetOrCreateConversationCommand {
    constructor(
        public readonly company_id: number,
        public readonly name: string | null,
        public readonly phone?: string | null,
        public readonly email?: string | null
    ) { }
}