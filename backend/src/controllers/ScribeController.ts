import { Response } from 'express';
import { ScribeService } from '../services/ScribeService.js';
import type { ScribeTranslateRequest } from '../schemas/scribe.js';
import type { AuthenticatedRequest } from './AuthController.js';

export class ScribeController {
  constructor(private scribeService: ScribeService) {}

  async translate(
    req: AuthenticatedRequest,
    res: Response<unknown>
  ): Promise<void> {
    const data = req.body as ScribeTranslateRequest;

    const translated = await this.scribeService.translate(data.transcript, data.dialect);

    res.status(200).json({
      translated,
    });
  }
}
