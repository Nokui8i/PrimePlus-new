export interface MediaItem {
  file: File;
  preview: string;
  type: 'image' | 'video' | 'vr';
  subscriptionPackId: string | 'free' | 'individual' | null;
  individualPrice?: number;
  includeInSubscription: boolean;
  selectedPacks?: string[];
}

export interface MediaUploadResponse {
  id: string;
  url: string;
  type: 'image' | 'video' | 'vr';
  thumbnail?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    size: number;
  };
} 