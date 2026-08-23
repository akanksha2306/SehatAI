import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface WorkflowOutputProps {
  output: string;
  onCopy: () => void;
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
}

export function WorkflowOutput({
  output,
  onCopy,
  onSave,
  isSaving,
  isSaved,
}: WorkflowOutputProps): React.ReactElement {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
      onCopy();
    } catch {
      console.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="border border-neutral-300 rounded-lg bg-surface p-6 space-y-4">
      {/* Output Display */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
          Your Workflow
        </p>
        <div
          className="rounded p-4 text-sm text-text overflow-auto max-h-96"
          style={{ fontFamily: 'var(--mono)', backgroundColor: 'var(--code-bg)' }}
        >
          <pre className="m-0 whitespace-pre-wrap break-words">{output}</pre>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        {/* Copy Button */}
        <button
          onClick={handleCopy}
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

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            isSaved
              ? 'bg-accent-2 text-white'
              : isSaving
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-accent text-white hover:shadow-md'
          )}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Saving...</span>
            </>
          ) : isSaved ? (
            <>
              <Check size={16} strokeWidth={2} />
              <span>Saved</span>
            </>
          ) : (
            <span>Save to my workflows</span>
          )}
        </button>
      </div>
    </div>
  );
}
