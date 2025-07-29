import { Request, Response } from 'express';
import { GetMessagesHandler } from '../../core/use-cases/handlers/getmessage.handler';
import { GetMessagesQuery } from '../../core/use-cases/queries/getmessage.query';

export class MessageController {
    constructor(private readonly getMessagesHandler: GetMessagesHandler) { }

    async GetMessages(req: Request, res: Response) {
        const query = new GetMessagesQuery(
            req.params.conversationId,
            parseInt(req.query.page as string) || 1,
            parseInt(req.query.limit as string) || 20
        );

        const result = await this.getMessagesHandler.handle(query);
        res.json(result);
    }
}