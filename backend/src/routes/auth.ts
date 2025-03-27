import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
} from '../controllers/auth';

const router = Router();

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Logout user
router.post('/logout', logout);

// Refresh access token
router.post('/refresh-token', refreshToken);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

export default router; 