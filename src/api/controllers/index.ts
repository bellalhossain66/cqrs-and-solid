import { MessageController } from './message.controller';
import { GetMessagesHandler } from '../../core/use-cases/handlers/getmessage.handler';
import { MySQLMessageRepository } from '../../infra/repositories/message.repository';

const messageRepository = new MySQLMessageRepository();
const getMessagesHandler = new GetMessagesHandler(messageRepository);
export const messageController = new MessageController(getMessagesHandler);
