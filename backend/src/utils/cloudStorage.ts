import { UploadedFile } from 'express-fileupload';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure upload directories exist
async function ensureUploadDirs() {
  const dirs = ['images', 'videos', 'vr-content', 'thumbnails'];
  for (const dir of dirs) {
    const fullPath = path.join(UPLOAD_DIR, dir);
    await fs.mkdir(fullPath, { recursive: true });
  }
}

// Initialize upload directories
ensureUploadDirs().catch(console.error);

export async function uploadToCloudStorage(
  file: UploadedFile,
  folder: string,
  generateThumbnail: boolean = false
): Promise<string> {
  try {
    let buffer = file.data;
    let fileName = `${Date.now()}-${file.name}`;
    let uploadPath = path.join(UPLOAD_DIR, folder);
    
    if (generateThumbnail) {
      buffer = await sharp(file.data)
        .resize(400, 400, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({ quality: 80 })
        .toBuffer();
      uploadPath = path.join(UPLOAD_DIR, 'thumbnails');
      fileName = `thumb-${fileName}`;
    }

    const filePath = path.join(uploadPath, fileName);
    await fs.writeFile(filePath, buffer);

    // Return a URL-like path that can be used by the frontend
    return `/uploads/${folder}/${fileName}`;
  } catch (error) {
    console.error('Error uploading file to local storage:', error);
    throw new Error('Failed to upload file');
  }
} 