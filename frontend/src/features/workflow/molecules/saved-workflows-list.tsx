import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { SavedWorkflow } from '../../../lib/api-client';

interface SavedWorkflowsListProps {
  workflows: SavedWorkflow[];
  isLoading: boolean;
}

export function SavedWorkflowsList({
  workflows,
  isLoading,
}: SavedWorkflowsListProps): React.ReactElement {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string): void => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2
          className="text-2xl font-semibold text-text"
          style={{ fontFamily: 'var(--heading)' }}
        >
          Saved Workflows
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="space-y-4">
        <h2
          className="text-2xl font-semibold text-text"
          style={{ fontFamily: 'var(--heading)' }}
        >
          Saved Workflows
        </h2>
        <div className="border border-neutral-300 rounded-lg bg-surface p-6 text-center">
          <p className="text-neutral-500">
            No saved workflows yet. Build and save your first workflow above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2
        className="text-2xl font-semibold text-text"
        style={{ fontFamily: 'var(--heading)' }}
      >
        Saved Workflows
      </h2>
      <div className="space-y-2">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="border border-neutral-300 rounded-lg bg-surface overflow-hidden"
          >
            <button
              onClick={() => toggleExpand(workflow.id)}
              className={cn(
                'w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors',
                expandedId === workflow.id && 'bg-neutral-50'
              )}
            >
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-semibold text-text">
                  {workflow.task}
                </h3>
                <p className="text-xs text-neutral-500">
                  Created {formatDate(workflow.createdAt)}
                </p>
              </div>
              {expandedId === workflow.id ? (
                <ChevronUp size={20} className="text-neutral-400 flex-shrink-0" />
              ) : (
                <ChevronDown size={20} className="text-neutral-400 flex-shrink-0" />
              )}
            </button>

            {expandedId === workflow.id && (
              <div className="border-t border-neutral-300 px-6 py-4 space-y-3 bg-neutral-50">
                {workflow.description && (
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                      Process Description
                    </p>
                    <p className="text-sm text-text whitespace-pre-wrap">
                      {workflow.description}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                    Workflow Output
                  </p>
                  <div
                    className="rounded p-4 text-sm text-text overflow-auto max-h-48"
                    style={{
                      fontFamily: 'var(--mono)',
                      backgroundColor: 'var(--code-bg)',
                    }}
                  >
                    <pre className="m-0 whitespace-pre-wrap break-words">
                      {workflow.output}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
