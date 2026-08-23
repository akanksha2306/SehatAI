import React from 'react';
import { cn } from '../../../lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

type OptionState = 'idle' | 'selected' | 'correct' | 'incorrect';

interface QuizOptionProps {
  text: string;
  state: OptionState;
  onClick?: () => void;
  disabled?: boolean;
}

export function QuizOption({
  text,
  state,
  onClick,
  disabled = false,
}: QuizOptionProps): React.ReactElement {
  const isDisabled = disabled || state !== 'idle';

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-3',
        state === 'idle' &&
          'border-neutral-300 bg-surface hover:border-accent hover:shadow-sm cursor-pointer',
        state === 'selected' && 'border-accent bg-accent-light',
        state === 'correct' && 'border-accent-2 bg-accent-2-light',
        state === 'incorrect' && 'border-red-400 bg-red-50',
        isDisabled && !['idle', 'selected'].includes(state) && 'cursor-default'
      )}
    >
      <div className="flex-1">
        <p className="text-sm text-text">{text}</p>
      </div>
      {state === 'correct' && (
        <CheckCircle size={20} className="text-accent-2 flex-shrink-0 mt-0.5" strokeWidth={2} />
      )}
      {state === 'incorrect' && (
        <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
      )}
      {state === 'idle' && (
        <div className="w-5 h-5 rounded-full border-2 border-neutral-300 flex-shrink-0 mt-0.5" />
      )}
      {state === 'selected' && (
        <div className="w-5 h-5 rounded-full border-2 border-accent bg-accent flex-shrink-0 mt-0.5" />
      )}
    </button>
  );
}
