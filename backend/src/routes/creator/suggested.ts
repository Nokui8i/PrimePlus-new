import express from 'express'
import { prisma } from '../../prisma'
import { authenticateUser } from '../../middleware/auth'

const router = express.Router()

// Get suggested creators
router.get('/', authenticateUser, async (req, res) => {
  try {
    // Get creators the user isn't already subscribed to
    const suggestedCreators = await prisma.user.findMany({
      where: {
        role: 'CREATOR',
        isVerified: true,
        NOT: {
          subscribers: {
            some: {
              subscriberId: req.user.id
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        nickname: true,
        username: true,
        avatar: true,
        bio: true,
        isOnline: true,
        lastSeen: true,
        _count: {
          select: {
            subscribers: true,
            posts: true
          }
        }
      },
      orderBy: [
        {
          subscribers: {
            _count: 'desc'
          }
        },
        {
          posts: {
            _count: 'desc'
          }
        }
      ],
      take: 8 // Limit to 8 suggestions
    })

    res.json(suggestedCreators)
  } catch (error) {
    console.error('Error fetching suggested creators:', error)
    res.status(500).json({ error: 'Failed to fetch suggested creators' })
  }
})

export default router 