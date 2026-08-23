import { z } from 'zod';

export const promptImproveSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty'),
});

export type PromptImproveRequest = z.infer<typeof promptImproveSchema>;
