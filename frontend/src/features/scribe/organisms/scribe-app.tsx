import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { RecordingSimulator } from '../molecules/recording-simulator';
import { DialectSelector, type Dialect } from '../molecules/dialect-selector';
import { cn } from '../../../lib/utils';

type Step = 'record' | 'translate' | 'result';

export function ScribeApp(): React.ReactElement {
  const [step, setStep] = useState<Step>('record');
  const [transcript, setTranscript] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [selectedDialect, setSelectedDialect] = useState<Dialect | ''>('');
  const [translationResult, setTranslationResult] = useState<string | null>(null);

  const translateMutation = useMutation({
    mutationFn: (data: { transcript: string; dialect: Dialect }) =>
      apiClient.translateScribe(data.transcript, data.dialect),
    onSuccess: (data) => {
      setTranslationResult(data.translated);
      setStep('result');
    },
    onError: () => {
      // Error handling could show a toast here
    },
  });

  const handleRecordingComplete = (recordedTranscript: string): void => {
    setTranscript(recordedTranscript);
    setStep('translate');
  };

  const handleTranslate = (): void => {
    if (transcript && selectedDialect) {
      translateMutation.mutate({ transcript, dialect: selectedDialect });
    }
  };

  const handleRestart = (): void => {
    setStep('record');
    setTranscript('');
    setSelectedDialect('');
    setTranslationResult(null);
    translateMutation.reset();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <section className="space-y-2">
        <h1
          className="text-4xl lg:text-5xl font-bold text-text"
          style={{ fontFamily: 'var(--heading)' }}
        >
          AI Scribe
        </h1>
        <p className="text-lg text-neutral-500 max-w-2xl">
          Record a consultation, transcribe it live, and translate it to your patient's language and dialect.
        </p>
      </section>

      {/* Main Content */}
      <section className="space-y-6">
        {step === 'record' && (
          <div className="border border-neutral-300 rounded-lg bg-surface p-6 space-y-4">
            <RecordingSimulator
              onRecordingComplete={handleRecordingComplete}
              isRecording={isRecording}
              onIsRecordingChange={setIsRecording}
            />
          </div>
        )}

        {step === 'translate' && (
          <div className="border border-neutral-300 rounded-lg bg-surface p-6 space-y-4">
            {/* Recorded Transcript */}
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                  Recorded Transcript
                </p>
                <div
                  className="rounded p-4 text-sm text-text overflow-auto max-h-48"
                  style={{ fontFamily: 'var(--mono)', backgroundColor: 'var(--code-bg)' }}
                >
                  <pre className="m-0 whitespace-pre-wrap break-words">
                    {transcript}
                  </pre>
                </div>
              </div>
            </div>

            {/* Dialect Selector */}
            <DialectSelector
              value={selectedDialect}
              onChange={setSelectedDialect}
              disabled={translateMutation.isPending}
            />

            {/* Translate Button */}
            <button
              onClick={handleTranslate}
              disabled={!selectedDialect || translateMutation.isPending}
              className={cn(
                'w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                translateMutation.isPending || !selectedDialect
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  : 'bg-accent text-white hover:shadow-md'
              )}
            >
              {translateMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Translating...
                </span>
              ) : (
                'Translate'
              )}
            </button>

            {translateMutation.isError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">
                  Failed to translate. Please try again.
                </p>
              </div>
            )}

            {/* Back Button */}
            <button
              onClick={handleRestart}
              className={cn(
                'w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                'border border-neutral-300 bg-surface text-text hover:border-accent hover:shadow-md'
              )}
            >
              Record Again
            </button>
          </div>
        )}

        {step === 'result' && translationResult !== null && (
          <div className="border border-neutral-300 rounded-lg bg-surface p-6 space-y-4">
            {/* Translated Result */}
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                  Translation ({selectedDialect && selectedDialect.replace('-', ' ')})
                </p>
                <div
                  className="rounded p-4 text-sm text-text overflow-auto max-h-72"
                  style={{ fontFamily: 'var(--mono)', backgroundColor: 'var(--code-bg)' }}
                >
                  <pre className="m-0 whitespace-pre-wrap break-words">
                    {translationResult}
                  </pre>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleRestart}
                className={cn(
                  'w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  'bg-accent text-white hover:shadow-md'
                )}
              >
                Translate Another Consultation
              </button>

              <button
                onClick={() => setStep('translate')}
                className={cn(
                  'w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  'border border-neutral-300 bg-surface text-text hover:border-accent hover:shadow-md'
                )}
              >
                Try Different Dialect
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Info Box */}
      <section className="bg-accent-2-light border border-accent-2 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text mb-2">How it works</h3>
        <ul className="text-sm text-neutral-600 space-y-2 list-disc list-inside">
          <li>Start a recording to see the consultation transcript appear word-by-word</li>
          <li>Select your patient's language and regional dialect</li>
          <li>Translate the transcript while preserving medication names and dosages</li>
          <li>Share the translated consultation with your patient</li>
        </ul>
      </section>
    </div>
  );
}
