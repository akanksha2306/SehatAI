import { PrismaClient } from '@prisma/client';
import type { OnboardingResponseData } from '../schemas/onboarding.js';
import type { OnboardingRequest } from '../schemas/onboarding.js';

export class OnboardingService {
  constructor(private prisma: PrismaClient) {}

  async upsertOnboarding(
    userId: string,
    data: OnboardingRequest
  ): Promise<OnboardingResponseData> {
    const response = await this.prisma.onboardingResponse.upsert({
      where: { userId },
      update: {
        confidence: data.confidence,
        challenges: data.challenges,
        goal: data.goal,
        timeCadence: data.timeCadence,
        completedAt: new Date(),
      },
      create: {
        userId,
        confidence: data.confidence,
        challenges: data.challenges,
        goal: data.goal,
        timeCadence: data.timeCadence,
      },
    });

    return response as OnboardingResponseData;
  }

  async getOnboardingByUserId(userId: string): Promise<OnboardingResponseData | null> {
    const response = await this.prisma.onboardingResponse.findUnique({
      where: { userId },
    });

    return response as OnboardingResponseData | null;
  }

  async checkOnboardingExists(userId: string): Promise<boolean> {
    const response = await this.prisma.onboardingResponse.findUnique({
      where: { userId },
      select: { id: true },
    });

    return response !== null;
  }
}
