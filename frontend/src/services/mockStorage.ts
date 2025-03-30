import { MOCK_POSTS, MOCK_CREATORS, MOCK_USER } from './mockData';

const STORAGE_KEYS = {
  POSTS: 'primePlus_posts',
  CREATORS: 'primePlus_creators',
  USER: 'primePlus_user',
  AUTH: 'primePlus_auth',
  SUBSCRIPTIONS: 'primePlus_subscriptions',
};

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(MOCK_POSTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CREATORS)) {
    localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(MOCK_CREATORS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(MOCK_USER));
  }
};

export const mockStorage = {
  initialize: () => {
    initializeStorage();
  },

  // Generic CRUD operations
  get: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  update: (key: string, updater: (data: any) => any) => {
    const data = mockStorage.get(key);
    if (data) {
      const updated = updater(data);
      mockStorage.set(key, updated);
      return updated;
    }
    return null;
  },

  remove: (key: string) => {
    localStorage.removeItem(key);
  },

  // Specific data operations
  getPosts: () => mockStorage.get(STORAGE_KEYS.POSTS) || [],
  getCreators: () => mockStorage.get(STORAGE_KEYS.CREATORS) || [],
  getCurrentUser: () => mockStorage.get(STORAGE_KEYS.USER),
  getAuthState: () => mockStorage.get(STORAGE_KEYS.AUTH),
  getSubscriptions: () => mockStorage.get(STORAGE_KEYS.SUBSCRIPTIONS) || [],

  addPost: (post: any) => {
    const posts = mockStorage.getPosts();
    const newPost = {
      ...post,
      id: String(posts.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStorage.set(STORAGE_KEYS.POSTS, [...posts, newPost]);
    return newPost;
  },

  updatePost: (postId: string, updates: any) => {
    return mockStorage.update(STORAGE_KEYS.POSTS, (posts: any[]) => {
      return posts.map(post => 
        post.id === postId 
          ? { ...post, ...updates, updatedAt: new Date().toISOString() }
          : post
      );
    });
  },

  deletePost: (postId: string) => {
    return mockStorage.update(STORAGE_KEYS.POSTS, (posts: any[]) => 
      posts.filter(post => post.id !== postId)
    );
  },

  updateUser: (updates: any) => {
    const currentUser = mockStorage.getCurrentUser();
    const updatedUser = { ...currentUser, ...updates };
    mockStorage.set(STORAGE_KEYS.USER, updatedUser);
    return updatedUser;
  },

  setAuthState: (authState: any) => {
    mockStorage.set(STORAGE_KEYS.AUTH, authState);
  },
};

export default mockStorage; 