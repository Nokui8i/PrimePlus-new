import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ErrorResponse } from '../utils/error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          message: 'A record with this value already exists',
          errors: err.meta
        });
      case 'P2025':
        return res.status(404).json({
          message: 'Record not found',
          errors: err.meta
        });
      default:
        return res.status(500).json({
          message: 'Database error',
          errors: err.meta
        });
    }
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: Object.values((err as any).errors).map((e: any) => e.message)
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
      errors: [err.message]
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired',
      errors: [err.message]
    });
  }

  // Handle custom error response
  if ((err as ErrorResponse).statusCode) {
    return res.status((err as ErrorResponse).statusCode!).json(err);
  }

  // Default error
  res.status(500).json({
    message: 'Internal server error',
    errors: [err.message]
  });
}; 