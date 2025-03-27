import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Post } from '@/types/post';

// Mock database for demo purposes
let posts: Post[] = [];

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const content = formData.get('content') as string;
    const files = formData.getAll('files') as File[];
    const isPremium = formData.get('isPremium') === 'true';
    const price = formData.get('price') ? parseFloat(formData.get('price') as string) : null;

    // In a real application, you would:
    // 1. Upload files to a storage service (e.g., AWS S3)
    // 2. Store metadata in your database
    // 3. Process VR files if needed
    // For now, we'll just mock the response

    const mediaFiles = await Promise.all(files.map(async (file) => {
      const isVR = file.name.endsWith('.glb') || file.name.endsWith('.gltf');
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      // In a real app, this would be the URL from your storage service
      const mockUrl = `https://example.com/media/${file.name}`;

      return {
        url: mockUrl,
        type: isVR ? 'vr' as const : isImage ? 'image' as const : 'video' as const,
        filename: file.name,
        size: file.size
      };
    }));

    const post: Post = {
      id: Date.now().toString(),
      content,
      media: mediaFiles,
      isPremium,
      price,
      author: {
        id: session.user.id || '',
        name: session.user.name || null,
        avatar: session.user.image || null
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0
    };

    // In a real app, save to database
    posts.push(post);

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') as 'image' | 'video' | 'vr' | null;

    let filteredPosts = [...posts];

    // Filter by type if specified
    if (type) {
      filteredPosts = filteredPosts.filter(post => 
        post.media.some(media => media.type === type)
      );
    }

    // Sort by newest first
    filteredPosts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPosts = filteredPosts.slice(start, end);

    return NextResponse.json({
      posts: paginatedPosts,
      total: filteredPosts.length,
      page,
      totalPages: Math.ceil(filteredPosts.length / limit)
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
} 