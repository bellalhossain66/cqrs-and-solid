import { MessageController } from './message.controller';
import { GetMessagesHandler } from '../../core/use-cases/handlers/getmessage.handler';
import { MySQLMessageRepository } from '../../infra/repositories/message.repository';
import { SendMessageController } from './sendmessage.controller';

export const messageController = new MessageController(new GetMessagesHandler(new MySQLMessageRepository()));
export const sendMessageController = new SendMessageController();
