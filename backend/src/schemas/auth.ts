import { z } from 'zod';

export const magicLinkRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type MagicLinkRequest = z.infer<typeof magicLinkRequestSchema>;

export const magicLinkVerifySchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export type MagicLinkVerify = z.infer<typeof magicLinkVerifySchema>;

export const verifyCodeSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().regex(/^\d{6}$/, 'Code must be exactly 6 digits'),
});

export type VerifyCodeRequest = z.infer<typeof verifyCodeSchema>;
