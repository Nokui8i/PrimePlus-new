import { Router } from 'express';
import { subscriptionPlanController } from '../controllers/subscriptionPlanController';
import { authenticate } from '../middleware/authenticate';
import { isCreator } from '../middleware/isCreator';

const router = Router();

// Get all subscription plans for a creator
router.get('/plans', authenticate, isCreator, subscriptionPlanController.getPlans);

// Get a specific subscription plan
router.get('/plans/:id', authenticate, subscriptionPlanController.getPlan);

// Create a new subscription plan
router.post('/plans', authenticate, isCreator, subscriptionPlanController.createPlan);

// Update a subscription plan
router.put('/plans/:id', authenticate, isCreator, subscriptionPlanController.updatePlan);

// Delete a subscription plan
router.delete('/plans/:id', authenticate, isCreator, subscriptionPlanController.deletePlan);

export default router; 