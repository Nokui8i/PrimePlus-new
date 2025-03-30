import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'vr');

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the file from form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate unique filename
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const filename = `${uuidv4()}${fileExtension}`;
    const relativePath = join('uploads', 'vr', filename);
    const absolutePath = join(UPLOAD_DIR, filename);

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    await writeFile(absolutePath, buffer);

    // Return the public URL
    return NextResponse.json({
      url: `/${relativePath.replace(/\\/g, '/')}`,
      filename: file.name,
      size: file.size
    });
  } catch (error) {
    console.error('Error uploading VR file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'VR upload endpoint' });
} 