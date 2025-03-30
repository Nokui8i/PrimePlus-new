import mockStorage from './mockStorage';
import { MOCK_USER } from './mockData';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

const MOCK_TOKEN = 'mock_jwt_token';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock validation
    if (credentials.email === MOCK_USER.email) {
      const authState = {
        token: MOCK_TOKEN,
        user: MOCK_USER,
      };
      mockStorage.setAuthState(authState);
      return authState;
    }

    throw new Error('Invalid credentials');
  },

  register: async (data: RegisterData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create new user
    const newUser = {
      id: String(Date.now()),
      email: data.email,
      username: data.username,
      fullName: data.fullName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: 'user',
      isVerified: false,
    };

    const authState = {
      token: MOCK_TOKEN,
      user: newUser,
    };

    mockStorage.setAuthState(authState);
    mockStorage.set('primePlus_user', newUser);

    return authState;
  },

  logout: async () => {
    mockStorage.remove('primePlus_auth');
    return true;
  },

  getCurrentUser: () => {
    const authState = mockStorage.getAuthState();
    return authState?.user || null;
  },

  isAuthenticated: () => {
    const authState = mockStorage.getAuthState();
    return !!authState?.token;
  },

  getToken: () => {
    const authState = mockStorage.getAuthState();
    return authState?.token || null;
  },

  updateProfile: async (updates: Partial<typeof MOCK_USER>) => {
    const updatedUser = mockStorage.updateUser(updates);
    const authState = mockStorage.getAuthState();
    if (authState) {
      mockStorage.setAuthState({
        ...authState,
        user: updatedUser,
      });
    }
    return updatedUser;
  },
};

export default authService;