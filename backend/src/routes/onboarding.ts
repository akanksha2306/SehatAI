import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { OnboardingController } from '../controllers/OnboardingController.js';
import { OnboardingService } from '../services/OnboardingService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { onboardingResponseSchema } from '../schemas/onboarding.js';

const router = Router();
const prisma = new PrismaClient();

const onboardingService = new OnboardingService(prisma);
const onboardingController = new OnboardingController(onboardingService);

// Save onboarding responses (create or update)
router.post(
  '/onboarding',
  authenticate,
  validate(onboardingResponseSchema, 'body'),
  asyncHandler((req, res) => onboardingController.saveOnboarding(req, res))
);

// Get current user's onboarding responses
router.get(
  '/onboarding',
  authenticate,
  asyncHandler((req, res) => onboardingController.getOnboarding(req, res))
);

export default router;
