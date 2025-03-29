import { Request, Response, NextFunction } from 'express';

export const isCreator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.user.role !== 'CREATOR') {
    return res.status(403).json({ error: 'Forbidden: Creator access required' });
  }

  next();
}; 