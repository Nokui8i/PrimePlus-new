import express from 'express'
import { prisma } from '../../prisma'
import { authenticate } from '../../middleware/auth'

const router = express.Router()

// Search users
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' })
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { nickname: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        username: true,
        name: true,
        nickname: true,
        avatar: true,
        bio: true,
        isVerified: true,
        _count: {
          select: {
            posts: true
          }
        }
      },
      take: 20 // Limit results
    })

    res.json(users)
  } catch (error) {
    console.error('Error searching users:', error)
    res.status(500).json({ error: 'Failed to search users' })
  }
})

// Get user profile by username (public access)
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params
    const isAuthenticated = req.headers.authorization?.startsWith('Bearer ')

    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        username: true,
        name: true,
        nickname: true,
        avatar: true,
        coverImage: true,
        bio: true,
        isVerified: true,
        isOnline: true,
        createdAt: true,
        _count: {
          select: {
            posts: true
          }
        },
        // Only include posts that are not premium, unless authenticated
        posts: {
          where: isAuthenticated ? {} : { isPremium: false },
          select: {
            id: true,
            title: true,
            content: true,
            type: true,
            isPremium: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Transform the response
    const response = {
      ...user,
      stats: {
        posts: user._count.posts
      },
      recentPosts: user.posts
    }

    delete response._count
    delete response.posts

    res.json(response)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ error: 'Failed to fetch user profile' })
  }
})

// Get all users (admin only)
router.get('/', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    })

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        nickname: true,
        role: true,
        isVerified: true,
        isModerator: true,
        isOnline: true,
        createdAt: true,
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

export default router 