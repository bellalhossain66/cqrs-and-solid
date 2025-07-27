import { IMessageRepository } from '../interfaces/message.interface';
import { GetMessagesQuery } from '../queries/getmessage.query';

export class GetMessagesHandler {
    constructor(private readonly messageRepo: IMessageRepository) { }

    async handle(query: GetMessagesQuery) {
        return await this.messageRepo.fetchMessagesByPhone(query.conversationId, query.page, query.limit);
    }
}