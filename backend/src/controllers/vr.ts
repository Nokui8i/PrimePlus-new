import { Request, Response } from 'express';
import { prisma } from '../app';
import { createError } from '../utils/error';

export const createVRContent = async (req: Request, res: Response) => {
  try {
    const { title, description, modelUrl, thumbnailUrl, isExclusive } = req.body;

    const vrContent = await prisma.vRContent.create({
      data: {
        title,
        description,
        modelUrl,
        thumbnailUrl,
        isExclusive,
        creatorId: req.user!.id
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json(vrContent);
  } catch (error) {
    console.error('Create VR content error:', error);
    res.status(500).json(createError('Error creating VR content'));
  }
};

export const getVRContents = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', creatorId, isExclusive } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (creatorId) where.creatorId = creatorId;
    if (isExclusive !== undefined) where.isExclusive = isExclusive === 'true';

    const vrContents = await prisma.vRContent.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      },
      skip,
      take: parseInt(limit as string),
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.vRContent.count({ where });

    res.json({
      vrContents,
      total,
      pages: Math.ceil(total / parseInt(limit as string)),
      currentPage: parseInt(page as string)
    });
  } catch (error) {
    console.error('Get VR contents error:', error);
    res.status(500).json(createError('Error getting VR contents'));
  }
};

export const getVRContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vrContent = await prisma.vRContent.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        likes: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    });

    if (!vrContent) {
      return res.status(404).json(createError('VR content not found', 404));
    }

    res.json(vrContent);
  } catch (error) {
    console.error('Get VR content error:', error);
    res.status(500).json(createError('Error getting VR content'));
  }
};

export const updateVRContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, modelUrl, thumbnailUrl, isExclusive } = req.body;

    const vrContent = await prisma.vRContent.findUnique({
      where: { id }
    });

    if (!vrContent) {
      return res.status(404).json(createError('VR content not found', 404));
    }

    if (vrContent.creatorId !== req.user!.id) {
      return res.status(403).json(createError('Not authorized to update this VR content', 403));
    }

    const updatedVRContent = await prisma.vRContent.update({
      where: { id },
      data: {
        title,
        description,
        modelUrl,
        thumbnailUrl,
        isExclusive
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.json(updatedVRContent);
  } catch (error) {
    console.error('Update VR content error:', error);
    res.status(500).json(createError('Error updating VR content'));
  }
};

export const deleteVRContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vrContent = await prisma.vRContent.findUnique({
      where: { id }
    });

    if (!vrContent) {
      return res.status(404).json(createError('VR content not found', 404));
    }

    if (vrContent.creatorId !== req.user!.id) {
      return res.status(403).json(createError('Not authorized to delete this VR content', 403));
    }

    await prisma.vRContent.delete({
      where: { id }
    });

    res.json({ message: 'VR content deleted successfully' });
  } catch (error) {
    console.error('Delete VR content error:', error);
    res.status(500).json(createError('Error deleting VR content'));
  }
};

export const likeVRContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vrContent = await prisma.vRContent.findUnique({
      where: { id }
    });

    if (!vrContent) {
      return res.status(404).json(createError('VR content not found', 404));
    }

    // Check if already liked
    const existingLike = await prisma.vRLike.findUnique({
      where: {
        userId_vRContentId: {
          userId: req.user!.id,
          vRContentId: id
        }
      }
    });

    if (existingLike) {
      return res.status(400).json(createError('VR content already liked', 400));
    }

    await prisma.vRLike.create({
      data: {
        userId: req.user!.id,
        vRContentId: id
      }
    });

    res.json({ message: 'VR content liked successfully' });
  } catch (error) {
    console.error('Like VR content error:', error);
    res.status(500).json(createError('Error liking VR content'));
  }
};

export const unlikeVRContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const like = await prisma.vRLike.findUnique({
      where: {
        userId_vRContentId: {
          userId: req.user!.id,
          vRContentId: id
        }
      }
    });

    if (!like) {
      return res.status(404).json(createError('Like not found', 404));
    }

    await prisma.vRLike.delete({
      where: {
        userId_vRContentId: {
          userId: req.user!.id,
          vRContentId: id
        }
      }
    });

    res.json({ message: 'VR content unliked successfully' });
  } catch (error) {
    console.error('Unlike VR content error:', error);
    res.status(500).json(createError('Error unliking VR content'));
  }
}; 