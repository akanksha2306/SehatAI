import { PrismaClient } from '@prisma/client';
import { NotFoundError, ForbiddenError } from '../lib/errors.js';

export interface ChapterListItem {
  index: number;
  title: string;
  reward: number;
  locked: boolean;
  completed: boolean;
}

export interface ChapterDetail {
  title: string;
  paras: string[];
  key: string;
  quiz: unknown;
  reward: number;
}

export interface ChapterProgressData {
  id: string;
  userId: string;
  track: string;
  chapterIndex: number;
  completedAt: Date;
  quizScore: number;
  creditsEarned: number;
}

export interface UserStatsData {
  creditsTotal: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date | null;
}

// TEMPORARY demo scope limit — see Deferred.md. All 17 chapters (7 prompt +
// 10 hall) still exist untouched in the database; this just caps what's
// exposed/allowed via the API to the first N per track for the demo.
// Hall of Hallucinations is fully unlocked (all 10); Prompt Lab stays capped
// at 2 until asked to unlock it too. Remove this function (and its 3 call
// sites below) to restore full, uncapped access for every track.
function getChapterLimit(track: string): number {
  return track === 'hall' ? 10 : 2;
}

interface StreakUpdate {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
}

export class CourseService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Calculate streak updates based on the user's current streak state and today's date.
   * Uses UTC calendar dates (no time-of-day component).
   *
   * Logic:
   * - No UserStats or lastActiveDate is null: first-ever activity
   *   → currentStreak = 1, longestStreak = 1, lastActiveDate = today
   * - lastActiveDate === today: already active today
   *   → keep currentStreak unchanged, ensure longestStreak = max(longestStreak, currentStreak)
   * - lastActiveDate === yesterday: consecutive day
   *   → currentStreak += 1, longestStreak = max(longestStreak, currentStreak)
   * - lastActiveDate earlier than yesterday: streak broken
   *   → currentStreak = 1, longestStreak unchanged
   */
  private calculateStreakUpdate(
    currentStreak: number,
    longestStreak: number,
    lastActiveDate: Date | null
  ): StreakUpdate {
    // Get today's UTC date (strip time-of-day)
    const today = new Date();
    const todayUTC = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    );

    // No prior activity
    if (!lastActiveDate) {
      return {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: todayUTC,
      };
    }

    // Normalize lastActiveDate to UTC date (strip time-of-day)
    const lastActiveDateUTC = new Date(
      Date.UTC(
        lastActiveDate.getUTCFullYear(),
        lastActiveDate.getUTCMonth(),
        lastActiveDate.getUTCDate()
      )
    );

    // Calculate days difference
    const diffMs = todayUTC.getTime() - lastActiveDateUTC.getTime();
    const daysDiff = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Already active today — don't double-increment currentStreak,
      // but ensure longestStreak is up-to-date
      return {
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
        lastActiveDate: todayUTC,
      };
    } else if (daysDiff === 1) {
      // Consecutive day — increment currentStreak
      const newStreak = currentStreak + 1;
      return {
        currentStreak: newStreak,
        longestStreak: Math.max(longestStreak, newStreak),
        lastActiveDate: todayUTC,
      };
    } else {
      // Gap of 2+ days — streak broken, reset to 1
      return {
        currentStreak: 1,
        longestStreak,
        lastActiveDate: todayUTC,
      };
    }
  }

  async getChaptersForTrack(
    userId: string,
    track: string
  ): Promise<ChapterListItem[]> {
    // Get all chapters for this track (capped per-track — see getChapterLimit above)
    const chapters = await this.prisma.chapter.findMany({
      where: { track, index: { lt: getChapterLimit(track) } },
      orderBy: { index: 'asc' },
      select: {
        index: true,
        title: true,
        reward: true,
      },
    });

    // Get completed chapters for this user and track
    const completed = await this.prisma.chapterProgress.findMany({
      where: { userId, track },
      select: { chapterIndex: true },
    });

    const completedSet = new Set(completed.map((c) => c.chapterIndex));

    // Build list with locked/completed status
    return chapters.map((ch) => {
      const isCompleted = completedSet.has(ch.index);
      const isLocked = ch.index > 0 && !completedSet.has(ch.index - 1);

      return {
        index: ch.index,
        title: ch.title,
        reward: ch.reward,
        locked: isLocked,
        completed: isCompleted,
      };
    });
  }

  async getChapterDetail(
    userId: string,
    track: string,
    index: number
  ): Promise<ChapterDetail> {
    // Demo scope limit — see getChapterLimit note above.
    if (index >= getChapterLimit(track)) {
      throw new NotFoundError('Chapter');
    }

    // Get the chapter
    const chapter = await this.prisma.chapter.findUnique({
      where: {
        track_index: { track, index },
      },
    });

    if (!chapter) {
      throw new NotFoundError('Chapter');
    }

    // Check if locked for this user
    if (index > 0) {
      const prevCompleted = await this.prisma.chapterProgress.findUnique({
        where: {
          userId_track_chapterIndex: {
            userId,
            track,
            chapterIndex: index - 1,
          },
        },
      });

      if (!prevCompleted) {
        throw new ForbiddenError(
          'This chapter is locked. Complete the previous chapter first.'
        );
      }
    }

    return {
      title: chapter.title,
      paras: chapter.paras,
      key: chapter.key,
      quiz: chapter.quiz,
      reward: chapter.reward,
    };
  }

  async completeChapter(
    userId: string,
    track: string,
    index: number,
    quizScore: number
  ): Promise<{ progress: ChapterProgressData; creditsTotal: number }> {
    // Demo scope limit — see getChapterLimit note above.
    if (index >= getChapterLimit(track)) {
      throw new NotFoundError('Chapter');
    }

    // Check if locked
    if (index > 0) {
      const prevCompleted = await this.prisma.chapterProgress.findUnique({
        where: {
          userId_track_chapterIndex: {
            userId,
            track,
            chapterIndex: index - 1,
          },
        },
      });

      if (!prevCompleted) {
        throw new ForbiddenError(
          'This chapter is locked. Complete the previous chapter first.'
        );
      }
    }

    // Get the chapter to know the reward
    const chapter = await this.prisma.chapter.findUnique({
      where: {
        track_index: { track, index },
      },
      select: { reward: true },
    });

    if (!chapter) {
      throw new NotFoundError('Chapter');
    }

    // Upsert chapter progress and update stats in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Check if this chapter was already completed
      const existing = await tx.chapterProgress.findUnique({
        where: {
          userId_track_chapterIndex: {
            userId,
            track,
            chapterIndex: index,
          },
        },
      });

      const wasAlreadyCompleted = existing !== null;

      // Upsert the progress
      const progress = await tx.chapterProgress.upsert({
        where: {
          userId_track_chapterIndex: {
            userId,
            track,
            chapterIndex: index,
          },
        },
        update: {
          quizScore,
          completedAt: new Date(),
        },
        create: {
          userId,
          track,
          chapterIndex: index,
          quizScore,
          creditsEarned: chapter.reward,
        },
      });

      // Get current UserStats to calculate streak and credits
      const currentStats = await tx.userStats.findUnique({
        where: { userId },
      });

      // Calculate streak updates (applies on EVERY chapter completion,
      // including repeats, since revisiting counts as activity today)
      const streakUpdate = this.calculateStreakUpdate(
        currentStats?.currentStreak ?? 0,
        currentStats?.longestStreak ?? 0,
        currentStats?.lastActiveDate ?? null
      );

      // Only add credits if this is the first completion
      let creditsTotal = 0;
      if (!wasAlreadyCompleted) {
        // Upsert UserStats with both credit increment and streak update
        const stats = await tx.userStats.upsert({
          where: { userId },
          update: {
            creditsTotal: {
              increment: chapter.reward,
            },
            currentStreak: streakUpdate.currentStreak,
            longestStreak: streakUpdate.longestStreak,
            lastActiveDate: streakUpdate.lastActiveDate,
          },
          create: {
            userId,
            creditsTotal: chapter.reward,
            currentStreak: streakUpdate.currentStreak,
            longestStreak: streakUpdate.longestStreak,
            lastActiveDate: streakUpdate.lastActiveDate,
          },
        });

        creditsTotal = stats.creditsTotal;
      } else {
        // Already completed, update streak (even on retake) but don't add credits
        const stats = await tx.userStats.upsert({
          where: { userId },
          update: {
            currentStreak: streakUpdate.currentStreak,
            longestStreak: streakUpdate.longestStreak,
            lastActiveDate: streakUpdate.lastActiveDate,
          },
          create: {
            userId,
            creditsTotal: 0,
            currentStreak: streakUpdate.currentStreak,
            longestStreak: streakUpdate.longestStreak,
            lastActiveDate: streakUpdate.lastActiveDate,
          },
        });

        creditsTotal = stats.creditsTotal;
      }

      return {
        progress,
        creditsTotal,
      };
    });

    return result;
  }

  async getUserStats(userId: string): Promise<UserStatsData> {
    const stats = await this.prisma.userStats.findUnique({
      where: { userId },
      select: {
        creditsTotal: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveDate: true,
      },
    });

    // Default to 0 if not found
    return {
      creditsTotal: stats?.creditsTotal ?? 0,
      currentStreak: stats?.currentStreak ?? 0,
      longestStreak: stats?.longestStreak ?? 0,
      lastActiveDate: stats?.lastActiveDate ?? null,
    };
  }
}
