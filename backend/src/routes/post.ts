import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment
} from '../controllers/post';

const router = Router();

// Create post
router.post('/', authenticate, createPost);

// Get all posts
router.get('/', getPosts);

// Get single post
router.get('/:id', getPost);

// Update post
router.put('/:id', authenticate, updatePost);

// Delete post
router.delete('/:id', authenticate, deletePost);

// Like post
router.post('/:id/like', authenticate, likePost);

// Unlike post
router.delete('/:id/like', authenticate, unlikePost);

// Add comment
router.post('/:id/comments', authenticate, addComment);

// Delete comment
router.delete('/:id/comments/:commentId', authenticate, deleteComment);

export default router; 