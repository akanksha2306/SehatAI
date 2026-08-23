import type {
  StepConfig,
  LeftPanelMap,
} from "./types";

export const STEPS: StepConfig[] = [
  {
    key: "confidence",
    label: "Confidence",
    question: "How confident are you with AI at work?",
    hint: "Pick the one that stings least — no wrong answer.",
    multiSelect: false,
    options: [
      {
        value: "beginner",
        label: "Beginner",
        description: "New to this. I've barely touched AI in my workflow.",
      },
      {
        value: "some",
        label: "Some experience",
        description: "I've tried it. Results are hit or miss.",
      },
      {
        value: "confident",
        label: "Confident",
        description:
          "I use it daily — I just want the edge cases.",
      },
    ],
  },
  {
    key: "challenges",
    label: "Challenges",
    question: "Where does your day leak the most time?",
    hint: "Choose all that apply. We aim the lessons here first.",
    multiSelect: true,
    options: [
      {
        value: "docs",
        label: "Documentation & notes",
        description: "Visit notes, charting, the endless typing.",
      },
      {
        value: "summaries",
        label: "Chart & record summaries",
        description: "Pulling the signal out of long histories.",
      },
      {
        value: "comms",
        label: "Patient communication",
        description:
          "Portal replies, education, difficult news.",
      },
      {
        value: "coord",
        label: "Team coordination",
        description:
          "Handoffs, follow-ups, herding humans.",
      },
      {
        value: "prompteng",
        label: "Prompt engineering",
        description:
          "Getting AI to actually do what you mean.",
      },
    ],
  },
  {
    key: "goal",
    label: "Goal",
    question: "What do you want out of SehatAI?",
    hint: "One anchor goal — you can chase the rest later.",
    multiSelect: false,
    options: [
      {
        value: "confident",
        label: "Use AI confidently day-to-day",
        description:
          "Stop guessing, start trusting your process.",
      },
      {
        value: "time",
        label: "Save time on documentation",
        description:
          "Win back the hours the keyboard steals.",
      },
      {
        value: "prompts",
        label: "Write better prompts",
        description:
          "Ask sharper, get answers worth using.",
      },
      {
        value: "verify",
        label: "Verify AI output safely",
        description:
          "Catch the confident nonsense before it lands.",
      },
      {
        value: "compliant",
        label: "Stay compliant & private",
        description:
          "Know what is safe to share, and what never is.",
      },
      {
        value: "cme",
        label: "Earn CME credits",
        description: "Turn daily practice into logged credit.",
      },
    ],
  },
  {
    key: "timeCadence",
    label: "Cadence",
    question: "How much time can you give it a day?",
    hint: "Daily beats long. Be honest — streaks are the point.",
    multiSelect: false,
    options: [
      {
        value: "2",
        label: "2 minutes",
        description: "A scenario card. The micro-dose.",
      },
      {
        value: "5",
        label: "5 minutes",
        description: "A lesson bite. The sweet spot.",
      },
      {
        value: "10",
        label: "10 minutes",
        description: "A full interactive case. Go deep.",
      },
    ],
  },
];

export const LEFT_COPY: LeftPanelMap = {
  confidence: {
    heading: "We meet you where you are.",
    body: "The path calibrates to your actual level — not where a generic course assumes you should be.",
  },
  challenges: {
    heading: "Point us at the pain.",
    body: "Tell us where the day leaks time, and the first lessons will aim straight at it.",
  },
  goal: {
    heading: "Name the win.",
    body: "One goal anchors your path and shapes what we surface each day.",
  },
  timeCadence: {
    heading: "Small, but daily.",
    body: "A few minutes a day compounds. Pick a dose you will actually keep.",
  },
  done: {
    heading: "You're all set, Doctor.",
    body: "Your path is calibrated. Time to earn your first streak.",
  },
};

export const STEP_LABELS = ["Confidence", "Challenges", "Goal", "Cadence"];

export function getOptionLabel(
  stepKey: string,
  value: string
): string | undefined {
  const step = STEPS.find((s) => s.key === stepKey);
  if (!step) return undefined;
  const option = step.options.find((o) => o.value === value);
  return option?.label;
}

export function getChallengeLabels(values: string[]): string[] {
  const step = STEPS.find((s) => s.key === "challenges");
  if (!step) return [];
  return values
    .map((value) => {
      const option = step.options.find((o) => o.value === value);
      return option?.label;
    })
    .filter((label): label is string => label !== undefined);
}
