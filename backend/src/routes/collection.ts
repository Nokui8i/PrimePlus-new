import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createCollection,
  getCollections,
  getCollection,
  updateCollection,
  deleteCollection,
  addToCollection,
  removeFromCollection
} from '../controllers/collection';

const router = Router();

// Create collection
router.post('/', authenticate, createCollection);

// Get all collections
router.get('/', getCollections);

// Get single collection
router.get('/:id', getCollection);

// Update collection
router.put('/:id', authenticate, updateCollection);

// Delete collection
router.delete('/:id', authenticate, deleteCollection);

// Add item to collection
router.post('/:id/items', authenticate, addToCollection);

// Remove item from collection
router.delete('/:id/items/:itemId', authenticate, removeFromCollection);

export default router; 