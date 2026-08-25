import React from 'react';
import { TaskChip } from '../atoms/task-chip';
import { cn } from '../../../lib/utils';

const TASK_SUGGESTIONS = [
  'Discharge instructions',
  'Shift handoff (SBAR)',
  'Referral letter',
  'Prior-auth letter',
  'Patient portal replies',
];

interface TaskInputSectionProps {
  task: string;
  onTaskChange: (task: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
}

export function TaskInputSection({
  task,
  onTaskChange,
  description,
  onDescriptionChange,
}: TaskInputSectionProps): React.ReactElement {
  const handleChipClick = (suggestion: string): void => {
    onTaskChange(suggestion);
  };

  return (
    <div className="space-y-6">
      {/* Task Input */}
      <div className="space-y-3">
        <label
          htmlFor="task"
          className="block text-sm font-semibold text-text uppercase tracking-wide"
        >
          What task do you want to build a workflow for?
        </label>
        <input
          id="task"
          type="text"
          value={task}
          onChange={(e) => onTaskChange(e.target.value)}
          placeholder="Enter your task..."
          className={cn(
            'w-full px-4 py-3 rounded-lg border text-sm font-medium transition-colors',
            'border-neutral-300 bg-surface text-text placeholder:text-neutral-500',
            'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent'
          )}
        />
      </div>

      {/* Task Suggestions */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
          Quick picks
        </p>
        <div className="flex flex-wrap gap-2">
          {TASK_SUGGESTIONS.map((suggestion) => (
            <TaskChip
              key={suggestion}
              label={suggestion}
              isSelected={task === suggestion}
              onClick={() => handleChipClick(suggestion)}
            />
          ))}
        </div>
      </div>

      {/* Description Input */}
      <div className="space-y-3">
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-text uppercase tracking-wide"
        >
          How you do this now (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe your current process..."
          rows={4}
          className={cn(
            'w-full px-4 py-3 rounded-lg border text-sm font-medium transition-colors',
            'border-neutral-300 bg-surface text-text placeholder:text-neutral-500',
            'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent',
            'resize-none'
          )}
        />
      </div>
    </div>
  );
}
