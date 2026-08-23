import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { TaskInputSection } from '../molecules/task-input-section';
import { WorkflowOutput } from '../molecules/workflow-output';
import { SavedWorkflowsList } from '../molecules/saved-workflows-list';
import { cn } from '../../../lib/utils';

type Step = 'input' | 'output';

export function WorkflowApp(): React.ReactElement {
  const [step, setStep] = useState<Step>('input');
  const [task, setTask] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Queries and mutations
  const generateMutation = useMutation({
    mutationFn: (data: { task: string; description?: string }) =>
      apiClient.generateWorkflow(data),
    onSuccess: (data) => {
      setOutput(data.output);
      setStep('output');
      setIsSaved(false);
    },
    onError: () => {
      console.error('Failed to generate workflow');
    },
  });

  const saveMutation = useMutation({
    mutationFn: (data: { task: string; description?: string; output: string }) =>
      apiClient.saveWorkflow(data),
    onSuccess: () => {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 1500);
      // Refetch saved workflows
      workflowsQuery.refetch();
    },
    onError: () => {
      console.error('Failed to save workflow');
    },
  });

  const workflowsQuery = useQuery({
    queryKey: ['workflows'],
    queryFn: () => apiClient.getSavedWorkflows(),
  });

  const handleBuildWorkflow = (): void => {
    if (task.trim()) {
      generateMutation.mutate({
        task: task.trim(),
        description: description.trim() || undefined,
      });
    }
  };

  const handleSaveWorkflow = (): void => {
    if (task.trim() && output.trim()) {
      saveMutation.mutate({
        task: task.trim(),
        description: description.trim() || undefined,
        output: output.trim(),
      });
    }
  };

  const handleReset = (): void => {
    setStep('input');
    setTask('');
    setDescription('');
    setOutput('');
    setIsSaved(false);
    generateMutation.reset();
    saveMutation.reset();
  };

  const isGenerating = generateMutation.isPending;
  const canBuild = task.trim().length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12">
      {/* Header */}
      <section className="space-y-2">
        <h1
          className="text-4xl lg:text-5xl font-bold text-text"
          style={{ fontFamily: 'var(--heading)' }}
        >
          Build Your Workflow
        </h1>
        <p className="text-lg text-neutral-500 max-w-2xl">
          Pick one weekly task and automate it. Leave with a workflow you'll actually use.
        </p>
      </section>

      {/* Main Content */}
      <section className="space-y-6">
        {step === 'input' && (
          <>
            <div className="border border-neutral-300 rounded-lg bg-surface p-6 space-y-4">
              <TaskInputSection
                task={task}
                onTaskChange={setTask}
                description={description}
                onDescriptionChange={setDescription}
              />

              {/* Build Button */}
              <button
                onClick={handleBuildWorkflow}
                disabled={!canBuild || isGenerating}
                className={cn(
                  'w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isGenerating || !canBuild
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    : 'bg-accent text-white hover:shadow-md'
                )}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Building your workflow...
                  </span>
                ) : (
                  'Build my workflow'
                )}
              </button>

              {generateMutation.isError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">
                    Failed to generate workflow. Please try again.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {step === 'output' && output && (
          <>
            <WorkflowOutput
              output={output}
              onCopy={() => {
                // Optional: track that copy was clicked
              }}
              onSave={handleSaveWorkflow}
              isSaving={saveMutation.isPending}
              isSaved={isSaved}
            />

            {saveMutation.isError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">
                  Failed to save workflow. Please try again.
                </p>
              </div>
            )}

            {/* Back Button */}
            <button
              onClick={handleReset}
              className={cn(
                'w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                'border border-neutral-300 bg-surface text-text hover:border-accent hover:shadow-md'
              )}
            >
              Build Another Workflow
            </button>
          </>
        )}
      </section>

      {/* Saved Workflows Section */}
      <section>
        <SavedWorkflowsList
          workflows={workflowsQuery.data || []}
          isLoading={workflowsQuery.isLoading}
        />
      </section>

      {/* Info Box */}
      <section className="bg-accent-2-light border border-accent-2 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text mb-2">How it works</h3>
        <ul className="text-sm text-neutral-600 space-y-2 list-disc list-inside">
          <li>Describe a task you do regularly and want to automate</li>
          <li>Get a playbook, ready-to-use prompt, and verification checklist</li>
          <li>Copy the workflow and save it for future reference</li>
          <li>Access all your saved workflows anytime</li>
        </ul>
      </section>
    </div>
  );
}
