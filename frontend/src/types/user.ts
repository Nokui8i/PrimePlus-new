export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  location: string;
  websiteUrl: string;
  amazonWishlist: string;
  profileImage: string;
  coverImage: string;
  isCreator: boolean;
  role: 'user' | 'creator' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
} 