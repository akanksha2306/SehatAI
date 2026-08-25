export type CourseTrack = 'prompt' | 'hall' | 'promptlab_dummy';

export interface CourseContextValue {
  track: CourseTrack;
  currentChapterIndex: number | null;
  quizScore: number | null;
  isLoading: boolean;
}
