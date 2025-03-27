import request from 'supertest';
import app from '../app';
import path from 'path';
import fs from 'fs/promises';

describe('File Upload System', () => {
  const testImagePath = path.join(__dirname, 'test-files', 'test-image.jpg');
  
  beforeAll(async () => {
    // Create test directories
    await fs.mkdir(path.join(__dirname, 'test-files'), { recursive: true });
    // Create a test image
    const testImage = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    await fs.writeFile(testImagePath, testImage);
  });

  afterAll(async () => {
    // Cleanup test files
    await fs.rm(path.join(__dirname, 'test-files'), { recursive: true, force: true });
  });

  it('should upload a single file', async () => {
    const response = await request(app)
      .post('/api/upload/single')
      .attach('file', testImagePath)
      .field('folder', 'images')
      .field('generateThumbnail', 'true');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('filePath');
    expect(response.body.filePath).toMatch(/^\/uploads\/images\//);
  });

  it('should handle multiple file uploads', async () => {
    const response = await request(app)
      .post('/api/upload/multiple')
      .attach('files', testImagePath)
      .attach('files', testImagePath)
      .field('folder', 'images');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('files');
    expect(Array.isArray(response.body.files)).toBe(true);
    expect(response.body.files.length).toBe(2);
  });

  it('should handle missing files', async () => {
    const response = await request(app)
      .post('/api/upload/single')
      .field('folder', 'images');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should generate thumbnails when requested', async () => {
    const response = await request(app)
      .post('/api/upload/single')
      .attach('file', testImagePath)
      .field('folder', 'images')
      .field('generateThumbnail', 'true');

    expect(response.status).toBe(200);
    expect(response.body.filePath).toMatch(/^\/uploads\/thumbnails\/thumb-/);
  });
}); 