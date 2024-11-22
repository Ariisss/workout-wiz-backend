import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { JwtPayload } from '../types/types';
import { AuthenticatedRequest } from '../types/types';

// validate jwt tokens
function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
