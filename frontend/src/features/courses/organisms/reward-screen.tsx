import React, { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { track } from '../../../lib/analytics';
import type { CourseTrack } from '../types';
import { Star, ArrowRight, Home } from 'lucide-react';

interface RewardScreenProps {
  track: CourseTrack;
  chapterIndex: number;
  quizScore: number;
  totalQuestions: number;
  reward: number;
  onContinue: () => void;
  onBackToDashboard: () => void;
}

export function RewardScreen({
  track: courseTrack,
  chapterIndex,
  quizScore,
  totalQuestions,
  reward,
  onContinue,
  onBackToDashboard,
}: RewardScreenProps): React.ReactElement {
  const queryClient = useQueryClient();

  const { data: chapters = [] } = useQuery({
    queryKey: ['courses', courseTrack, 'chapters'],
    queryFn: () => apiClient.getCourseChapters(courseTrack),
  });

  const { mutate: completeChapter, isPending } = useMutation({
    mutationFn: () => apiClient.completeChapter(courseTrack, chapterIndex, quizScore),
    onSuccess: () => {
      track('chapter_completed', {
        track: courseTrack,
        chapter_index: chapterIndex,
        credits_earned: reward,
      });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  React.useEffect(() => {
    completeChapter();
  }, [completeChapter]);

  const nextChapter = chapters.find(
    (ch) => ch.index === chapterIndex + 1 && !ch.locked
  );
  const hasNextChapter = nextChapter !== undefined;

  const percentage = totalQuestions > 0 ? (quizScore / totalQuestions) * 100 : 0;
  const isPerfect = quizScore === totalQuestions;

  const remainingStats = useMemo(() => {
    const remaining = chapters.filter((c) => !c.completed).length;
    return { remaining };
  }, [chapters]);

  return (
    <div className="w-full space-y-8">
      {/* Celebration Header */}
      <section className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-accent-2-light rounded-full animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Star size={48} className="text-accent-2" fill="currentColor" />
            </div>
          </div>
        </div>
        <h1
          className="text-4xl lg:text-5xl font-bold text-text"
          style={{ fontFamily: 'var(--heading)' }}
        >
          {isPerfect ? 'Perfect score!' : 'Quiz completed!'}
        </h1>
      </section>

      {/* Score */}
      <section className="bg-accent-light border border-accent rounded-lg p-8 text-center space-y-3">
        <p className="text-sm uppercase tracking-wide text-accent font-semibold">Your score</p>
        <p className="text-6xl font-bold text-accent">
          {quizScore}/{totalQuestions}
        </p>
        <div className="w-full h-3 rounded-full bg-accent-light overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </section>

      {/* Reward */}
      <section className="bg-accent-2-light border border-accent-2 rounded-lg p-8 text-center space-y-3">
        <p className="text-sm uppercase tracking-wide text-accent-2 font-semibold">
          Credits earned
        </p>
        <p className="text-4xl font-bold text-accent-2">+{reward}</p>
      </section>

      {/* Chapters Remaining */}
      <section className="text-center">
        {remainingStats.remaining === 0 ? (
          <p className="text-lg font-semibold text-accent-2">
            You've completed this track!
          </p>
        ) : (
          <p className="text-lg font-medium text-neutral-500">
            {remainingStats.remaining} chapter{remainingStats.remaining !== 1 ? 's' : ''} remaining in this track
          </p>
        )}
      </section>

      {/* Next Steps */}
      <section className="space-y-4">
        {hasNextChapter && (
          <button
            onClick={onContinue}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold text-lg bg-accent text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving...' : 'Next chapter'}
            <ArrowRight size={20} strokeWidth={2} />
          </button>
        )}

        <button
          onClick={onBackToDashboard}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold text-lg bg-surface text-text border border-neutral-300 hover:bg-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Home size={20} strokeWidth={2} />
          Back to dashboard
        </button>
      </section>
    </div>
  );
}
