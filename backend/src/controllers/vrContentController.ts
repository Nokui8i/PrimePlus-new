import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { uploadToCloudStorage } from '../utils/cloudStorage';
import { validateVRContent } from '../validators/vrContentValidator';

const prisma = new PrismaClient();

export const vrContentController = {
  // Create new VR content
  async create(req: Request, res: Response) {
    try {
      const { title, description, type, isExclusive, price, environment, hotspots, tags, scheduledFor } = req.body;
      const creatorId = req.user?.id;

      if (!creatorId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Validate input
      const validationError = validateVRContent({
        title,
        description,
        type,
        isExclusive,
        price,
        environment,
        hotspots,
      });

      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      // Handle file upload
      let url = '';
      let thumbnailUrl = '';
      if (req.files && req.files.length > 0) {
        const file = req.files[0];
        url = await uploadToCloudStorage(file, 'vr-content');
        thumbnailUrl = await uploadToCloudStorage(file, 'vr-thumbnails', true);
      }

      // Create VR content with hotspots
      const vrContent = await prisma.vRContent.create({
        data: {
          title,
          description,
          type,
          url,
          thumbnailUrl,
          isExclusive,
          price,
          environment,
          creatorId,
          scheduledFor,
          hotspots: {
            create: hotspots?.map((hotspot: any) => ({
              position: hotspot.position,
              rotation: hotspot.rotation,
              type: hotspot.type,
              content: hotspot.content,
            })),
          },
          tags: {
            connectOrCreate: tags?.map((tag: string) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          hotspots: true,
          tags: true,
        },
      });

      // Create initial stats
      await prisma.vRStats.create({
        data: {
          vrContentId: vrContent.id,
        },
      });

      res.status(201).json(vrContent);
    } catch (error) {
      console.error('Error creating VR content:', error);
      res.status(500).json({ error: 'Failed to create VR content' });
    }
  },

  // Get all VR content with filtering and sorting
  async getAll(req: Request, res: Response) {
    try {
      const { type, isExclusive, sortBy = 'recent', page = 1, limit = 12 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where = {
        ...(type && { type: type as string }),
        ...(isExclusive !== undefined && { isExclusive: isExclusive === 'true' }),
      };

      const orderBy = {
        recent: { createdAt: 'desc' },
        popular: { views: 'desc' },
        trending: { stats: { likes: 'desc' } },
      }[sortBy as string];

      const [content, total] = await Promise.all([
        prisma.vRContent.findMany({
          where,
          orderBy,
          skip,
          take: Number(limit),
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            stats: true,
            tags: true,
          },
        }),
        prisma.vRContent.count({ where }),
      ]);

      res.json({
        content,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Error fetching VR content:', error);
      res.status(500).json({ error: 'Failed to fetch VR content' });
    }
  },

  // Get single VR content by ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const vrContent = await prisma.vRContent.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          hotspots: true,
          tags: true,
          stats: true,
        },
      });

      if (!vrContent) {
        return res.status(404).json({ error: 'VR content not found' });
      }

      // Check if user has access to exclusive content
      if (vrContent.isExclusive && userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { isSubscribed: true },
        });

        if (!user?.isSubscribed) {
          return res.status(403).json({ error: 'Subscription required' });
        }
      }

      // Increment view count
      await prisma.vRStats.update({
        where: { vrContentId: id },
        data: { views: { increment: 1 } },
      });

      res.json(vrContent);
    } catch (error) {
      console.error('Error fetching VR content:', error);
      res.status(500).json({ error: 'Failed to fetch VR content' });
    }
  },

  // Update VR content
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, type, isExclusive, price, environment, hotspots, tags } = req.body;
      const creatorId = req.user?.id;

      if (!creatorId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check if user owns the content
      const existingContent = await prisma.vRContent.findUnique({
        where: { id },
        select: { creatorId: true },
      });

      if (!existingContent || existingContent.creatorId !== creatorId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Validate input
      const validationError = validateVRContent({
        title,
        description,
        type,
        isExclusive,
        price,
        environment,
        hotspots,
      });

      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      // Handle file upload if new files are provided
      let url = undefined;
      let thumbnailUrl = undefined;
      if (req.files && req.files.length > 0) {
        const file = req.files[0];
        url = await uploadToCloudStorage(file, 'vr-content');
        thumbnailUrl = await uploadToCloudStorage(file, 'vr-thumbnails', true);
      }

      // Update VR content
      const vrContent = await prisma.vRContent.update({
        where: { id },
        data: {
          title,
          description,
          type,
          ...(url && { url }),
          ...(thumbnailUrl && { thumbnailUrl }),
          isExclusive,
          price,
          environment,
          hotspots: {
            deleteMany: {},
            create: hotspots?.map((hotspot: any) => ({
              position: hotspot.position,
              rotation: hotspot.rotation,
              type: hotspot.type,
              content: hotspot.content,
            })),
          },
          tags: {
            set: [],
            connectOrCreate: tags?.map((tag: string) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          hotspots: true,
          tags: true,
          stats: true,
        },
      });

      res.json(vrContent);
    } catch (error) {
      console.error('Error updating VR content:', error);
      res.status(500).json({ error: 'Failed to update VR content' });
    }
  },

  // Delete VR content
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const creatorId = req.user?.id;

      if (!creatorId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check if user owns the content
      const existingContent = await prisma.vRContent.findUnique({
        where: { id },
        select: { creatorId: true },
      });

      if (!existingContent || existingContent.creatorId !== creatorId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      await prisma.vRContent.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting VR content:', error);
      res.status(500).json({ error: 'Failed to delete VR content' });
    }
  },

  // Like VR content
  async like(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check if user already liked the content
      const existingLike = await prisma.like.findFirst({
        where: {
          userId,
          vrContentId: id,
        },
      });

      if (existingLike) {
        // Unlike
        await prisma.like.delete({
          where: { id: existingLike.id },
        });
        await prisma.vRStats.update({
          where: { vrContentId: id },
          data: { likes: { decrement: 1 } },
        });
        return res.json({ liked: false });
      }

      // Like
      await prisma.like.create({
        data: {
          userId,
          vrContentId: id,
        },
      });
      await prisma.vRStats.update({
        where: { vrContentId: id },
        data: { likes: { increment: 1 } },
      });

      res.json({ liked: true });
    } catch (error) {
      console.error('Error liking VR content:', error);
      res.status(500).json({ error: 'Failed to like VR content' });
    }
  },
}; 