import { Router } from 'express';
import { HealthCheck } from '../controllers/healthcheck.controller';
import { messageController, sendMessageController } from '../controllers';
const router = Router();

router.get('/', HealthCheck);
router.get('/get-messages', messageController.GetMessages.bind(messageController));
router.post('/send-messages', sendMessageController.SendMessages.bind(sendMessageController));

export default router;