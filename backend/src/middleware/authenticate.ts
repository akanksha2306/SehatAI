import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../lib/jwt.js';
import { UnauthorizedError } from '../lib/errors.js';
import type { AuthenticatedRequest } from '../controllers/AuthController.js';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyJWT(token);
    const authReq = req as AuthenticatedRequest;
    authReq.user = {
      userId: payload.userId,
    };
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}
