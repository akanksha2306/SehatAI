import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface PromptBankCardProps {
  name: string;
  prompt: string;
}

export function PromptBankCard({ name, prompt }: PromptBankCardProps): React.ReactElement {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(prompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch {
      console.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="border border-neutral-300 rounded-lg bg-surface p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h3
          className="text-lg font-semibold text-text"
          style={{ fontFamily: 'var(--heading)' }}
        >
          {name}
        </h3>
      </div>

      {/* Prompt Text */}
      <div
        className="rounded p-4 text-sm text-text overflow-auto max-h-48"
        style={{ fontFamily: 'var(--mono)', backgroundColor: 'var(--code-bg)' }}
      >
        <pre className="m-0 whitespace-pre-wrap word-break">{prompt}</pre>
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopyToClipboard}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          isCopied
            ? 'bg-accent-2 text-white'
            : 'border border-neutral-300 bg-surface text-text hover:border-accent hover:shadow-md'
        )}
      >
        {isCopied ? (
          <>
            <Check size={16} strokeWidth={2} />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy size={16} strokeWidth={2} />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
}
