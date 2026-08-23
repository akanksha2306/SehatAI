import React from 'react';
import { cn } from '../../../lib/utils';

export type Dialect =
  | 'spanish-mexican'
  | 'spanish-caribbean'
  | 'hindi'
  | 'tagalog'
  | 'vietnamese'
  | 'arabic-levantine'
  | 'mandarin-simplified'
  | 'portuguese-brazilian'
  | 'plain-english';

const DIALECT_OPTIONS: Array<{ value: Dialect; label: string }> = [
  { value: 'spanish-mexican', label: 'Spanish (Mexican)' },
  { value: 'spanish-caribbean', label: 'Spanish (Caribbean)' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'tagalog', label: 'Tagalog' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'arabic-levantine', label: 'Arabic (Levantine)' },
  { value: 'mandarin-simplified', label: 'Mandarin (Simplified)' },
  { value: 'portuguese-brazilian', label: 'Portuguese (Brazilian)' },
  { value: 'plain-english', label: 'Plain English (low literacy)' },
];

interface DialectSelectorProps {
  value: Dialect | '';
  onChange: (dialect: Dialect) => void;
  disabled?: boolean;
}

export function DialectSelector({
  value,
  onChange,
  disabled = false,
}: DialectSelectorProps): React.ReactElement {
  return (
    <div className="space-y-2">
      <label
        htmlFor="dialect-select"
        className="text-xs uppercase tracking-wide text-neutral-500 font-semibold"
      >
        Target Dialect
      </label>
      <select
        id="dialect-select"
        value={value}
        onChange={(e) => onChange(e.target.value as Dialect)}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-3 rounded-lg text-sm text-text border border-neutral-300 bg-surface',
          'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        <option value="">Select a dialect...</option>
        {DIALECT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
