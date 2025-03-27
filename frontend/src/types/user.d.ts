interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isCreator: boolean;
  isSubscribed: boolean;
  createdAt: string;
  updatedAt: string;
} 