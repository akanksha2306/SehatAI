import { Response } from 'express';
import { ScribeService } from '../services/ScribeService.js';
import { UsageLogService } from '../services/UsageLogService.js';
import type { ScribeTranslateRequest } from '../schemas/scribe.js';
import type { AuthenticatedRequest } from './AuthController.js';

export class ScribeController {
  constructor(
    private scribeService: ScribeService,
    private usageLogService: UsageLogService
  ) {}

  async translate(
    req: AuthenticatedRequest,
    res: Response<unknown>
  ): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not found in request');
    }

    const data = req.body as ScribeTranslateRequest;

    const translated = await this.scribeService.translate(data.transcript, data.dialect);

    // Log usage asynchronously (don't await, so it doesn't block the response)
    this.usageLogService.logUsage(userId, 'scribe.translate').catch((err) => {
      console.error('Failed to log usage:', err);
    });

    res.status(200).json({
      translated,
    });
  }
}
