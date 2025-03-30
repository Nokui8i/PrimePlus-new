import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

// Mock data for development
const mockProfile = {
  id: '1',
  username: 'demo_user',
  fullName: 'Demo User',
  bio: 'This is a demo profile',
  avatar: '/images/default-avatar.png',
  coverImage: '/images/default-cover.png',
  location: 'Demo City',
  socialLinks: {},
  stats: {
    postsCount: 42,
    mediaCount: 15,
    subscribersCount: 1000,
    viewsCount: 50000,
    likesCount: 2500,
    commentsCount: 300,
    totalViews: 75000,
    responseRate: 95,
    subscriberTrend: 10,
    engagement: {
      likeRate: 4.5,
      commentRate: 2.1,
      shareRate: 1.2,
      saveRate: 3.0,
    },
    revenue: {
      total: 5000,
      thisMonth: 1200,
      lastMonth: 800,
      currency: 'USD',
    },
  },
  subscriptionPlans: [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Access to basic content',
      price: 4.99,
      currency: 'USD',
      duration: 30,
      features: ['Basic content access', 'Community access'],
      contentAccess: {
        id: 'basic',
        name: 'Basic Access',
        description: 'Access to basic content',
        isEnabled: true,
      },
      position: 1,
      benefits: ['Basic content access', 'Community access'],
      tier: {
        id: 'basic',
        name: 'Basic',
        description: 'Access to basic content',
        price: 4.99,
        currency: 'USD',
        duration: 30,
        features: ['Basic content access', 'Community access'],
        contentAccess: {
          id: 'basic',
          name: 'Basic Access',
          description: 'Access to basic content',
          isEnabled: true,
        },
        position: 1,
        benefits: ['Basic content access', 'Community access'],
      },
      paymentOptions: [
        {
          id: 'card',
          name: 'Credit Card',
          description: 'Pay with credit card',
          processingFee: 0,
          isEnabled: true,
          icon: 'credit-card',
        },
      ],
    },
  ],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    const { id } = req.query;

    // In production, fetch this data from your database
    // For now, return mock data
    const profile = mockProfile;
    const posts = [];
    const tiers = mockProfile.subscriptionPlans;
    const isSubscribed = false;

    return res.status(200).json({
      profile,
      posts,
      tiers,
      isSubscribed,
    });
  } catch (error) {
    console.error('Error in user profile API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 