import React from 'react';
import { cn } from '../../../lib/utils';
import { Lock, CheckCircle } from 'lucide-react';

interface ChapterCardProps {
  index: number;
  title: string;
  reward: number;
  locked: boolean;
  completed: boolean;
  onClick?: () => void;
}

export function ChapterCard({
  index,
  title,
  reward,
  locked,
  completed,
  onClick,
}: ChapterCardProps): React.ReactElement {
  const isClickable = !locked;

  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={cn(
        'w-full text-left p-6 rounded-lg border transition-all',
        isClickable
          ? 'border-neutral-300 bg-surface hover:border-accent hover:shadow-md cursor-pointer'
          : 'border-neutral-300 bg-surface/50 opacity-60 cursor-not-allowed'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {locked ? (
            <div className="w-8 h-8 flex items-center justify-center text-neutral-500">
              <Lock size={20} strokeWidth={1.5} />
            </div>
          ) : completed ? (
            <div className="w-8 h-8 flex items-center justify-center text-accent-2">
              <CheckCircle size={20} strokeWidth={1.5} />
            </div>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-accent text-white text-sm font-semibold">
              {index + 1}
            </div>
          )}
          <h3
            className="text-lg font-semibold text-text"
            style={{ fontFamily: 'var(--heading)' }}
          >
            {title}
          </h3>
        </div>
        <span className="text-sm font-medium text-accent-2 whitespace-nowrap ml-2">
          +{reward}
        </span>
      </div>
      <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
        {locked
          ? 'Locked'
          : completed
            ? 'Completed'
            : 'Available'}
      </p>
    </button>
  );
}
