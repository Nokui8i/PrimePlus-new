import express from 'express';
import { uploadToCloudStorage } from '../utils/cloudStorage';
import { UploadedFile } from 'express-fileupload';
import fileUpload from 'express-fileupload';

const router = express.Router();

// Middleware for handling file uploads
router.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  abortOnLimit: true
}));

// Upload single file
router.post('/single', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file as UploadedFile;
    const folder = req.body.folder || 'images'; // Default to images folder
    const generateThumbnail = req.body.generateThumbnail === 'true';

    const filePath = await uploadToCloudStorage(file, folder, generateThumbnail);
    res.json({ filePath });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Upload multiple files
router.post('/multiple', async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = Array.isArray(req.files.files) 
      ? req.files.files 
      : [req.files.files];

    const folder = req.body.folder || 'images';
    const generateThumbnail = req.body.generateThumbnail === 'true';

    const results = await Promise.all(
      uploadedFiles.map(file => 
        uploadToCloudStorage(file as UploadedFile, folder, generateThumbnail)
      )
    );

    res.json({ files: results });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router; 