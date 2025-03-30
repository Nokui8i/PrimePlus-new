import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// Temporary static content for development
const staticVRContent = [
  {
    id: '1',
    title: 'Ocean Exploration VR',
    description: 'Dive deep into the ocean and discover marine life in stunning VR',
    contentType: '360-video',
    isPremium: true,
    price: 4.99,
    tags: ['ocean', 'nature', 'wildlife'],
    environment: 'underwater',
    mediaUrl: '/vr/ocean-360.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1682687220742-aba19b51f11d',
    hotspots: [
      {
        id: 'spot1',
        position: { x: 1, y: 1.6, z: -2 },
        rotation: { x: 0, y: 0, z: 0 },
        type: 'info',
        content: 'Coral Reef Ecosystem'
      }
    ],
    authorId: 'user1',
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
    viewCount: 1250,
    likeCount: 342,
    isPublished: true
  },
  {
    id: '2',
    title: 'Mountain Peak Experience',
    description: 'Stand at the summit of the world\'s highest peaks in virtual reality',
    contentType: '360-image',
    isPremium: false,
    price: 0,
    tags: ['mountains', 'nature', 'adventure'],
    environment: 'mountain',
    mediaUrl: '/vr/mountain-360.jpg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931',
    hotspots: [
      {
        id: 'spot2',
        position: { x: 2, y: 1.6, z: 1 },
        rotation: { x: 0, y: 45, z: 0 },
        type: 'info',
        content: 'Summit View Point'
      }
    ],
    authorId: 'user1',
    createdAt: '2024-03-19T15:30:00Z',
    updatedAt: '2024-03-19T15:30:00Z',
    viewCount: 856,
    likeCount: 245,
    isPublished: true
  },
  {
    id: '3',
    title: 'Interactive Art Gallery',
    description: 'Walk through a virtual art gallery with interactive exhibits',
    contentType: 'vr-room',
    isPremium: true,
    price: 9.99,
    tags: ['art', 'culture', 'interactive'],
    environment: 'gallery',
    mediaUrl: '/vr/gallery.glb',
    thumbnailUrl: 'https://images.unsplash.com/photo-1682687220015-4eec05b87f75',
    hotspots: [
      {
        id: 'spot3',
        position: { x: 0, y: 1.6, z: -1 },
        rotation: { x: 0, y: 0, z: 0 },
        type: 'media',
        content: 'Modern Art Exhibition'
      }
    ],
    authorId: 'user1',
    createdAt: '2024-03-18T09:15:00Z',
    updatedAt: '2024-03-18T09:15:00Z',
    viewCount: 623,
    likeCount: 189,
    isPublished: true
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag');
    const type = searchParams.get('type');

    // Filter content based on search parameters
    let filteredContent = staticVRContent;
    
    if (search) {
      filteredContent = filteredContent.filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (tag) {
      filteredContent = filteredContent.filter(item =>
        item.tags.includes(tag)
      );
    }

    if (type) {
      filteredContent = filteredContent.filter(item =>
        item.contentType === type
      );
    }

    // Calculate pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedContent = filteredContent.slice(start, end);

    return NextResponse.json({
      content: paginatedContent,
      pagination: {
        page,
        limit,
        total: filteredContent.length,
        totalPages: Math.ceil(filteredContent.length / limit)
      }
    });
  } catch (error) {
    console.error('Error in VR content API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch VR content' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'contentType', 'mediaUrl'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const content = await prisma.vrContent.create({
      data: {
        ...data,
        authorId: session.user.id,
        isPublished: true
      }
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error creating VR content:', error);
    return NextResponse.json(
      { error: 'Failed to create VR content' },
      { status: 500 }
    );
  }
} 