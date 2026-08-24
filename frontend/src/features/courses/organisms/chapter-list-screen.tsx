import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { ChapterCard } from '../atoms/chapter-card';
import { ProgressBar } from '../molecules/progress-bar';
import { PromptBankCard } from '../molecules/prompt-bank-card';
import { DoctorHeroAnimation } from '../molecules/doctor-hero-animation';
import { PromptImprover } from './prompt-improver';
import type { CourseTrack } from '../types';

interface ChapterListScreenProps {
  track: CourseTrack;
  onChapterSelect: (index: number) => void;
}

export function ChapterListScreen({
  track,
  onChapterSelect,
}: ChapterListScreenProps): React.ReactElement {
  const { data: chapters = [], isLoading, error } = useQuery({
    queryKey: ['courses', track, 'chapters'],
    queryFn: () => apiClient.getCourseChapters(track),
  });

  const stats = useMemo(() => {
    const completed = chapters.filter((c) => c.completed).length;
    return { completed, total: chapters.length };
  }, [chapters]);

  const trackTitle = track === 'prompt' ? 'Prompt Lab' : 'Hall of Hallucinations';
  const trackDescription =
    track === 'prompt'
      ? 'Seven chapters that teach prompt engineering — role, task, format, techniques — each with a quiz drawn from the lesson.'
      : 'Ten gamified chapters on how AI works and why it hallucinates. Earn credits and keep a streak.';

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-bg">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-2">Error loading course</h1>
          <p className="text-neutral-500">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <section className="space-y-2">
        <h1
          className="text-4xl lg:text-5xl font-bold text-text"
          style={{ fontFamily: 'var(--heading)' }}
        >
          {trackTitle}
        </h1>
        <p className="text-lg text-neutral-500 max-w-2xl">{trackDescription}</p>
      </section>

      {/* Hall of Hallucinations Hero Animation */}
      {track === 'hall' && (
        <section>
          <DoctorHeroAnimation />
        </section>
      )}

      {/* Progress */}
      <section>
        <ProgressBar
          completed={stats.completed}
          total={stats.total}
          showLabel={true}
        />
      </section>

      {/* Chapters */}
      <section>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-neutral-500">Loading chapters...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {chapters.map((chapter) => (
              <ChapterCard
                key={chapter.index}
                index={chapter.index}
                title={chapter.title}
                reward={chapter.reward}
                locked={chapter.locked}
                completed={chapter.completed}
                onClick={() => !chapter.locked && onChapterSelect(chapter.index)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Prompt Lab Extras - Only for Prompt Lab track */}
      {track === 'prompt' && (
        <section className="space-y-12">
          {/* Prompt Improver */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2
                className="text-2xl font-semibold text-text"
                style={{ fontFamily: 'var(--heading)' }}
              >
                Prompt Lab Extras
              </h2>
              <p className="text-neutral-500">
                Tools to refine your prompts and get the most out of AI.
              </p>
            </div>
            <PromptImprover />
          </div>

          {/* Quick Templates */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3
                className="text-2xl font-semibold text-text"
                style={{ fontFamily: 'var(--heading)' }}
              >
                Quick Templates
              </h3>
              <p className="text-neutral-500">
                Ready-made prompt templates you can copy and customize.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PromptBankCard
                name="Patient explanation (plain language)"
                prompt="You are explaining to a patient with no medical background. Explain [condition or result] in plain, reassuring language at a 6th-grade reading level. Use short sentences, avoid jargon, and end with the 3 things they should do next. Do not give a diagnosis I have not stated."
              />

              <PromptBankCard
                name="Shift handoff (SBAR)"
                prompt="Draft an SBAR handoff for [patient] from these notes: [paste notes]. Situation, Background, Assessment, Recommendation — each 1-2 lines. Include active meds with doses and the single most important thing for the next shift to watch. Flag any gaps in the notes rather than guessing."
              />

              <PromptBankCard
                name="De-jargon a report"
                prompt="Rewrite this [report/result] for the referring GP in 4 bullets: key finding, clinical significance, recommended follow-up, and urgency. Keep all measurements exact. Mark anything ambiguous with [verify]."
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
