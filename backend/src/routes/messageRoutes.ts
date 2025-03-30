import { Router } from 'express';
import { sendMessage, getMessages, getConversations } from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes are protected and require authentication
router.use(authenticate);

// Send a new message
router.post('/', sendMessage);

// Get all messages between current user and another user
router.get('/conversation/:otherUserId', getMessages);

// Get all conversations for the current user
router.get('/conversations', getConversations);

export default router; 