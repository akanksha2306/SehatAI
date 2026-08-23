export type ConfidenceLevel = "beginner" | "some" | "confident";
export type Challenge =
  | "docs"
  | "summaries"
  | "comms"
  | "coord"
  | "prompteng";
export type Goal =
  | "confident"
  | "time"
  | "prompts"
  | "verify"
  | "compliant"
  | "cme";
export type TimeCadence = "2" | "5" | "10";

export interface OnboardingAnswers {
  confidence: ConfidenceLevel | null;
  challenges: Challenge[];
  goal: Goal | null;
  timeCadence: TimeCadence | null;
}

export interface StepConfig {
  key: keyof OnboardingAnswers;
  label: string;
  question: string;
  hint: string;
  multiSelect: boolean;
  options: Array<{
    value: string;
    label: string;
    description: string;
  }>;
}

export interface LeftPanelCopy {
  heading: string;
  body: string;
}

export interface LeftPanelMap {
  confidence: LeftPanelCopy;
  challenges: LeftPanelCopy;
  goal: LeftPanelCopy;
  timeCadence: LeftPanelCopy;
  done: LeftPanelCopy;
}
