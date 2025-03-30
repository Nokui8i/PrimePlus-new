import type { Post } from '@/types/post';

// Mock data for development
export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'My First Post',
    content: 'This is my first post content',
    description: 'A brief description of my first post',
    thumbnail: 'https://picsum.photos/400/300',
    createdAt: new Date().toISOString(),
    creator: {
      id: '1',
      username: 'johndoe',
      avatar: 'https://picsum.photos/200/200'
    },
    likes: 42,
    comments: 7,
    views: 156,
    isPremium: false,
    media: [
      {
        type: 'image',
        url: 'https://picsum.photos/800/600',
        thumbnail: 'https://picsum.photos/400/300'
      }
    ]
  },
  {
    id: '2',
    title: 'Premium Content',
    content: 'This is premium content',
    description: 'A premium post with exclusive content',
    thumbnail: 'https://picsum.photos/400/300',
    createdAt: new Date().toISOString(),
    creator: {
      id: '1',
      username: 'johndoe',
      avatar: 'https://picsum.photos/200/200'
    },
    likes: 128,
    comments: 24,
    views: 512,
    isPremium: true,
    media: [
      {
        type: 'video',
        url: 'https://example.com/video.mp4',
        thumbnail: 'https://picsum.photos/400/300'
      }
    ]
  },
  {
    id: '3',
    title: 'Advanced Portrait Techniques',
    description: 'Take your portrait photography to the next level.',
    thumbnail: 'https://picsum.photos/800/600?random=3',
    creator: {
      id: '3',
      username: 'portrait_pro',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
    likes: 234,
    comments: 45,
    views: 2100,
    isPremium: true
  }
];

export const MOCK_CREATORS = [
  {
    id: '1',
    username: 'photo_master',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    followers: 15600,
    posts: 127,
    isVerified: true
  },
  {
    id: '2',
    username: 'art_guru',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    followers: 8900,
    posts: 89,
    isVerified: true
  },
  {
    id: '3',
    username: 'portrait_pro',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    followers: 23400,
    posts: 156,
    isVerified: true
  },
  {
    id: '4',
    username: 'creative_mind',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    followers: 12300,
    posts: 78,
    isVerified: false
  }
];

export const MOCK_USER = {
  id: '1',
  username: 'johndoe',
  email: 'john@example.com',
  fullName: 'John Doe',
  avatar: 'https://picsum.photos/200/200',
  bio: 'Content creator and enthusiast',
  location: 'San Francisco, CA',
  website: 'https://example.com',
  role: 'creator',
  isVerified: true,
}; 