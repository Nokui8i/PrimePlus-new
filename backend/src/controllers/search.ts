import { Request, Response } from 'express';
import { prisma } from '../app';
import { createError } from '../utils/error';

export const search = async (req: Request, res: Response) => {
  try {
    const { q: query, type = 'all', page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    if (!query) {
      return res.status(400).json(createError('Search query is required'));
    }

    const searchQuery = {
      OR: [
        { title: { contains: query as string, mode: 'insensitive' } },
        { description: { contains: query as string, mode: 'insensitive' } },
        { content: { contains: query as string, mode: 'insensitive' } }
      ]
    };

    let results: any = { total: 0, items: [] };

    if (type === 'all' || type === 'post') {
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query as string, mode: 'insensitive' } },
            { content: { contains: query as string, mode: 'insensitive' } }
          ]
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true
            }
          }
        },
        skip,
        take: parseInt(limit as string)
      });

      const postsCount = await prisma.post.count({
        where: {
          OR: [
            { title: { contains: query as string, mode: 'insensitive' } },
            { content: { contains: query as string, mode: 'insensitive' } }
          ]
        }
      });

      results.posts = posts;
      results.postsCount = postsCount;
    }

    if (type === 'all' || type === 'vr') {
      const vrContent = await prisma.vRContent.findMany({
        where: {
          OR: [
            { title: { contains: query as string, mode: 'insensitive' } },
            { description: { contains: query as string, mode: 'insensitive' } }
          ]
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              avatarUrl: true
            }
          }
        },
        skip,
        take: parseInt(limit as string)
      });

      const vrContentCount = await prisma.vRContent.count({
        where: {
          OR: [
            { title: { contains: query as string, mode: 'insensitive' } },
            { description: { contains: query as string, mode: 'insensitive' } }
          ]
        }
      });

      results.vrContent = vrContent;
      results.vrContentCount = vrContentCount;
    }

    if (type === 'all' || type === 'collection') {
      const collections = await prisma.collection.findMany({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: query as string, mode: 'insensitive' } },
                { description: { contains: query as string, mode: 'insensitive' } }
              ]
            },
            {
              OR: [
                { ownerId: req.user!.id },
                { isPublic: true }
              ]
            }
          ]
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              avatarUrl: true
            }
          }
        },
        skip,
        take: parseInt(limit as string)
      });

      const collectionsCount = await prisma.collection.count({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: query as string, mode: 'insensitive' } },
                { description: { contains: query as string, mode: 'insensitive' } }
              ]
            },
            {
              OR: [
                { ownerId: req.user!.id },
                { isPublic: true }
              ]
            }
          ]
        }
      });

      results.collections = collections;
      results.collectionsCount = collectionsCount;
    }

    if (type === 'all' || type === 'user') {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query as string, mode: 'insensitive' } },
            { email: { contains: query as string, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          isCreator: true,
          _count: {
            select: {
              followers: true,
              posts: true
            }
          }
        },
        skip,
        take: parseInt(limit as string)
      });

      const usersCount = await prisma.user.count({
        where: {
          OR: [
            { name: { contains: query as string, mode: 'insensitive' } },
            { email: { contains: query as string, mode: 'insensitive' } }
          ]
        }
      });

      results.users = users;
      results.usersCount = usersCount;
    }

    res.json({
      ...results,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json(createError('Error performing search'));
  }
}; 