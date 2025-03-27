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
  content: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  views: number;
  isPremium: boolean;
  media?: {
    type: 'image' | 'video' | 'vr';
    url: string;
    thumbnail?: string;
  }[];
} 