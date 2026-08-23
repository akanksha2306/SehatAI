import React from 'react';
import { cn } from '../../../lib/utils';

interface ProgressBarProps {
  completed: number;
  total: number;
  showLabel?: boolean;
}

export function ProgressBar({
  completed,
  total,
  showLabel = true,
}: ProgressBarProps): React.ReactElement {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div>
      {showLabel && (
        <div className="flex justify-between mb-2">
          <p className="text-sm font-semibold text-text">Progress</p>
          <p className="text-sm font-semibold text-neutral-500">
            {completed} of {total}
          </p>
        </div>
      )}
      <div className="w-full h-3 rounded-full bg-neutral-300 overflow-hidden">
        <div
          className={cn(
            'h-full bg-accent-2 transition-all duration-300',
            percentage > 0 && 'rounded-full'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
