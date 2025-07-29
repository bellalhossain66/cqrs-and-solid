import { Router } from 'express';
import { HealthCheck } from '../controllers/healthcheck.controller';
import { messageController } from '../controllers';
const router = Router();

router.get('/', HealthCheck);
router.get('/get-messages/:conversationId', messageController.GetMessages.bind(messageController));

export default router;