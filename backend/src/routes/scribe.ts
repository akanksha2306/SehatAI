import { Router } from 'express';
import { ScribeController } from '../controllers/ScribeController.js';
import { ScribeService } from '../services/ScribeService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { scribeTranslateSchema } from '../schemas/scribe.js';

const router = Router();

const scribeService = new ScribeService();
const scribeController = new ScribeController(scribeService);

// Translate a transcript
router.post(
  '/scribe/translate',
  authenticate,
  validate(scribeTranslateSchema, 'body'),
  asyncHandler((req, res) => scribeController.translate(req, res))
);

export default router;
