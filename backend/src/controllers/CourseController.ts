import { Response } from 'express';
import { CourseService } from '../services/CourseService.js';
import type { AuthenticatedRequest } from './AuthController.js';
import type { CompleteChapterRequest } from '../schemas/course.js';

export class CourseController {
  constructor(private courseService: CourseService) {}

  async getChapters(
    req: AuthenticatedRequest,
    res: Response<unknown>
  ): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not found in request');
    }

    const { track } = req.params;

    const chapters = await this.courseService.getChaptersForTrack(userId, track);

    res.status(200).json({
      track,
      chapters,
    });
  }

  async getChapterDetail(
    req: AuthenticatedRequest,
    res: Response<unknown>
  ): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not found in request');
    }

    const { track, index } = req.params;
    const chapterIndex = parseInt(index, 10);

    if (isNaN(chapterIndex)) {
      throw new Error('Invalid chapter index');
    }

    const detail = await this.courseService.getChapterDetail(
      userId,
      track,
      chapterIndex
    );
    res.status(200).json(detail);
  }

  async completeChapter(
    req: AuthenticatedRequest,
    res: Response<unknown>
  ): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not found in request');
    }

    const { track, index } = req.params;
    const { quizScore } = req.body as CompleteChapterRequest;
    const chapterIndex = parseInt(index, 10);

    if (isNaN(chapterIndex)) {
      throw new Error('Invalid chapter index');
    }

    const result = await this.courseService.completeChapter(
      userId,
      track,
      chapterIndex,
      quizScore
    );

    res.status(200).json({
      progress: result.progress,
      creditsTotal: result.creditsTotal,
    });
  }
}
