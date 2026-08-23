import React from 'react';
import { cn } from '../../../lib/utils';

interface TaskChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function TaskChip({
  label,
  isSelected,
  onClick,
}: TaskChipProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
        isSelected
          ? 'bg-accent text-white'
          : 'border border-neutral-300 bg-surface text-text hover:border-accent'
      )}
    >
      {label}
    </button>
  );
}
