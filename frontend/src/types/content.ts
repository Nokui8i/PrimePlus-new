export interface ContentTag {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export type ContentType = 'video' | 'audio' | 'image' | 'text' | 'mixed';

export interface ContentFilter {
  category?: string;
  tags?: string[];
  search?: string;
  creatorId?: string;
  fromDate?: string;
  toDate?: string;
  status?: 'published' | 'draft' | 'archived';
  type?: ContentType;
  isPremium?: boolean;
}

export interface ContentFeedFilters extends ContentFilter {
  sort?: 'recent' | 'popular' | 'trending';
  limit?: number;
  page?: number;
}

export interface Creator {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  bio?: string;
  subscriberCount?: number;
  contentCount?: number;
}

export interface ContentComment {
  id: string;
  contentId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  repliesCount: number;
  isLiked?: boolean;
}

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  mediaType: ContentType;
  mediaUrl?: string;
  contentUrl?: string;
  duration?: number; // in seconds
  isPremium: boolean;
  isPublished: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: ContentTag[];
  creator: Creator;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface ContentListResponse {
  items: ContentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ContentResponse {
  content: ContentItem;
  related?: ContentItem[];
}

export interface ContentPayload {
  title: string;
  description?: string;
  thumbnail?: string | File;
  mediaType: ContentType;
  mediaUrl?: string;
  contentUrl?: string;
  isPremium: boolean;
  isPublished: boolean;
  tags?: string[];
}

export interface CommentListResponse {
  comments: ContentComment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CommentPayload {
  contentId: string;
  text: string;
  parentId?: string;
}

export interface ContentStatistics {
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  viewsChange: number; // Percentage change over last period
  likesChange: number;
  commentsChange: number;
  savesChange: number;
  viewsByDay: Array<{ date: string; count: number }>;
  viewsByLocation: Array<{ location: string; count: number }>;
  topReferrers: Array<{ source: string; count: number }>;
}

export interface ContentTypeAccess {
  regularContent: boolean;
  premiumVideos: boolean;
  vrContent: boolean;
  threeSixtyContent: boolean;
  liveRooms: boolean;
  interactiveModels: boolean;
} 