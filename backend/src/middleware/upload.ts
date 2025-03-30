import fileUpload from 'express-fileupload';

export const upload = fileUpload({
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
  abortOnLimit: true,
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true,
  safeFileNames: true,
  preserveExtension: true,
}); 