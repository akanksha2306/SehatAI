import React, { useState } from "react";
import { cn } from "../../../lib/utils";
import { STEPS, STEP_LABELS, LEFT_COPY, getChallengeLabels, getOptionLabel } from "../config";
import type { OnboardingAnswers } from "../types";
import { OptionCard } from "../atoms/option-card";

export interface OnboardingWizardProps {
  onComplete: (answers: OnboardingAnswers) => Promise<void>;
}

export function OnboardingWizard({
  onComplete,
}: OnboardingWizardProps): React.ReactElement {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    confidence: null,
    challenges: [],
    goal: null,
    timeCadence: null,
  });

  const currentStep = STEPS[currentStepIndex];
  const currentLeftCopy = currentStep
    ? LEFT_COPY[currentStep.key as keyof typeof LEFT_COPY]
    : LEFT_COPY.confidence;

  const canContinue = (): boolean => {
    if (isDone) return true;
    const step = STEPS[currentStepIndex];
    if (!step) return false;

    if (step.multiSelect) {
      return answers[step.key as "challenges"].length > 0;
    }

    const value = answers[step.key as keyof OnboardingAnswers];
    return value !== null;
  };

  const handleSelectOption = (value: string): void => {
    if (isDone) return;

    const step = STEPS[currentStepIndex];
    if (!step) return;

    setAnswers((prev) => {
      const newAnswers = { ...prev };

      if (step.multiSelect) {
        const challenges = newAnswers.challenges;
        if (challenges.includes(value as never)) {
          newAnswers.challenges = challenges.filter((v) => v !== (value as never));
        } else {
          newAnswers.challenges = [...challenges, value as never];
        }
      } else if (step.key === "confidence") {
        newAnswers.confidence = value as never;
      } else if (step.key === "goal") {
        newAnswers.goal = value as never;
      } else if (step.key === "timeCadence") {
        newAnswers.timeCadence = value as never;
      }

      return newAnswers;
    });
  };

  const handleNext = async (): Promise<void> => {
    if (!canContinue()) return;

    if (currentStepIndex >= STEPS.length - 1) {
      setIsDone(true);
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  };

  const handleBack = (): void => {
    if (isDone) {
      setIsDone(false);
      return;
    }

    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleFinish = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      await onComplete(answers);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    const totalSteps = STEP_LABELS.length;
    const progressPercent = 100;

    return (
      <div className="w-full h-full flex flex-col">
        {/* Main content area */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Left panel - sage green with step indicator */}
          <div className="w-full lg:w-2/5 border-b lg:border-b-0 lg:border-r border-neutral-300 px-6 py-8 lg:px-8 lg:py-12 flex flex-col justify-start bg-accent-2-light">
            <h2 className="text-3xl lg:text-4xl font-semibold text-text mb-4">
              {LEFT_COPY.done.heading}
            </h2>
            <p className="text-base lg:text-lg text-text leading-relaxed mb-8">
              {LEFT_COPY.done.body}
            </p>

            {/* Step indicator inside left panel */}
            <div className="space-y-3 mt-auto">
              {STEP_LABELS.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-none w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold bg-accent text-white border-2 border-accent">
                    ✓
                  </div>
                  <span className="text-sm font-semibold text-text">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel - Recap */}
          <div className="w-full lg:w-3/5 bg-bg flex flex-col justify-start">
            {/* Progress bar at top */}
            <div className="border-b border-neutral-300 px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex-1 h-1 border border-neutral-300 rounded-full overflow-hidden bg-surface">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 whitespace-nowrap">
                Step {totalSteps} of {totalSteps}
              </p>
            </div>

            <div className="px-6 py-8 lg:px-12 lg:py-12 flex flex-col justify-start">
              <h3 className="text-xl font-semibold text-text mb-6">
                Your path:
              </h3>

              <div className="space-y-4">
                {/* Confidence */}
                <div className="pb-4 border-b border-neutral-300">
                  <p className="text-sm font-medium text-text mb-1">
                    Confidence
                  </p>
                  <p className="text-base text-text">
                    {answers.confidence
                      ? getOptionLabel("confidence", answers.confidence)
                      : "—"}
                  </p>
                </div>

                {/* Focus areas */}
                <div className="pb-4 border-b border-neutral-300">
                  <p className="text-sm font-medium text-text mb-1">
                    Focus areas
                  </p>
                  <p className="text-base text-text">
                    {answers.challenges.length > 0
                      ? getChallengeLabels(answers.challenges).join(", ")
                      : "—"}
                  </p>
                </div>

                {/* Anchor goal */}
                <div className="pb-4 border-b border-neutral-300">
                  <p className="text-sm font-medium text-text mb-1">
                    Anchor goal
                  </p>
                  <p className="text-base text-text">
                    {answers.goal ? getOptionLabel("goal", answers.goal) : "—"}
                  </p>
                </div>

                {/* Daily cadence */}
                <div className="pb-4">
                  <p className="text-sm font-medium text-text mb-1">
                    Daily cadence
                  </p>
                  <p className="text-base text-text">
                    {answers.timeCadence
                      ? `${getOptionLabel("timeCadence", answers.timeCadence)} / day`
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 rounded-full font-medium text-base border border-neutral-300 text-text bg-bg hover:bg-surface transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  className={cn(
                    "px-6 py-3 rounded-full font-medium text-base text-white transition-opacity",
                    isSubmitting
                      ? "bg-accent opacity-45 cursor-not-allowed"
                      : "bg-accent hover:opacity-90"
                  )}
                >
                  {isSubmitting ? "Saving..." : "Start your journey"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalSteps = STEP_LABELS.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left panel - sage green with step indicator */}
        <div className="w-full lg:w-2/5 border-b lg:border-b-0 lg:border-r border-neutral-300 px-6 py-8 lg:px-8 lg:py-12 flex flex-col justify-start bg-accent-2-light">
          <h2 className="text-3xl lg:text-4xl font-semibold text-text mb-4">
            {currentLeftCopy.heading}
          </h2>
          <p className="text-base lg:text-lg text-text leading-relaxed mb-8">
            {currentLeftCopy.body}
          </p>

          {/* Step indicator inside left panel */}
          <div className="space-y-3 mt-auto">
            {STEP_LABELS.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isComplete = index < currentStepIndex;

              return (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex-none w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                      isComplete
                        ? "bg-accent text-white border-2 border-accent"
                        : isActive
                          ? "bg-bg text-accent border-2 border-accent"
                          : "bg-transparent border-2 border-neutral-300 text-text"
                    )}
                  >
                    {isComplete ? "✓" : String(index + 1)}
                  </div>
                  <span
                    className={cn(
                      "text-sm transition-all",
                      isActive || isComplete
                        ? "text-text font-semibold"
                        : "text-neutral-500 font-medium opacity-50"
                    )}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel - Question and options */}
        <div className="w-full lg:w-3/5 bg-bg flex flex-col justify-between">
          {/* Progress bar at top */}
          <div className="border-b border-neutral-300 px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex-1 h-1 border border-neutral-300 rounded-full overflow-hidden bg-surface">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs uppercase tracking-wide text-neutral-500 whitespace-nowrap">
              Step {currentStepIndex + 1} of {totalSteps}
            </p>
          </div>

          <div className="px-6 py-8 lg:px-12 lg:py-12 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl lg:text-3xl font-semibold text-text mb-2">
                {currentStep.question}
              </h3>
              <p className="text-neutral-500 text-sm mb-6">{currentStep.hint}</p>

              {/* Options */}
              <div className="space-y-3">
                {currentStep.options.map((option) => {
                  const stepKey = currentStep.key;
                  let isSelected = false;

                  if (currentStep.multiSelect) {
                    isSelected = answers[stepKey as "challenges"].includes(
                      option.value as never
                    );
                  } else {
                    isSelected = answers[stepKey as keyof OnboardingAnswers] === option.value;
                  }

                  return (
                    <OptionCard
                      key={option.value}
                      label={option.label}
                      description={option.description}
                      selected={isSelected}
                      multiSelect={currentStep.multiSelect}
                      onClick={() => handleSelectOption(option.value)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className={cn(
                  "px-6 py-3 rounded-full font-medium text-base border border-neutral-300 text-text bg-bg hover:bg-surface transition-colors",
                  currentStepIndex === 0 && "invisible"
                )}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canContinue()}
                className={cn(
                  "px-6 py-3 rounded-full font-medium text-base text-white transition-opacity ml-auto",
                  canContinue()
                    ? "bg-accent hover:opacity-90 cursor-pointer"
                    : "bg-accent opacity-45 cursor-not-allowed"
                )}
              >
                {currentStepIndex >= STEPS.length - 1 ? "Review" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
