import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors.js';

interface ErrorResponse {
  error: {
    message: string;
    code: string;
  };
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err);

  if (err instanceof AppError) {
    const response: ErrorResponse = {
      error: {
        message: err.message,
        code: err.code,
      },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Unhandled error
  const response: ErrorResponse = {
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    },
  };
  res.status(500).json(response);
}
