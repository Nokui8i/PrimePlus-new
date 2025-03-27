import { Request, Response } from 'express';
import { prisma } from '../app';
import { createError } from '../utils/error';

export const createCollection = async (req: Request, res: Response) => {
  try {
    const { name, description, isPublic } = req.body;

    const collection = await prisma.collection.create({
      data: {
        name,
        description,
        isPublic,
        ownerId: req.user!.id
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    res.status(201).json(collection);
  } catch (error) {
    console.error('Create collection error:', error);
    res.status(500).json(createError('Error creating collection'));
  }
};

export const getCollections = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', isPublic } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where = {
      OR: [
        { ownerId: req.user!.id },
        { isPublic: true }
      ]
    };

    const collections = await prisma.collection.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        _count: {
          select: {
            posts: true,
            vrContent: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit as string)
    });

    const total = await prisma.collection.count({ where });

    res.json({
      collections,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / parseInt(limit as string))
    });
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json(createError('Error fetching collections'));
  }
};

export const getCollection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        posts: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        },
        vrContent: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });

    if (!collection) {
      return res.status(404).json(createError('Collection not found'));
    }

    if (!collection.isPublic && collection.ownerId !== req.user!.id) {
      return res.status(403).json(createError('Not authorized'));
    }

    res.json(collection);
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json(createError('Error fetching collection'));
  }
};

export const updateCollection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, isPublic } = req.body;

    const collection = await prisma.collection.findUnique({ where: { id } });
    if (!collection) {
      return res.status(404).json(createError('Collection not found'));
    }

    if (collection.ownerId !== req.user!.id) {
      return res.status(403).json(createError('Not authorized'));
    }

    const updatedCollection = await prisma.collection.update({
      where: { id },
      data: {
        name,
        description,
        isPublic
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    res.json(updatedCollection);
  } catch (error) {
    console.error('Update collection error:', error);
    res.status(500).json(createError('Error updating collection'));
  }
};

export const deleteCollection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const collection = await prisma.collection.findUnique({ where: { id } });
    if (!collection) {
      return res.status(404).json(createError('Collection not found'));
    }

    if (collection.ownerId !== req.user!.id) {
      return res.status(403).json(createError('Not authorized'));
    }

    await prisma.collection.delete({ where: { id } });

    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Delete collection error:', error);
    res.status(500).json(createError('Error deleting collection'));
  }
};

export const addToCollection = async (req: Request, res: Response) => {
  try {
    const { id: collectionId } = req.params;
    const { itemId, itemType } = req.body;

    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection) {
      return res.status(404).json(createError('Collection not found'));
    }

    if (collection.ownerId !== req.user!.id) {
      return res.status(403).json(createError('Not authorized'));
    }

    let updatedCollection;
    if (itemType === 'post') {
      updatedCollection = await prisma.collection.update({
        where: { id: collectionId },
        data: {
          posts: {
            connect: { id: itemId }
          }
        }
      });
    } else if (itemType === 'vr') {
      updatedCollection = await prisma.collection.update({
        where: { id: collectionId },
        data: {
          vrContent: {
            connect: { id: itemId }
          }
        }
      });
    } else {
      return res.status(400).json(createError('Invalid item type'));
    }

    res.json(updatedCollection);
  } catch (error) {
    console.error('Add to collection error:', error);
    res.status(500).json(createError('Error adding item to collection'));
  }
};

export const removeFromCollection = async (req: Request, res: Response) => {
  try {
    const { id: collectionId, itemId } = req.params;
    const { itemType } = req.body;

    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection) {
      return res.status(404).json(createError('Collection not found'));
    }

    if (collection.ownerId !== req.user!.id) {
      return res.status(403).json(createError('Not authorized'));
    }

    let updatedCollection;
    if (itemType === 'post') {
      updatedCollection = await prisma.collection.update({
        where: { id: collectionId },
        data: {
          posts: {
            disconnect: { id: itemId }
          }
        }
      });
    } else if (itemType === 'vr') {
      updatedCollection = await prisma.collection.update({
        where: { id: collectionId },
        data: {
          vrContent: {
            disconnect: { id: itemId }
          }
        }
      });
    } else {
      return res.status(400).json(createError('Invalid item type'));
    }

    res.json(updatedCollection);
  } catch (error) {
    console.error('Remove from collection error:', error);
    res.status(500).json(createError('Error removing item from collection'));
  }
}; 