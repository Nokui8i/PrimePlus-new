import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateUserProfiles() {
  try {
    // Get all users
    const users = await prisma.user.findMany()

    console.log(`Found ${users.length} users to update`)

    for (const user of users) {
      // Skip if user already has a username and profileUrl
      if (user.username && user.profileUrl) continue

      // Generate username from name or email
      const baseUsername = (user.name || user.email.split('@')[0])
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, 20)

      let username = baseUsername
      let counter = 1

      // Keep trying until we find an available username
      while (true) {
        const exists = await prisma.user.findUnique({
          where: { username }
        })

        if (!exists) break

        username = `${baseUsername}${counter}`
        counter++
      }

      // Update user with new username and profileUrl
      await prisma.user.update({
        where: { id: user.id },
        data: {
          username,
          profileUrl: `/profile/${username}`,
          nickname: username // Set initial nickname same as username
        }
      })

      console.log(`Updated user ${user.email} with username: ${username}`)
    }

    console.log('Successfully updated all user profiles')
  } catch (error) {
    console.error('Error updating user profiles:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
updateUserProfiles() 