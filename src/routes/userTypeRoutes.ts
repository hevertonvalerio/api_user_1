import { Router } from 'express';
import { userTypeController } from '../controllers/UserTypeController';
import { apiKeyMiddleware } from '../middlewares/ApiKeyMiddleware';

const router = Router();

// Get all user types
router.get('/', apiKeyMiddleware as any, userTypeController.getAllUserTypes as any);

export default router;
