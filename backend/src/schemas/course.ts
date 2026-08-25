import { z } from 'zod';

export const trackSchema = z.enum(['prompt', 'hall', 'promptlab_dummy']);

export const completeChapterSchema = z.object({
  quizScore: z.number().int().min(0),
});

export type CompleteChapterRequest = z.infer<typeof completeChapterSchema>;
