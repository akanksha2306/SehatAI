import { Router } from 'express';
import { PromptController } from '../controllers/PromptController.js';
import { PromptService } from '../services/PromptService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { promptImproveSchema } from '../schemas/prompt.js';

const router = Router();

const promptService = new PromptService();
const promptController = new PromptController(promptService);

// Improve a prompt
router.post(
  '/prompt/improve',
  authenticate,
  validate(promptImproveSchema, 'body'),
  asyncHandler((req, res) => promptController.improvePrompt(req, res))
);

export default router;
