import { Response } from 'express';
import { OnboardingService } from '../services/OnboardingService.js';
import { NotFoundError } from '../lib/errors.js';
import type { OnboardingRequest } from '../schemas/onboarding.js';
import type { AuthenticatedRequest } from './AuthController.js';

export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}

  async saveOnboarding(
    req: AuthenticatedRequest,
    res: Response<unknown>
  ): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not found in request');
    }

    const data = req.body as OnboardingRequest;

    const response = await this.onboardingService.upsertOnboarding(userId, data);

    res.status(200).json({
      id: response.id,
      userId: response.userId,
      confidence: response.confidence,
      challenges: response.challenges,
      goal: response.goal,
      timeCadence: response.timeCadence,
      completedAt: response.completedAt,
    });
  }

  async getOnboarding(
    req: AuthenticatedRequest,
    res: Response<unknown>
  ): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not found in request');
    }

    const response = await this.onboardingService.getOnboardingByUserId(userId);

    if (!response) {
      throw new NotFoundError('Onboarding response');
    }

    res.status(200).json({
      id: response.id,
      userId: response.userId,
      confidence: response.confidence,
      challenges: response.challenges,
      goal: response.goal,
      timeCadence: response.timeCadence,
      completedAt: response.completedAt,
    });
  }
}
