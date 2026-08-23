import React from "react";
import { cn } from "../../../lib/utils";

export interface StepIndicatorProps {
  steps: string[];
  currentStepIndex: number;
  isDone: boolean;
}

export function StepIndicator({
  steps,
  currentStepIndex,
  isDone,
}: StepIndicatorProps): React.ReactElement {
  const totalSteps = steps.length;
  const progressPercent = isDone
    ? 100
    : Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar */}
      <div className="h-1 border border-neutral-300 rounded-full overflow-hidden bg-surface">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step list */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = !isDone && index === currentStepIndex;
          const isComplete = isDone || index < currentStepIndex;

          return (
            <div key={index} className="flex items-center gap-3">
              {/* Step dot */}
              <div
                className={cn(
                  "flex-none w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  isComplete
                    ? "bg-accent text-white border-2 border-accent"
                    : isActive
                      ? "bg-surface text-accent border-2 border-accent"
                      : "bg-transparent border-2 border-neutral-300"
                )}
                style={
                  !isComplete && !isActive
                    ? { color: "var(--text)" }
                    : undefined
                }
              >
                {isComplete ? "✓" : String(index + 1)}
              </div>

              {/* Step label */}
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

      {/* Status text */}
      <p className="text-xs text-neutral-500 mt-3">
        {isDone
          ? "Complete"
          : `Step ${currentStepIndex + 1} of ${totalSteps}`}
      </p>
    </div>
  );
}
