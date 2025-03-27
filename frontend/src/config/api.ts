export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    validateToken: '/auth/validate-token',
    refreshToken: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password'
  },
  user: {
    currentUser: '/users/profile',
    updateProfile: '/users/profile',
    updateSettings: '/users/settings',
    changePassword: '/users/change-password',
    getUserById: (id: string) => `/users/${id}`,
    getUserFollowers: (id: string) => `/users/${id}/followers`,
    getUserFollowing: (id: string) => `/users/${id}/following`,
    followUser: (id: string) => `/users/${id}/follow`,
    unfollowUser: (id: string) => `/users/${id}/unfollow`,
    searchCreators: '/users/search/creators',
    applyForCreator: '/users/apply-creator',
    getTopCreators: '/users/top-creators'
  },
  subscription: {
    plans: '/subscription/plans',
    createPlan: '/subscription/plans',
    updatePlan: (id: string) => `/subscription/plans/${id}`,
    deletePlan: (id: string) => `/subscription/plans/${id}`,
    subscribe: '/subscription/subscribe',
    cancelSubscription: (id: string) => `/subscription/${id}/cancel`,
    getSubscriptions: '/subscription/list',
    getSubscriptionDetails: (id: string) => `/subscription/${id}`
  },
  content: {
    createPost: '/posts',
    getPost: (id: string) => `/posts/${id}`,
    updatePost: (id: string) => `/posts/${id}`,
    deletePost: (id: string) => `/posts/${id}`,
    likePost: (id: string) => `/posts/${id}/like`,
    unlikePost: (id: string) => `/posts/${id}/unlike`,
    commentOnPost: (id: string) => `/posts/${id}/comments`,
    getFeed: '/posts/feed',
    getUserPosts: (userId: string) => `/posts/user/${userId}`
  },
  upload: {
    single: '/upload/single',
    multiple: '/upload/multiple'
  }
}; 