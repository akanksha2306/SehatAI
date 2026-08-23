import { PrismaClient } from '@prisma/client';

export interface UserData {
  id: string;
  email: string;
  onboarded?: boolean;
}

export interface UserStatsData {
  creditsTotal: number;
  currentStreak: number;
}

export class UserService {
  constructor(private prisma: PrismaClient) {}

  async findOrCreateByEmail(email: string): Promise<UserData> {
    const user = await this.prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
      select: {
        id: true,
        email: true,
      },
    });

    return user;
  }

  async findById(id: string): Promise<UserData | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    });

    return user;
  }

  async findByIdWithOnboarding(id: string): Promise<UserData | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        onboardingResponse: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      onboarded: user.onboardingResponse !== null,
    };
  }

  async getUserStats(id: string): Promise<UserStatsData> {
    const stats = await this.prisma.userStats.findUnique({
      where: { userId: id },
      select: {
        creditsTotal: true,
        currentStreak: true,
      },
    });

    return {
      creditsTotal: stats?.creditsTotal ?? 0,
      currentStreak: stats?.currentStreak ?? 0,
    };
  }
}
