import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createPaymentIntent,
  handleWebhook,
  getSubscriptionStatus,
  cancelSubscription
} from '../controllers/payment';

const router = Router();

// Create payment intent
router.post('/create-payment-intent', authenticate, createPaymentIntent);

// Handle Stripe webhooks
router.post('/webhook', handleWebhook);

// Get subscription status
router.get('/subscription-status', authenticate, getSubscriptionStatus);

// Cancel subscription
router.post('/cancel-subscription', authenticate, cancelSubscription);

export default router; 