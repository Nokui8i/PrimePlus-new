import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateRequest } from '../middleware/validateRequest';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createPlanSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().optional(),
  features: z.array(z.string()),
  intervalInDays: z.number().int().positive(),
  isActive: z.boolean().optional(),
  contentAccess: z.object({
    regularContent: z.boolean(),
    premiumVideos: z.boolean(),
    vrContent: z.boolean(),
    threeSixtyContent: z.boolean(),
    liveRooms: z.boolean(),
    interactiveModels: z.boolean()
  })
});

const updatePlanSchema = createPlanSchema.partial();

export const subscriptionPlanController = {
  // Get all subscription plans for a creator
  getPlans: async (req: Request, res: Response) => {
    try {
      const creatorId = req.user?.id;
      if (!creatorId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const plans = await prisma.subscriptionPlan.findMany({
        where: { creatorId },
        orderBy: { createdAt: 'desc' }
      });

      return res.json(plans);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get a specific subscription plan
  getPlan: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id }
      });

      if (!plan) {
        return res.status(404).json({ error: 'Subscription plan not found' });
      }

      return res.json(plan);
    } catch (error) {
      console.error('Error fetching subscription plan:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Create a new subscription plan
  createPlan: async (req: Request, res: Response) => {
    try {
      const creatorId = req.user?.id;
      if (!creatorId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const validatedData = createPlanSchema.parse(req.body);

      const plan = await prisma.subscriptionPlan.create({
        data: {
          ...validatedData,
          creatorId
        }
      });

      return res.status(201).json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating subscription plan:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update a subscription plan
  updatePlan: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const creatorId = req.user?.id;
      if (!creatorId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id }
      });

      if (!plan) {
        return res.status(404).json({ error: 'Subscription plan not found' });
      }

      if (plan.creatorId !== creatorId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const validatedData = updatePlanSchema.parse(req.body);

      const updatedPlan = await prisma.subscriptionPlan.update({
        where: { id },
        data: validatedData
      });

      return res.json(updatedPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error updating subscription plan:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete a subscription plan
  deletePlan: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const creatorId = req.user?.id;
      if (!creatorId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id }
      });

      if (!plan) {
        return res.status(404).json({ error: 'Subscription plan not found' });
      }

      if (plan.creatorId !== creatorId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Check if there are any active subscriptions using this plan
      const activeSubscriptions = await prisma.subscription.count({
        where: {
          planId: id,
          status: 'ACTIVE'
        }
      });

      if (activeSubscriptions > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete plan with active subscriptions' 
        });
      }

      await prisma.subscriptionPlan.delete({
        where: { id }
      });

      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}; 