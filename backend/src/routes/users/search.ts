import express from 'express'
import { prisma } from '../../prisma'
import { authenticate } from '../../middleware/auth'

const router = express.Router()

router.get('/search', authenticate, async (req, res) => {
  try {
    const { query } = req.query
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' })
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } },
          { nickname: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        username: true,
        nickname: true,
        avatar: true,
        bio: true,
        isOnline: true,
        profileUrl: true
      },
      take: 20 // Limit results
    })

    res.json(users)
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ error: 'Failed to search users' })
  }
})

export default router 