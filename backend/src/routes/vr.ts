import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createVRContent,
  getVRContents,
  getVRContent,
  updateVRContent,
  deleteVRContent,
  likeVRContent,
  unlikeVRContent
} from '../controllers/vr';

const router = Router();

// Create VR content
router.post('/', authenticate, createVRContent);

// Get all VR content
router.get('/', getVRContents);

// Get single VR content
router.get('/:id', getVRContent);

// Update VR content
router.put('/:id', authenticate, updateVRContent);

// Delete VR content
router.delete('/:id', authenticate, deleteVRContent);

// Like VR content
router.post('/:id/like', authenticate, likeVRContent);

// Unlike VR content
router.delete('/:id/like', authenticate, unlikeVRContent);

export default router; 