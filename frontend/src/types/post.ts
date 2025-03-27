export interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video' | 'vr';
}

export interface PostFormData {
  content: string;
  files: File[];
  isPremium: boolean;
  price?: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  creator: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  views: number;
  isPremium: boolean;
  media?: {
    url: string;
    type: 'vr' | 'image' | 'video';
    thumbnail?: string;
    subscriptionPackId?: string | null;
    includeInSubscription?: boolean;
    individualPrice?: number;
  }[];
} 