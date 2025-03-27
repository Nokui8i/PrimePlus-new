const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const SUPPORTED_VR_FORMATS = [
  // 3D Models
  '.glb',
  '.gltf',
  // 360° Videos
  '.mp4',
  '.webm',
  // 360° Images
  '.jpg',
  '.jpeg',
  '.png',
  '.webp'
];

export interface UploadResult {
  url: string;
  type: 'model' | '360-video' | '360-image';
  filename: string;
  size: number;
}

export interface UploadError {
  message: string;
  code: 'FILE_TOO_LARGE' | 'UNSUPPORTED_FORMAT' | 'UPLOAD_FAILED';
}

export function validateVRFile(file: File): UploadError | null {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      code: 'FILE_TOO_LARGE'
    };
  }

  // Check file format
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!SUPPORTED_VR_FORMATS.includes(fileExtension)) {
    return {
      message: `Unsupported file format. Supported formats: ${SUPPORTED_VR_FORMATS.join(', ')}`,
      code: 'UNSUPPORTED_FORMAT'
    };
  }

  return null;
}

export function getVRContentType(filename: string): 'model' | '360-video' | '360-image' {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  if (extension === 'glb' || extension === 'gltf') {
    return 'model';
  }
  
  if (extension === 'mp4' || extension === 'webm') {
    return '360-video';
  }
  
  return '360-image';
}

export async function uploadVRFile(file: File): Promise<UploadResult> {
  // Validate file first
  const validationError = validateVRFile(file);
  if (validationError) {
    throw validationError;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/vr', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    
    return {
      url: data.url,
      type: getVRContentType(file.name),
      filename: file.name,
      size: file.size
    };
  } catch (error) {
    throw {
      message: 'Failed to upload file',
      code: 'UPLOAD_FAILED'
    } as UploadError;
  }
}

export function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const type = getVRContentType(file.name);

    if (type === 'model') {
      // For 3D models, use a default thumbnail
      resolve('/images/3d-model-thumbnail.png');
    } else if (type === '360-video') {
      // For videos, generate thumbnail from first frame
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.onloadeddata = () => {
        video.currentTime = 0;
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0);
          resolve(canvas.toDataURL('image/jpeg'));
          URL.revokeObjectURL(video.src);
        };
      };
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Failed to generate video thumbnail'));
      };
    } else {
      // For images, create a thumbnail directly
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, 300, 300);
        resolve(canvas.toDataURL('image/jpeg'));
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to generate image thumbnail'));
      };
    }
  });
} 