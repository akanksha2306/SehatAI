import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Logo } from '../components/logo';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { ChapterListScreen } from '../features/courses/organisms/chapter-list-screen';
import { ChapterReaderScreen } from '../features/courses/organisms/chapter-reader-screen';
import { QuizScreen } from '../features/courses/organisms/quiz-screen';
import { RewardScreen } from '../features/courses/organisms/reward-screen';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { CourseTrack } from '../features/courses/types';

type Screen = 'list' | 'reader' | 'quiz' | 'reward';

export function Course(): React.ReactElement {
  const { track: trackParam } = useParams<{ track: string }>();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const track = (trackParam === 'prompt' || trackParam === 'hall' ? trackParam : 'prompt') as CourseTrack;

  const [screen, setScreen] = useState<Screen>('list');
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [chapterReward, setChapterReward] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);

  const { data: chapterDetail } = useQuery({
    queryKey: ['courses', track, 'chapters', currentChapterIndex],
    queryFn: () =>
      currentChapterIndex !== null
        ? apiClient.getChapterDetail(track, currentChapterIndex)
        : Promise.resolve(null),
    enabled: currentChapterIndex !== null,
  });

  const handleChapterSelect = (index: number): void => {
    setCurrentChapterIndex(index);
    setScreen('reader');
  };

  const handleStartQuiz = (): void => {
    if (chapterDetail) {
      setTotalQuestions(chapterDetail.quiz.length);
      setChapterReward(chapterDetail.reward);
    }
    setScreen('quiz');
  };

  const handleQuizComplete = (score: number): void => {
    setQuizScore(score);
    setScreen('reward');
  };

  const handleContinueToNext = (): void => {
    if (currentChapterIndex !== null) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setQuizScore(null);
      setScreen('reader');
    }
  };

  const handleBackToDashboard = (): void => {
    navigate('/dashboard');
  };

  const handleSignOut = (): void => {
    signOut();
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Header */}
      <header className="border-b border-neutral-300 bg-bg sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
          <Logo />

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                Signed in as
              </p>
              <p className="text-sm text-text font-medium">{user?.email}</p>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-text hover:bg-surface transition-colors border border-neutral-300"
              title="Sign out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {screen === 'list' && (
            <ChapterListScreen track={track} onChapterSelect={handleChapterSelect} />
          )}

          {screen === 'reader' && currentChapterIndex !== null && (
            <ChapterReaderScreen
              track={track}
              chapterIndex={currentChapterIndex}
              onStartQuiz={handleStartQuiz}
              onBack={() => setScreen('list')}
            />
          )}

          {screen === 'quiz' && currentChapterIndex !== null && (
            <QuizScreen
              track={track}
              chapterIndex={currentChapterIndex}
              onComplete={handleQuizComplete}
              onBack={() => setScreen('reader')}
            />
          )}

          {screen === 'reward' &&
            currentChapterIndex !== null &&
            quizScore !== null && (
              <RewardScreen
                track={track}
                chapterIndex={currentChapterIndex}
                quizScore={quizScore}
                totalQuestions={totalQuestions}
                reward={chapterReward}
                onContinue={handleContinueToNext}
                onBackToDashboard={handleBackToDashboard}
              />
            )}
        </div>
      </main>
    </div>
  );
}
