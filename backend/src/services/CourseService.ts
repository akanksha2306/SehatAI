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
}

// TEMPORARY demo scope limit — see Deferred.md. All 17 chapters (7 prompt +
// 10 hall) still exist untouched in the database; this just caps what's
// exposed/allowed via the API to the first N per track for the demo.
// Remove this constant (and its two other usages below) to restore full access.
const DEMO_CHAPTER_LIMIT = 2;

export class CourseService {
  constructor(private prisma: PrismaClient) {}

  async getChaptersForTrack(
    userId: string,
    track: string
  ): Promise<ChapterListItem[]> {
    // Get all chapters for this track (capped to DEMO_CHAPTER_LIMIT — see note above)
    const chapters = await this.prisma.chapter.findMany({
      where: { track, index: { lt: DEMO_CHAPTER_LIMIT } },
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
    // Demo scope limit — see DEMO_CHAPTER_LIMIT note above.
    if (index >= DEMO_CHAPTER_LIMIT) {
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
    // Demo scope limit — see DEMO_CHAPTER_LIMIT note above.
    if (index >= DEMO_CHAPTER_LIMIT) {
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

      // Only add credits if this is the first completion
      let creditsTotal = 0;
      if (!wasAlreadyCompleted) {
        // Get or create UserStats
        const stats = await tx.userStats.upsert({
          where: { userId },
          update: {
            creditsTotal: {
              increment: chapter.reward,
            },
          },
          create: {
            userId,
            creditsTotal: chapter.reward,
          },
        });

        creditsTotal = stats.creditsTotal;
      } else {
        // Already completed, just get current total
        const stats = await tx.userStats.findUnique({
          where: { userId },
        });
        creditsTotal = stats?.creditsTotal ?? 0;
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
      },
    });

    // Default to 0 if not found
    return {
      creditsTotal: stats?.creditsTotal ?? 0,
      currentStreak: stats?.currentStreak ?? 0,
    };
  }
}
