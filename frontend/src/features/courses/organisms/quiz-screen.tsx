import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { QuizOption } from '../atoms/quiz-option';
import type { CourseTrack } from '../types';
import { ArrowRight } from 'lucide-react';

interface QuizScreenProps {
  track: CourseTrack;
  chapterIndex: number;
  onComplete: (quizScore: number) => void;
  onBack: () => void;
}

type OptionState = 'idle' | 'selected' | 'correct' | 'incorrect';

export function QuizScreen({
  track,
  chapterIndex,
  onComplete,
  onBack,
}: QuizScreenProps): React.ReactElement {
  const { data: chapter, isLoading, error } = useQuery({
    queryKey: ['courses', track, 'chapters', chapterIndex],
    queryFn: () => apiClient.getChapterDetail(track, chapterIndex),
  });

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const quiz = chapter?.quiz || [];
  const currentQuestion = quiz[currentQuestionIdx];
  const hasAnswered = answeredQuestions.has(currentQuestionIdx);

  const optionStates = useMemo(() => {
    const states: OptionState[] = currentQuestion.opts.map(() => 'idle');

    if (hasAnswered) {
      const selectedIdx = selectedAnswers[currentQuestionIdx];
      if (selectedIdx !== undefined) {
        states[selectedIdx] =
          selectedIdx === currentQuestion.correct ? 'correct' : 'incorrect';
        states[currentQuestion.correct] = 'correct';
      }
    } else if (selectedAnswers[currentQuestionIdx] !== undefined) {
      states[selectedAnswers[currentQuestionIdx]] = 'selected';
    }

    return states;
  }, [currentQuestion, currentQuestionIdx, selectedAnswers, hasAnswered]);

  const handleSelectOption = (idx: number): void => {
    if (!hasAnswered) {
      setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIdx]: idx }));
    }
  };

  const handleSubmitAnswer = (): void => {
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestionIdx]));
  };

  const handleNext = (): void => {
    if (currentQuestionIdx < quiz.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      const correctCount = Object.entries(selectedAnswers).filter(
        ([qIdx, ans]) => quiz[parseInt(qIdx, 10)].correct === ans
      ).length;
      onComplete(correctCount);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-bg">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-2">Error loading quiz</h1>
          <p className="text-neutral-500 mb-6">Please try again later.</p>
          <button
            onClick={onBack}
            className="inline-block px-6 py-3 rounded-lg font-medium text-sm bg-accent text-white hover:opacity-90 transition-opacity"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !currentQuestion) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-neutral-500">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentQuestionIdx === quiz.length - 1;

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <section className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-neutral-500 font-semibold">
          Question {currentQuestionIdx + 1} of {quiz.length}
        </p>
        <h2
          className="text-3xl font-bold text-text"
          style={{ fontFamily: 'var(--heading)' }}
        >
          {currentQuestion.q}
        </h2>
      </section>

      {/* Progress */}
      <div className="w-full h-2 rounded-full bg-neutral-300 overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${((currentQuestionIdx + 1) / quiz.length) * 100}%` }}
        />
      </div>

      {/* Options */}
      <section className="space-y-3">
        {currentQuestion.opts.map((opt, _idx) => (
          <QuizOption
            key={_idx}
            text={opt}
            state={optionStates[_idx]}
            onClick={() => handleSelectOption(_idx)}
            disabled={hasAnswered}
          />
        ))}
      </section>

      {/* Feedback */}
      {hasAnswered && (
        <section className="bg-accent-2-light border border-accent-2 p-6 rounded-lg">
          <p className="text-sm uppercase tracking-wide text-accent-2 font-semibold mb-2">
            Explanation
          </p>
          <p className="text-base text-text">{currentQuestion.explain}</p>
        </section>
      )}

      {/* CTA */}
      <section>
        {!hasAnswered && selectedAnswers[currentQuestionIdx] !== undefined ? (
          <button
            onClick={handleSubmitAnswer}
            className="flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-lg bg-accent text-white hover:opacity-90 transition-opacity"
          >
            Submit answer
            <ArrowRight size={20} strokeWidth={2} />
          </button>
        ) : hasAnswered ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-lg bg-accent text-white hover:opacity-90 transition-opacity"
          >
            {isLastQuestion ? 'Finish' : 'Next question'}
            <ArrowRight size={20} strokeWidth={2} />
          </button>
        ) : (
          <button
            disabled
            className="flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-lg bg-neutral-300 text-neutral-500 cursor-not-allowed"
          >
            Select an answer
          </button>
        )}
      </section>
    </div>
  );
}
