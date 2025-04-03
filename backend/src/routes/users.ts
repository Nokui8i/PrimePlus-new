import express from 'express'
import { prisma } from '../../prisma'
import { authenticate } from '../../middleware/auth'

const router = express.Router()

// Get user profile by username
router.get('/:username', authenticate, async (req, res) => {
  try {
    const { username } = req.params
    console.log('Looking up user with username:', username) // Debug log

    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive' // Case insensitive search
        }
      },
      select: {
        id: true,
        name: true,
        nickname: true,
        username: true,
        avatar: true,
        coverImage: true,
        bio: true,
        isOnline: true,
        lastSeen: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true
          }
        }
      }
    })

    console.log('Found user:', user) // Debug log

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Transform the response
    const response = {
      ...user,
      stats: {
        posts: user._count.posts,
        followers: user._count.followers,
        following: user._count.following
      }
    }

    delete response._count
    console.log('Sending response:', response) // Debug log

    res.json(response)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ error: 'Failed to fetch user profile', details: error.message })
  }
})

export default router 