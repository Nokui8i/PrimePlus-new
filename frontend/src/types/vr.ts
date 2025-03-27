export interface VRHotspot {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  type: 'info' | 'media' | 'link';
  content: string;
  linkedContentId?: string;
}

export interface VRContent {
  id: string;
  title: string;
  description: string;
  contentType: '360-image' | '360-video' | 'vr-room';
  isPremium: boolean;
  price: number;
  tags: string[];
  environment: string;
  mediaUrl: string;
  thumbnailUrl: string;
  hotspots: VRHotspot[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  isPublished: boolean;
  requiredSubscriptionTier?: string;
} 