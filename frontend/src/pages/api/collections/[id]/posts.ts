import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';

const ITEMS_PER_PAGE = 12;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid collection ID' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // Get total count of posts in the collection
    const totalCount = await prisma.collectionPost.count({
      where: {
        collectionId: id,
      },
    });

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Get posts for the current page
    const posts = await prisma.collectionPost.findMany({
      where: {
        collectionId: id,
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            content: true,
            thumbnailUrl: true,
            creatorId: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        addedAt: 'desc',
      },
      skip,
      take: ITEMS_PER_PAGE,
    });

    return res.status(200).json({
      posts,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching collection posts:', error);
    return res.status(500).json({ error: 'Failed to fetch collection posts' });
  }
} 