import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import { CreateCollectionInput } from '../../../types/collection';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const collections = await prisma.collection.findMany({
          where: {
            userId: session.user.id,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        });

        return res.status(200).json(collections);
      } catch (error) {
        console.error('Error fetching collections:', error);
        return res.status(500).json({ error: 'Failed to fetch collections' });
      }

    case 'POST':
      try {
        const input: CreateCollectionInput = req.body;
        const collection = await prisma.collection.create({
          data: {
            ...input,
            userId: session.user.id,
          },
        });

        return res.status(201).json(collection);
      } catch (error) {
        console.error('Error creating collection:', error);
        return res.status(500).json({ error: 'Failed to create collection' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 