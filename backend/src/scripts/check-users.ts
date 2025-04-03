import { prisma } from '../../prisma'

async function checkUsers() {
  try {
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

    console.log('\nRegistered Users:')
    console.log('-----------------')
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User Details:`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Username: ${user.username}`)
      console.log(`   Name: ${user.name || 'Not set'}`)
      console.log(`   Nickname: ${user.nickname || 'Not set'}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Verified: ${user.isVerified}`)
      console.log(`   Moderator: ${user.isModerator}`)
      console.log(`   Online: ${user.isOnline}`)
      console.log(`   Created At: ${user.createdAt}`)
      console.log(`   Posts Count: ${user._count.posts}`)
    })

    console.log(`\nTotal Users: ${users.length}`)
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers() 