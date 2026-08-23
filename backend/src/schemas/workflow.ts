import { z } from 'zod';

export const generateWorkflowSchema = z.object({
  task: z.string().min(1, 'Task cannot be empty'),
  description: z.string().optional(),
});

export type GenerateWorkflowRequest = z.infer<typeof generateWorkflowSchema>;

export const saveWorkflowSchema = z.object({
  task: z.string().min(1, 'Task cannot be empty'),
  description: z.string().optional(),
  output: z.string().min(1, 'Output cannot be empty'),
});

export type SaveWorkflowRequest = z.infer<typeof saveWorkflowSchema>;
