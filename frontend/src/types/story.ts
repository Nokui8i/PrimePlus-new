export type StoryMedia = {
  url: string;
  type: 'image' | 'video';
  duration?: number; // Duration in seconds for videos or custom duration for images
};

export type StoryItem = {
  id: string;
  creatorId: string;
  media: StoryMedia;
  createdAt: Date;
  expiresAt: Date;
  viewCount: number;
  isPromoted?: boolean;
  promotionDetails?: {
    startDate: Date;
    endDate: Date;
    targetAudience?: string[];
    budget: number;
    status: 'active' | 'pending' | 'completed' | 'paused';
  };
  interactions?: {
    likes: number;
    replies: number;
  };
};

export type Creator = {
  id: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  hasNewStory: boolean;
  isPromoted?: boolean;
  stories: StoryItem[];
}; 