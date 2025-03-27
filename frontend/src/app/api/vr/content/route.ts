import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const contentType = formData.get('contentType') as string;
    const isPremium = formData.get('isPremium') === 'true';
    const price = parseFloat(formData.get('price') as string) || 0;
    const tags = JSON.parse(formData.get('tags') as string);
    const environment = formData.get('environment') as string;
    const hotspots = JSON.parse(formData.get('hotspots') as string);
    const file = formData.get('file') as File;

    if (!file || !title || !description || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create unique filename
    const ext = file.name.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'vr');
    const filepath = join(uploadDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Create VR content record in database
    const vrContent = await prisma.vrContent.create({
      data: {
        title,
        description,
        contentType,
        isPremium,
        price,
        tags,
        environment,
        hotspots,
        mediaUrl: `/uploads/vr/${filename}`,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(vrContent);
  } catch (error) {
    console.error('Error creating VR content:', error);
    return NextResponse.json(
      { error: 'Failed to create VR content' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const contentType = searchParams.get('contentType');
    const isPremium = searchParams.get('isPremium');
    const authorId = searchParams.get('authorId');

    const where: any = {};
    if (contentType) where.contentType = contentType;
    if (isPremium) where.isPremium = isPremium === 'true';
    if (authorId) where.authorId = authorId;

    const vrContent = await prisma.vrContent.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(vrContent);
  } catch (error) {
    console.error('Error fetching VR content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch VR content' },
      { status: 500 }
    );
  }
} 