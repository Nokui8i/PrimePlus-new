import express from 'express'
import { prisma } from '../prisma'
import { authenticateUser } from '../middleware/auth'

const router = express.Router()

// Get all subscriptions for the current user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        subscriberId: req.user.id,
        status: {
          in: ['active', 'cancelled', 'expired']
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            bio: true
          }
        },
        tier: {
          select: {
            name: true,
            price: true,
            interval: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json(subscriptions)
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    res.status(500).json({ error: 'Failed to fetch subscriptions' })
  }
})

// Cancel a subscription
router.post('/:subscriptionId/cancel', authenticateUser, async (req, res) => {
  try {
    const { subscriptionId } = req.params

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    })

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' })
    }

    if (subscription.subscriberId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this subscription' })
    }

    if (subscription.status !== 'active') {
      return res.status(400).json({ error: 'Subscription is not active' })
    }

    // Update subscription status to cancelled
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    })

    res.json(updatedSubscription)
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    res.status(500).json({ error: 'Failed to cancel subscription' })
  }
})

export default router 