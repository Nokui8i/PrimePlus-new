import express from 'express'
import { authenticate } from '../../middleware/auth'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// Get current user's profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        nickname: true,
        username: true,
        bio: true,
        avatar: true,
        coverImage: true,
        isOnline: true,
        profileUrl: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// Update current user's profile
router.patch('/me', authenticate, async (req, res) => {
  try {
    const { name, nickname, bio } = req.body

    // Validate input
    if (name && typeof name !== 'string') {
      return res.status(400).json({ error: 'Name must be a string' })
    }
    if (nickname && typeof nickname !== 'string') {
      return res.status(400).json({ error: 'Nickname must be a string' })
    }
    if (bio && typeof bio !== 'string') {
      return res.status(400).json({ error: 'Bio must be a string' })
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        nickname: nickname || undefined,
        bio: bio || undefined
      },
      select: {
        id: true,
        name: true,
        nickname: true,
        username: true,
        bio: true,
        avatar: true,
        coverImage: true,
        isOnline: true,
        profileUrl: true
      }
    })

    res.json(updatedUser)
  } catch (error) {
    console.error('Error updating user profile:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

export default router 