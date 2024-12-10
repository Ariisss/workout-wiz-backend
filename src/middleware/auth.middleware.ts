import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { JwtPayload } from '../types/types';

declare global{
  namespace Express{
    interface Request{
      user: JwtPayload
    }
  }
}

// validate jwt tokens
export function authMiddleware(req: Request, res: Response, next: NextFunction) {

  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return
  }

  try {
    const decoded = verifyToken(token) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
