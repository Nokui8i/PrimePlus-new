import { Router } from 'express'
import { prisma } from '../../lib/prisma'
import { authenticateCreator } from '../../middleware/auth'

const router = Router()

// Middleware to check if user is verified as a creator
const checkCreatorVerification = async (req: any, res: any, next: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        creatorProfile: true
      }
    })

    if (!user?.creatorProfile?.isVerified) {
      return res.status(403).json({ 
        error: 'Creator verification required',
        message: 'You need to complete the creator verification process to accept payments and create subscription tiers'
      })
    }

    next()
  } catch (error) {
    console.error('Error checking creator verification:', error)
    res.status(500).json({ error: 'Failed to check creator verification status' })
  }
}

// Get all subscription tiers for the creator
router.get('/', authenticateCreator, async (req, res) => {
  try {
    const tiers = await prisma.subscriptionTier.findMany({
      where: {
        creatorId: req.user.id
      },
      orderBy: {
        price: 'asc'
      }
    })
    res.json(tiers)
  } catch (error) {
    console.error('Error fetching subscription tiers:', error)
    res.status(500).json({ error: 'Failed to fetch subscription tiers' })
  }
})

// Create new subscription tiers
router.post('/', authenticateCreator, checkCreatorVerification, async (req, res) => {
  try {
    const tiers = req.body
    const createdTiers = await Promise.all(
      tiers.map((tier: any) =>
        prisma.subscriptionTier.create({
          data: {
            ...tier,
            creatorId: req.user.id
          }
        })
      )
    )
    res.json(createdTiers)
  } catch (error) {
    console.error('Error creating subscription tiers:', error)
    res.status(500).json({ error: 'Failed to create subscription tiers' })
  }
})

// Update a subscription tier
router.put('/:id', authenticateCreator, checkCreatorVerification, async (req, res) => {
  try {
    const { id } = req.params
    const tier = await prisma.subscriptionTier.update({
      where: {
        id,
        creatorId: req.user.id
      },
      data: req.body
    })
    res.json(tier)
  } catch (error) {
    console.error('Error updating subscription tier:', error)
    res.status(500).json({ error: 'Failed to update subscription tier' })
  }
})

// Delete a subscription tier
router.delete('/:id', authenticateCreator, checkCreatorVerification, async (req, res) => {
  try {
    const { id } = req.params
    await prisma.subscriptionTier.delete({
      where: {
        id,
        creatorId: req.user.id
      }
    })
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting subscription tier:', error)
    res.status(500).json({ error: 'Failed to delete subscription tier' })
  }
})

export default router 