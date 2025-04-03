import express from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../../prisma'

const router = express.Router()

// Helper function to generate username from name
const generateUsername = async (name: string) => {
  // Remove spaces, special characters, and convert to lowercase
  let baseUsername = name.toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 20) // Limit length

  let username = baseUsername
  let counter = 1

  // Keep trying until we find an available username
  while (true) {
    const exists = await prisma.user.findUnique({
      where: { username }
    })

    if (!exists) break

    // If username exists, append a number and try again
    username = `${baseUsername}${counter}`
    counter++
  }

  return username
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Generate username from name
    const username = await generateUsername(name)

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with generated username
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
        nickname: username, // Set initial nickname same as username
        profileUrl: `/profile/${username}`, // Store the profile URL
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    res.status(201).json({
      ...userWithoutPassword,
      profileUrl: `/profile/${username}`
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Failed to register user' })
  }
})

export default router 