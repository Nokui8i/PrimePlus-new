import { Request, Response } from 'express';
import { prisma } from '../app';
import { createError } from '../utils/error';
import bcrypt from 'bcryptjs';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        role: true,
        isSubscribed: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            vrContent: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json(createError('User not found', 404));
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json(createError('Error getting profile'));
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, bio, avatar, currentPassword, newPassword } = req.body;

    // If updating password, verify current password
    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id }
      });

      if (!user) {
        return res.status(404).json(createError('User not found', 404));
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(400).json(createError('Current password is incorrect', 400));
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (avatar) updateData.avatar = avatar;
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        role: true,
        isSubscribed: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            vrContent: true
          }
        }
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json(createError('Error updating profile'));
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({
      where: { id: req.user!.id }
    });

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json(createError('Error deleting profile'));
  }
};

export const getCreators = async (req: Request, res: Response) => {
  try {
    const creators = await prisma.user.findMany({
      where: { isCreator: true },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        bio: true,
        _count: {
          select: {
            posts: true,
            followers: true
          }
        }
      },
      orderBy: {
        followers: {
          _count: 'desc'
        }
      },
      take: 20
    });

    res.json(creators);
  } catch (error) {
    console.error('Get creators error:', error);
    res.status(500).json(createError('Error fetching creators'));
  }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (userId === req.user!.id) {
      return res.status(400).json(createError('Cannot follow yourself', 400));
    }

    const userToFollow = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userToFollow) {
      return res.status(404).json(createError('User not found', 404));
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.user!.id,
          followingId: userId
        }
      }
    });

    if (existingFollow) {
      return res.status(400).json(createError('Already following this user', 400));
    }

    await prisma.follow.create({
      data: {
        followerId: req.user!.id,
        followingId: userId
      }
    });

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json(createError('Error following user'));
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.user!.id,
          followingId: userId
        }
      }
    });

    if (!follow) {
      return res.status(404).json(createError('Follow relationship not found', 404));
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: req.user!.id,
          followingId: userId
        }
      }
    });

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json(createError('Error unfollowing user'));
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true
          }
        }
      },
      skip,
      take: parseInt(limit as string),
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.follow.count({
      where: {
        followingId: userId
      }
    });

    res.json({
      followers,
      total,
      pages: Math.ceil(total / parseInt(limit as string)),
      currentPage: parseInt(page as string)
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json(createError('Error getting followers'));
  }
};

export const getFollowing = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const following = await prisma.follow.findMany({
      where: {
        followerId: userId
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true
          }
        }
      },
      skip,
      take: parseInt(limit as string),
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.follow.count({
      where: {
        followerId: userId
      }
    });

    res.json({
      following,
      total,
      pages: Math.ceil(total / parseInt(limit as string)),
      currentPage: parseInt(page as string)
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json(createError('Error getting following'));
  }
}; 