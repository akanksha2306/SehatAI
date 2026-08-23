import { z } from 'zod';

export const scribeTranslateSchema = z.object({
  transcript: z.string().min(1, 'Transcript cannot be empty'),
  dialect: z.string().min(1, 'Dialect cannot be empty'),
});

export type ScribeTranslateRequest = z.infer<typeof scribeTranslateSchema>;
