import { PrismaClient } from '@prisma/client';

export class UsageLogService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Log an API endpoint call by a user.
   * Used to track usage of AI integration endpoints for cost and analytics.
   */
  async logUsage(userId: string, endpoint: string): Promise<void> {
    try {
      await this.prisma.usageLog.create({
        data: {
          userId,
          endpoint,
        },
      });
    } catch (error) {
      // Log errors but don't throw — we don't want usage logging failures
      // to disrupt the user's actual request
      console.error(`Failed to log usage for endpoint ${endpoint}, user ${userId}:`, error);
    }
  }
}
