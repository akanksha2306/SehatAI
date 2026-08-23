export type CourseTrack = 'prompt' | 'hall';

export interface CourseContextValue {
  track: CourseTrack;
  currentChapterIndex: number | null;
  quizScore: number | null;
  isLoading: boolean;
}
