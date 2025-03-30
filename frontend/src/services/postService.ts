import mockStorage from './mockStorage';
import { Post, Comment } from '@/types/post';

export const postService = {
  getPosts: async (page = 1, limit = 10) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const posts = mockStorage.getPosts() as Post[];
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPosts = posts.slice(start, end);

    return {
      posts: paginatedPosts,
      total: posts.length,
      hasMore: end < posts.length
    };
  },

  getPostById: async (postId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const posts = mockStorage.getPosts() as Post[];
    return posts.find((post: Post) => post.id === postId);
  },

  createPost: async (postData: Partial<Post>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentUser = mockStorage.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    const newPost = {
      ...postData,
      creator: {
        id: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar
      },
      likes: 0,
      comments: [] as Comment[],
      views: 0,
      isPremium: postData.isPremium || false,
      media: postData.media || []
    };

    return mockStorage.addPost(newPost);
  },

  updatePost: async (postId: string, updates: Partial<Post>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStorage.updatePost(postId, updates);
  },

  deletePost: async (postId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStorage.deletePost(postId);
  },

  likePost: async (postId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockStorage.update('primePlus_posts', (posts: Post[]) => {
      return posts.map(post => 
        post.id === postId 
          ? { ...post, likes: (post.likes || 0) + 1 }
          : post
      );
    });
  },

  unlikePost: async (postId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockStorage.update('primePlus_posts', (posts: Post[]) => {
      return posts.map(post => 
        post.id === postId 
          ? { ...post, likes: Math.max(0, (post.likes || 0) - 1) }
          : post
      );
    });
  },

  addComment: async (postId: string, comment: { content: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const currentUser = mockStorage.getCurrentUser();
    if (!currentUser) throw new Error('Not authenticated');

    return mockStorage.update('primePlus_posts', (posts: Post[]) => {
      return posts.map(post => {
        if (post.id === postId) {
          const comments = Array.isArray(post.comments) ? post.comments : [];
          return {
            ...post,
            comments: [
              ...comments,
              {
                id: String(Date.now()),
                content: comment.content,
                createdAt: new Date().toISOString(),
                user: {
                  id: currentUser.id,
                  username: currentUser.username,
                  avatar: currentUser.avatar
                }
              }
            ]
          };
        }
        return post;
      });
    });
  },

  getPostComments: async (postId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const posts = mockStorage.getPosts() as Post[];
    const post = posts.find((p: Post) => p.id === postId);
    return post?.comments || [];
  }
};

export default postService; 