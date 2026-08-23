import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { WorkflowController } from '../controllers/WorkflowController.js';
import { WorkflowService } from '../services/WorkflowService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { generateWorkflowSchema, saveWorkflowSchema } from '../schemas/workflow.js';

const router = Router();
const prisma = new PrismaClient();

const workflowService = new WorkflowService(prisma);
const workflowController = new WorkflowController(workflowService);

// Generate a workflow (mocked or real based on API key)
router.post(
  '/workflow/generate',
  authenticate,
  validate(generateWorkflowSchema, 'body'),
  asyncHandler((req, res) => workflowController.generateWorkflow(req, res))
);

// Save a workflow
router.post(
  '/workflows',
  authenticate,
  validate(saveWorkflowSchema, 'body'),
  asyncHandler((req, res) => workflowController.saveWorkflow(req, res))
);

// Get user's saved workflows
router.get(
  '/workflows',
  authenticate,
  asyncHandler((req, res) => workflowController.getWorkflows(req, res))
);

export default router;
