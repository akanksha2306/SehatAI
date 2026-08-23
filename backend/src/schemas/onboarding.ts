import { z } from 'zod';

export const onboardingResponseSchema = z.object({
  confidence: z.enum(['beginner', 'some', 'confident'], {
    errorMap: () => ({
      message: 'confidence must be one of: beginner, some, confident',
    }),
  }),
  challenges: z
    .array(
      z.enum(['docs', 'summaries', 'comms', 'coord', 'prompteng'], {
        errorMap: () => ({
          message: 'each challenge must be one of: docs, summaries, comms, coord, prompteng',
        }),
      })
    )
    .min(1, 'at least one challenge must be selected'),
  goal: z.enum(['confident', 'time', 'prompts', 'verify', 'compliant', 'cme'], {
    errorMap: () => ({
      message: 'goal must be one of: confident, time, prompts, verify, compliant, cme',
    }),
  }),
  timeCadence: z.enum(['2', '5', '10'], {
    errorMap: () => ({
      message: 'timeCadence must be one of: 2, 5, 10',
    }),
  }),
});

export type OnboardingRequest = z.infer<typeof onboardingResponseSchema>;

export interface OnboardingResponseData {
  id: string;
  userId: string;
  confidence: string;
  challenges: string[];
  goal: string;
  timeCadence: string;
  completedAt: Date;
}
