import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../app';
import { createError } from '../utils/error';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        userId: req.user!.id
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json(createError('Error creating payment intent'));
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
      return res.status(400).json(createError('No signature found'));
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata.userId;

        await prisma.subscription.create({
          data: {
            subscriberId: userId,
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          }
        });

        await prisma.user.update({
          where: { id: userId },
          data: { isSubscribed: true }
        });
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId }
        });

        if (user) {
          await prisma.subscription.updateMany({
            where: { subscriberId: user.id, status: 'ACTIVE' },
            data: { status: 'CANCELLED', endDate: new Date() }
          });

          await prisma.user.update({
            where: { id: user.id },
            data: { isSubscribed: false }
          });
        }
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json(createError('Webhook error'));
  }
};

export const getSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        subscriberId: req.user!.id,
        status: 'ACTIVE'
      }
    });

    res.json({
      isSubscribed: !!subscription,
      subscription
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json(createError('Error getting subscription status'));
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' }
        }
      }
    });

    if (!user || !user.subscriptions.length) {
      return res.status(404).json(createError('No active subscription found'));
    }

    if (user.stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active'
      });

      for (const subscription of subscriptions.data) {
        await stripe.subscriptions.del(subscription.id);
      }
    }

    await prisma.subscription.updateMany({
      where: {
        subscriberId: req.user!.id,
        status: 'ACTIVE'
      },
      data: {
        status: 'CANCELLED',
        endDate: new Date()
      }
    });

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { isSubscribed: false }
    });

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json(createError('Error cancelling subscription'));
  }
}; 