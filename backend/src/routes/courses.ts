import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { CourseController } from '../controllers/CourseController.js';
import { CourseService } from '../services/CourseService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { trackSchema, completeChapterSchema } from '../schemas/course.js';

const router = Router();
const prisma = new PrismaClient();

const courseService = new CourseService(prisma);
const courseController = new CourseController(courseService);

// Validate track parameter
const validateTrack = (req: any, res: any, next: any) => {
  const { track } = req.params;
  if (track !== 'prompt' && track !== 'hall') {
    return res.status(404).json({
      error: {
        message: 'Track not found',
        code: 'NOT_FOUND',
      },
    });
  }
  next();
};

// Get chapters for a track
router.get(
  '/courses/:track/chapters',
  authenticate,
  validateTrack,
  asyncHandler((req, res) => courseController.getChapters(req, res))
);

// Get chapter detail
router.get(
  '/courses/:track/chapters/:index',
  authenticate,
  validateTrack,
  asyncHandler((req, res) => courseController.getChapterDetail(req, res))
);

// Complete chapter
router.post(
  '/courses/:track/chapters/:index/complete',
  authenticate,
  validateTrack,
  validate(completeChapterSchema, 'body'),
  asyncHandler((req, res) => courseController.completeChapter(req, res))
);

export default router;
