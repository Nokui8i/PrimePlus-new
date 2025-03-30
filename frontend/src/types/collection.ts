export interface Collection {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  postIds: string[];
  isPrivate: boolean;
  coverImageUrl?: string;
}

export interface CollectionPost {
  id: string;
  collectionId: string;
  postId: string;
  addedAt: Date;
  post: {
    id: string;
    title: string;
    content: string;
    thumbnailUrl?: string;
    creatorId: string;
    createdAt: Date;
  };
}

export interface CreateCollectionInput {
  name: string;
  description?: string;
  isPrivate?: boolean;
  coverImageUrl?: string;
}

export interface UpdateCollectionInput {
  name?: string;
  description?: string;
  isPrivate?: boolean;
  coverImageUrl?: string;
  postIds?: string[];
} 