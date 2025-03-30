declare module '@/types/content' {
  export type ContentType = 'image' | 'video' | 'audio';

  export interface MediaFile {
    id?: string;
    file?: File;
    fileName: string;
    fileSize: number;
    mimeType: string;
    preview?: string;
    progress: number;
    status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
    mediaType: ContentType | 'other';
    url?: string;
    thumbnail?: string;
    error?: string;
  }

  export interface ContentVisibilitySettings {
    selectedPlans: string[];
    individualPrice: number | null;
    isFreeForAll: boolean;
  }

  export interface ContentData {
    title: string;
    description: string;
    contentType: ContentType;
    tags: string[];
    isPublished: boolean;
    visibleToPlans: string[];
    individualPrice: number | null;
    isFreeForAll: boolean;
    mediaIds: string[];
  }
} 