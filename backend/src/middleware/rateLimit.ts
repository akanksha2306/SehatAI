import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { RateLimitError } from '../lib/errors.js';
import type { AuthenticatedRequest } from '../controllers/AuthController.js';

/**
 * Create a per-user rate limiter for authenticated endpoints.
 * Limits requests based on req.user.userId, not IP.
 * Suitable for AI integration endpoints where cost is per-user.
 */
export function createUserRateLimiter(
  windowMs: number = 60 * 1000, // 1 minute
  max: number = 10 // requests per window
) {
  const limiter = rateLimit({
    windowMs,
    max,
    keyGenerator: (req: Request): string => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.userId;
      if (!userId) {
        // If user is not authenticated, this shouldn't happen since we apply
        // this middleware after authenticate, but be defensive
        return 'anonymous';
      }
      return userId;
    },
    skip: (req: Request): boolean => {
      // Skip rate limiting for unauthenticated requests
      // (they should be caught by authenticate middleware anyway)
      const authReq = req as AuthenticatedRequest;
      return !authReq.user?.userId;
    },
    handler: (req: Request, res: Response, next: NextFunction): void => {
      // Custom handler to throw our AppError instead of the default response
      throw new RateLimitError(
        'Too many requests to this endpoint. Please try again later.'
      );
    },
    standardHeaders: false, // Disable default headers (X-RateLimit-*)
    legacyHeaders: false,
  });

  return limiter;
}
