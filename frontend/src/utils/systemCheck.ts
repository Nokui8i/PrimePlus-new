import authService from '@/services/authService';
import postService from '@/services/postService';
import subscriptionService from '@/services/subscriptionService';
import mockStorage from '@/services/mockStorage';

interface SystemCheckResult {
  success: boolean;
  component: string;
  message: string;
  error?: any;
}

export const systemCheck = {
  async checkAuth(): Promise<SystemCheckResult> {
    try {
      // Test registration
      const registerResult = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        fullName: 'Test User'
      });
      
      if (!registerResult.token || !registerResult.user) {
        return {
          success: false,
          component: 'Authentication',
          message: 'Registration failed to return proper user data'
        };
      }

      // Test login
      const loginResult = await authService.login({
        email: 'test@example.com',
        password: 'password123'
      });

      if (!loginResult.token || !loginResult.user) {
        return {
          success: false,
          component: 'Authentication',
          message: 'Login failed to return proper user data'
        };
      }

      // Test user session
      const isAuthenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();

      if (!isAuthenticated || !currentUser) {
        return {
          success: false,
          component: 'Authentication',
          message: 'User session validation failed'
        };
      }

      return {
        success: true,
        component: 'Authentication',
        message: 'All authentication checks passed'
      };
    } catch (error) {
      return {
        success: false,
        component: 'Authentication',
        message: 'Authentication check failed',
        error
      };
    }
  },

  async checkContent(): Promise<SystemCheckResult> {
    try {
      // Test post creation
      const newPost = await postService.createPost({
        title: 'Test Post',
        content: 'This is a test post',
        description: 'Test description',
        isPremium: false,
        media: []
      });

      if (!newPost.id) {
        return {
          success: false,
          component: 'Content',
          message: 'Post creation failed'
        };
      }

      // Test post retrieval
      const posts = await postService.getPosts();
      if (!posts.posts.length) {
        return {
          success: false,
          component: 'Content',
          message: 'Post retrieval failed'
        };
      }

      // Test post update
      const updatedPost = await postService.updatePost(newPost.id, {
        content: 'Updated content'
      });

      if (!updatedPost || updatedPost.content !== 'Updated content') {
        return {
          success: false,
          component: 'Content',
          message: 'Post update failed'
        };
      }

      // Test post interaction
      await postService.likePost(newPost.id);
      const likedPost = await postService.getPostById(newPost.id);
      
      if (!likedPost || likedPost.likes !== 1) {
        return {
          success: false,
          component: 'Content',
          message: 'Post interaction failed'
        };
      }

      return {
        success: true,
        component: 'Content',
        message: 'All content checks passed'
      };
    } catch (error) {
      return {
        success: false,
        component: 'Content',
        message: 'Content check failed',
        error
      };
    }
  },

  async checkSubscriptions(): Promise<SystemCheckResult> {
    try {
      // Test plan retrieval
      const plans = await subscriptionService.getPlans();
      if (!plans.length) {
        return {
          success: false,
          component: 'Subscriptions',
          message: 'Subscription plans retrieval failed'
        };
      }

      // Test subscription creation
      const subscription = await subscriptionService.subscribe(plans[0].id);
      if (!subscription || subscription.status !== 'active') {
        return {
          success: false,
          component: 'Subscriptions',
          message: 'Subscription creation failed'
        };
      }

      // Test subscription retrieval
      const currentSub = await subscriptionService.getCurrentSubscription();
      if (!currentSub) {
        return {
          success: false,
          component: 'Subscriptions',
          message: 'Current subscription retrieval failed'
        };
      }

      // Test subscription cancellation
      await subscriptionService.cancelSubscription(subscription.id);
      const cancelledSub = await subscriptionService.getCurrentSubscription();
      
      if (cancelledSub?.status !== 'cancelled') {
        return {
          success: false,
          component: 'Subscriptions',
          message: 'Subscription cancellation failed'
        };
      }

      return {
        success: true,
        component: 'Subscriptions',
        message: 'All subscription checks passed'
      };
    } catch (error) {
      return {
        success: false,
        component: 'Subscriptions',
        message: 'Subscription check failed',
        error
      };
    }
  },

  async checkStorage(): Promise<SystemCheckResult> {
    try {
      // Test storage initialization
      mockStorage.initialize();
      
      // Test basic storage operations
      const testKey = 'test_key';
      const testData = { test: 'data' };
      
      mockStorage.set(testKey, testData);
      const retrieved = mockStorage.get(testKey);
      
      if (!retrieved || retrieved.test !== 'data') {
        return {
          success: false,
          component: 'Storage',
          message: 'Basic storage operations failed'
        };
      }

      // Test storage update
      const updated = mockStorage.update(testKey, (data) => ({
        ...data,
        updated: true
      }));

      if (!updated || !updated.updated) {
        return {
          success: false,
          component: 'Storage',
          message: 'Storage update operation failed'
        };
      }

      // Test storage removal
      mockStorage.remove(testKey);
      const removed = mockStorage.get(testKey);
      
      if (removed !== null) {
        return {
          success: false,
          component: 'Storage',
          message: 'Storage removal operation failed'
        };
      }

      return {
        success: true,
        component: 'Storage',
        message: 'All storage checks passed'
      };
    } catch (error) {
      return {
        success: false,
        component: 'Storage',
        message: 'Storage check failed',
        error
      };
    }
  },

  async runAllChecks(): Promise<SystemCheckResult[]> {
    const results: SystemCheckResult[] = [];

    // Run all checks in sequence
    results.push(await this.checkStorage());
    results.push(await this.checkAuth());
    results.push(await this.checkContent());
    results.push(await this.checkSubscriptions());

    return results;
  }
}; 