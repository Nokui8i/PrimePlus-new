import { Router } from 'express';
import { search } from '../controllers/search';

const router = Router();

// Search across all content types
router.get('/', search);

export default router; 