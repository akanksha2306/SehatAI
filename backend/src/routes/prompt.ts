import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PromptController } from '../controllers/PromptController.js';
import { PromptService } from '../services/PromptService.js';
import { UsageLogService } from '../services/UsageLogService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createUserRateLimiter } from '../middleware/rateLimit.js';
import { promptImproveSchema } from '../schemas/prompt.js';

const router = Router();
const prisma = new PrismaClient();

const promptService = new PromptService();
const usageLogService = new UsageLogService(prisma);
const promptController = new PromptController(promptService, usageLogService);

// Rate limiter for AI endpoints: 10 requests per minute per authenticated user
const aiRateLimiter = createUserRateLimiter(60 * 1000, 10);

// Improve a prompt
router.post(
  '/prompt/improve',
  authenticate,
  aiRateLimiter,
  validate(promptImproveSchema, 'body'),
  asyncHandler((req, res) => promptController.improvePrompt(req, res))
);

export default router;
