import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import { UpdateCollectionInput } from '../../../types/collection';

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

  switch (req.method) {
    case 'GET':
      try {
        const collection = await prisma.collection.findUnique({
          where: {
            id,
            userId: session.user.id,
          },
        });

        if (!collection) {
          return res.status(404).json({ error: 'Collection not found' });
        }

        return res.status(200).json(collection);
      } catch (error) {
        console.error('Error fetching collection:', error);
        return res.status(500).json({ error: 'Failed to fetch collection' });
      }

    case 'PATCH':
      try {
        const input: UpdateCollectionInput = req.body;
        const collection = await prisma.collection.update({
          where: {
            id,
            userId: session.user.id,
          },
          data: input,
        });

        return res.status(200).json(collection);
      } catch (error) {
        console.error('Error updating collection:', error);
        return res.status(500).json({ error: 'Failed to update collection' });
      }

    case 'DELETE':
      try {
        await prisma.collection.delete({
          where: {
            id,
            userId: session.user.id,
          },
        });

        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting collection:', error);
        return res.status(500).json({ error: 'Failed to delete collection' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 