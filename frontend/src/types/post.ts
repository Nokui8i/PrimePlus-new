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

export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface Media {
  type: 'image' | 'video' | 'vr';
  url: string;
  thumbnail?: string;
  subscriptionPackId?: string;
  includeInSubscription?: boolean;
  individualPrice?: number;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  username: string;
  avatar?: string;
}

export interface PostMedia {
  url: string;
  type: 'vr' | 'image' | 'video';
  thumbnail: string;
  subscriptionPackId: string | null;
  includeInSubscription: boolean;
  individualPrice?: number;
}

export interface Creator {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  followers: number;
  posts: number;
  isVerified: boolean;
}

export interface BasePost {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail?: string;
  likes: number;
  views: number;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  authorId?: string;
}

export interface Post extends BasePost {
  isEditing: boolean;
  creator: Creator;
  media?: PostMedia[];
  comments: Comment[];
}

export interface LocalPost {
  id: string;
  title: string;
  content: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
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
  media: any[];
  isEditing: boolean;
  authorId: string;
} 