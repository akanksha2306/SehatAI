import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthController } from '../controllers/AuthController.js';
import { UserService } from '../services/UserService.js';
import { MagicLinkService } from '../services/MagicLinkService.js';
import { EmailService } from '../services/EmailService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { magicLinkRequestSchema, magicLinkVerifySchema, verifyCodeSchema } from '../schemas/auth.js';

const router = Router();
const prisma = new PrismaClient();

const userService = new UserService(prisma);
const magicLinkService = new MagicLinkService(prisma);
const emailService = new EmailService();
const authController = new AuthController(userService, magicLinkService, emailService);

// Request magic link
router.post(
  '/auth/magic-link',
  validate(magicLinkRequestSchema, 'body'),
  asyncHandler((req, res) => authController.requestMagicLink(req, res))
);

// Verify magic link and get JWT (legacy token-based, kept for backward compatibility)
router.get(
  '/auth/verify',
  validate(magicLinkVerifySchema, 'query'),
  asyncHandler((req, res) => {
    const { token } = req.query as { token: string };
    return authController.verifyMagicLink(token, res);
  })
);

// Verify 6-digit code and get JWT
router.post(
  '/auth/verify-code',
  validate(verifyCodeSchema, 'body'),
  asyncHandler((req, res) => authController.verifyCode(req, res))
);

// Get current user (protected)
router.get(
  '/me',
  authenticate,
  asyncHandler((req, res) => authController.getCurrentUser(req, res))
);

export default router;
