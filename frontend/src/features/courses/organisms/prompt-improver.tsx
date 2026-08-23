import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { cn } from '../../../lib/utils';

export function PromptImprover(): React.ReactElement {
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [improvedPrompt, setImprovedPrompt] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (prompt: string) => apiClient.improvePrompt(prompt),
    onSuccess: (data) => {
      setImprovedPrompt(data.improved);
    },
    onError: () => {
      // Error handling could show a toast here
    },
  });

  const handleImprove = (): void => {
    if (inputPrompt.trim()) {
      mutation.mutate(inputPrompt);
    }
  };

  const handleRewriteAgain = (): void => {
    setImprovedPrompt(null);
    mutation.reset();
  };

  return (
    <div className="border border-neutral-300 rounded-lg bg-surface p-6 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h3
          className="text-lg font-semibold text-text"
          style={{ fontFamily: 'var(--heading)' }}
        >
          Prompt Improver
        </h3>
        <p className="text-sm text-neutral-500">
          Refine a rough prompt into a well-structured one using the role, task, context, format, and constraints framework.
        </p>
      </div>

      {improvedPrompt ? (
        <>
          {/* Result Display */}
          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                Improved Prompt
              </p>
              <div
                className="rounded p-4 text-sm text-text overflow-auto max-h-72"
                style={{ fontFamily: 'var(--mono)', backgroundColor: 'var(--code-bg)' }}
              >
                <pre className="m-0 whitespace-pre-wrap break-words">
                  {improvedPrompt}
                </pre>
              </div>
            </div>
          </div>

          {/* Rewrite Again Button */}
          <button
            onClick={handleRewriteAgain}
            className={cn(
              'w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              'border border-neutral-300 bg-surface text-text hover:border-accent hover:shadow-md'
            )}
          >
            Rewrite Again
          </button>
        </>
      ) : (
        <>
          {/* Input Textarea */}
          <div className="space-y-2">
            <label
              htmlFor="prompt-input"
              className="text-xs uppercase tracking-wide text-neutral-500 font-semibold"
            >
              Your Rough Prompt
            </label>
            <textarea
              id="prompt-input"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Paste or type a rough prompt here..."
              className={cn(
                'w-full px-4 py-3 rounded-lg text-sm text-text border border-neutral-300 bg-bg',
                'placeholder:text-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent',
                'resize-vertical min-h-32 max-h-96'
              )}
            />
          </div>

          {/* Improve Button */}
          <button
            onClick={handleImprove}
            disabled={!inputPrompt.trim() || mutation.isPending}
            className={cn(
              'w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              mutation.isPending || !inputPrompt.trim()
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-accent text-white hover:shadow-md'
            )}
          >
            {mutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Improving...
              </span>
            ) : (
              'Improve'
            )}
          </button>

          {mutation.isError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">
                Failed to improve prompt. Please try again.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
