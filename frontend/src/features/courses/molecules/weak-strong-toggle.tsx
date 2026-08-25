import React, { useState } from 'react';
import type { ChapterExample } from '../../../lib/api-client';
import { cn } from '../../../lib/utils';

interface WeakStrongToggleProps {
  example: ChapterExample;
}

export function WeakStrongToggle({
  example,
}: WeakStrongToggleProps): React.ReactElement {
  const [isStrong, setIsStrong] = useState<boolean>(false);

  const currentPrompt = isStrong ? example.strongPrompt : example.weakPrompt;
  const currentOutput = isStrong ? example.strongOutput : example.weakOutput;

  return (
    <section className="border border-neutral-300 rounded-lg bg-surface p-6 space-y-6">
      {/* Toggle Header */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="prompt-strength-toggle"
          className="text-sm font-semibold text-text"
        >
          Prompt strength
        </label>
        <div className="flex items-center gap-2 bg-surface p-1 rounded-full">
          <button
            onClick={() => setIsStrong(false)}
            className={cn(
              'px-4 py-2 rounded-full font-medium text-sm transition-all',
              !isStrong
                ? 'bg-white text-text shadow-sm border border-neutral-300'
                : 'text-neutral-500 hover:text-text'
            )}
            aria-pressed={!isStrong}
          >
            Weak
          </button>
          <button
            onClick={() => setIsStrong(true)}
            className={cn(
              'px-4 py-2 rounded-full font-medium text-sm transition-all',
              isStrong
                ? 'bg-white text-text shadow-sm border border-neutral-300'
                : 'text-neutral-500 hover:text-text'
            )}
            aria-pressed={isStrong}
          >
            Strong
          </button>
        </div>
      </div>

      {/* Prompt Box */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
          Prompt
        </p>
        <div
          className="rounded p-4 text-sm text-text overflow-auto max-h-48"
          style={{ fontFamily: 'var(--mono)', backgroundColor: 'var(--code-bg)' }}
        >
          <pre className="m-0 whitespace-pre-wrap break-words">{currentPrompt}</pre>
        </div>
      </div>

      {/* Output Box */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
          Output
        </p>
        <div className="rounded p-4 bg-surface border border-neutral-300 text-sm text-text leading-relaxed">
          {currentOutput}
        </div>
      </div>
    </section>
  );
}
