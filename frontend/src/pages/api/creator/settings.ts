import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  // Verify user is a creator
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isCreator: true }
  });

  if (!user?.isCreator) {
    return res.status(403).json({ error: 'Only creators can access these settings' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const creatorSettings = await prisma.creatorSettings.findUnique({
          where: { userId }
        });

        if (!creatorSettings) {
          // Return default settings if none exist
          return res.status(200).json({
            subscriptionPrice: 9.99,
            welcomeMessage: '',
            bio: '',
            isAcceptingNewSubscribers: true,
            customLinks: {},
            contentPreferences: {
              postFrequency: 'weekly',
              contentType: [],
              exclusiveContent: false,
            }
          });
        }

        return res.status(200).json(creatorSettings);
      } catch (error) {
        console.error('Error fetching creator settings:', error);
        return res.status(500).json({ error: 'Failed to fetch creator settings' });
      }

    case 'PUT':
      try {
        const {
          subscriptionPrice,
          welcomeMessage,
          bio,
          isAcceptingNewSubscribers,
          customLinks,
          contentPreferences
        } = req.body;

        const updatedSettings = await prisma.creatorSettings.upsert({
          where: { userId },
          update: {
            subscriptionPrice,
            welcomeMessage,
            bio,
            isAcceptingNewSubscribers,
            customLinks,
            contentPreferences
          },
          create: {
            userId,
            subscriptionPrice,
            welcomeMessage,
            bio,
            isAcceptingNewSubscribers,
            customLinks,
            contentPreferences
          }
        });

        return res.status(200).json(updatedSettings);
      } catch (error) {
        console.error('Error updating creator settings:', error);
        return res.status(500).json({ error: 'Failed to update creator settings' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 