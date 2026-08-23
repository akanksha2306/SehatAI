import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url('Invalid DATABASE_URL'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  PORT: z.coerce.number().positive().default(4000),
  APP_URL: z.string().url('Invalid APP_URL'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  ANTHROPIC_API_KEY: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

let config: Env;

try {
  config = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const missingVars = error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join('\n');
    console.error('Environment variable validation failed:\n', missingVars);
  }
  process.exit(1);
}

export default config;
