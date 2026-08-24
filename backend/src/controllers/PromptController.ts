import { Response } from 'express';
import { PromptService } from '../services/PromptService.js';
import { UsageLogService } from '../services/UsageLogService.js';
import type { PromptImproveRequest } from '../schemas/prompt.js';
import type { AuthenticatedRequest } from './AuthController.js';

export class PromptController {
  constructor(
    private promptService: PromptService,
    private usageLogService: UsageLogService
  ) {}

  async improvePrompt(
    req: AuthenticatedRequest,
    res: Response<unknown>
  ): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not found in request');
    }

    const data = req.body as PromptImproveRequest;

    const improved = await this.promptService.improvePrompt(data.prompt);

    // Log usage asynchronously (don't await, so it doesn't block the response)
    this.usageLogService.logUsage(userId, 'prompt.improve').catch((err) => {
      console.error('Failed to log usage:', err);
    });

    res.status(200).json({
      improved,
    });
  }
}
