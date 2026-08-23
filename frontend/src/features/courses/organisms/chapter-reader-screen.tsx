import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import type { CourseTrack } from '../types';
import { ArrowRight } from 'lucide-react';

interface ChapterReaderScreenProps {
  track: CourseTrack;
  chapterIndex: number;
  onStartQuiz: () => void;
  onBack: () => void;
}

export function ChapterReaderScreen({
  track,
  chapterIndex,
  onStartQuiz,
  onBack,
}: ChapterReaderScreenProps): React.ReactElement {
  const { data: chapter, isLoading, error } = useQuery({
    queryKey: ['courses', track, 'chapters', chapterIndex],
    queryFn: () => apiClient.getChapterDetail(track, chapterIndex),
  });

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-bg">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-2">Error loading chapter</h1>
          <p className="text-neutral-500 mb-6">Please try again later.</p>
          <button
            onClick={onBack}
            className="inline-block px-6 py-3 rounded-lg font-medium text-sm bg-accent text-white hover:opacity-90 transition-opacity"
          >
            Back to chapters
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !chapter) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-neutral-500">Loading chapter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <section className="space-y-2">
        <button
          onClick={onBack}
          className="text-sm font-medium text-accent hover:text-accent-light transition-colors mb-4 inline-block"
        >
          ← Back to chapters
        </button>
        <h1
          className="text-4xl lg:text-5xl font-bold text-text"
          style={{ fontFamily: 'var(--heading)' }}
        >
          {chapter.title}
        </h1>
      </section>

      {/* Content */}
      <section className="space-y-6 max-w-3xl">
        {chapter.paras.map((para, idx) => (
          <p key={idx} className="text-base leading-relaxed text-text">
            {para}
          </p>
        ))}
      </section>

      {/* Key Takeaway */}
      {chapter.key && (
        <section className="bg-accent-2-light border-l-4 border-accent-2 p-6 rounded-lg">
          <p className="text-xs uppercase tracking-wide text-accent-2 font-semibold mb-2">
            Key takeaway
          </p>
          <p className="text-lg font-semibold text-text">{chapter.key}</p>
        </section>
      )}

      {/* CTA */}
      <section>
        <button
          onClick={onStartQuiz}
          className="flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-lg bg-accent text-white hover:opacity-90 transition-opacity"
        >
          Take quiz
          <ArrowRight size={20} strokeWidth={2} />
        </button>
      </section>
    </div>
  );
}
