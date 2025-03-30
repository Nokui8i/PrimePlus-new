import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError, ErrorResponse } from '../utils/error';
import { sendEmail } from '../utils/email';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

// In-memory storage
const users: any[] = [];
const refreshTokens: any[] = [];

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, username } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => 
      user.email === email || user.username === (username || email.split('@')[0])
    );

    if (existingUser) {
      throw createError(400, 'User already exists with this email or username');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: fullName,
      email,
      username: username || email.split('@')[0],
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(user);

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token
    refreshTokens.push({
      token: refreshToken,
      userId: user.id
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    const err = error as ErrorResponse;
    res.status(err.statusCode || 500).json({
      message: err.message || 'Error registering user'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      throw createError(401, 'Invalid credentials');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      throw createError(401, 'Invalid credentials');
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token
    refreshTokens.push({
      token: refreshToken,
      userId: user.id
    });

    console.log('Login successful for user:', user.id);
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    const err = error as ErrorResponse;
    res.status(err.statusCode || 500).json({
      message: err.message || 'Error logging in'
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError(400, 'Refresh token is required');
    }

    // Delete refresh token
    const index = refreshTokens.findIndex(t => t.token === refreshToken);
    if (index !== -1) {
      refreshTokens.splice(index, 1);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    const err = error as ErrorResponse;
    res.status(err.statusCode || 500).json({
      message: err.message || 'Error logging out'
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError(400, 'Refresh token is required');
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };

    // Check if refresh token exists
    const token = refreshTokens.find(t => t.token === refreshToken);

    if (!token) {
      throw createError(401, 'Invalid refresh token');
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (error) {
    const err = error as ErrorResponse;
    res.status(err.statusCode || 500).json({
      message: err.message || 'Error refreshing token'
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
      throw createError(404, 'User not found');
    }

    res.json({ message: 'Password reset email sent (demo mode)' });
  } catch (error) {
    const err = error as ErrorResponse;
    res.status(err.statusCode || 500).json({
      message: err.message || 'Error processing forgot password request'
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    // In demo mode, we'll just accept any token
    const user = users[0]; // Just get the first user for demo

    if (!user) {
      throw createError(400, 'Invalid or expired reset token');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password
    user.password = hashedPassword;

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    const err = error as ErrorResponse;
    res.status(err.statusCode || 500).json({
      message: err.message || 'Error resetting password'
    });
  }
}; 