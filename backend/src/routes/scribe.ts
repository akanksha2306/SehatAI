import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ScribeController } from '../controllers/ScribeController.js';
import { ScribeService } from '../services/ScribeService.js';
import { UsageLogService } from '../services/UsageLogService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createUserRateLimiter } from '../middleware/rateLimit.js';
import { scribeTranslateSchema } from '../schemas/scribe.js';

const router = Router();
const prisma = new PrismaClient();

const scribeService = new ScribeService();
const usageLogService = new UsageLogService(prisma);
const scribeController = new ScribeController(scribeService, usageLogService);

// Rate limiter for AI endpoints: 10 requests per minute per authenticated user
const aiRateLimiter = createUserRateLimiter(60 * 1000, 10);

// Translate a transcript
router.post(
  '/scribe/translate',
  authenticate,
  aiRateLimiter,
  validate(scribeTranslateSchema, 'body'),
  asyncHandler((req, res) => scribeController.translate(req, res))
);

export default router;
