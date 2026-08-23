import { Response } from 'express';
import { PromptService } from '../services/PromptService.js';
import type { PromptImproveRequest } from '../schemas/prompt.js';
import type { AuthenticatedRequest } from './AuthController.js';

export class PromptController {
  constructor(private promptService: PromptService) {}

  async improvePrompt(
    req: AuthenticatedRequest,
    res: Response<unknown>
  ): Promise<void> {
    const data = req.body as PromptImproveRequest;

    const improved = await this.promptService.improvePrompt(data.prompt);

    res.status(200).json({
      improved,
    });
  }
}
