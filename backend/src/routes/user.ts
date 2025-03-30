import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getProfile,
  updateProfile,
  deleteProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} from '../controllers/user';

const router = Router();

// Get user profile
router.get('/profile', authenticate, getProfile);

// Update user profile
router.put('/profile', authenticate, updateProfile);

// Delete user profile
router.delete('/profile', authenticate, deleteProfile);

// Follow user
router.post('/:userId/follow', authenticate, followUser);

// Unfollow user
router.delete('/:userId/follow', authenticate, unfollowUser);

// Get user followers
router.get('/:userId/followers', getFollowers);

// Get user following
router.get('/:userId/following', getFollowing);

export default router; 