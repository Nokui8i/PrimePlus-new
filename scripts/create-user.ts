import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create Omri Amar user
    const user = await prisma.user.create({
      data: {
        name: 'Omri Amar',
        email: 'omri.amar@example.com',
        username: 'omriamar',
        nickname: 'Omri',
        bio: 'Welcome to my profile!',
      },
    })

    console.log('Created user:', user)
  } catch (error) {
    console.error('Error creating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 