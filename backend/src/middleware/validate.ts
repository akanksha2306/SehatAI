import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../lib/errors.js';

export type ValidationLocation = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, location: ValidationLocation = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[location];

    const result = schema.safeParse(data);

    if (!result.success) {
      const messages = result.error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('; ');
      throw new ValidationError(messages);
    }

    // Replace the original data with the validated and parsed data
    req[location] = result.data as never;

    next();
  };
}
