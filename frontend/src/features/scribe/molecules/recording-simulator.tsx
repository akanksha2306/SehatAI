import React, { useState, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface RecordingSimulatorProps {
  onRecordingComplete: (transcript: string) => void;
  isRecording: boolean;
  onIsRecordingChange: (isRecording: boolean) => void;
}

const SAMPLE_CONVERSATION = `Doctor: Your blood pressure is a little high. I'm starting you on amlodipine, 5 milligrams, once every morning.
Patient: Do I take it with food?
Doctor: You can take it with or without food, but take it at the same time each day. Come back in four weeks so we can check how it's working.`;

const WORD_DELAY_MS = 110; // milliseconds between words

export function RecordingSimulator({
  onRecordingComplete,
  isRecording,
  onIsRecordingChange,
}: RecordingSimulatorProps): React.ReactElement {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [wordIndex, setWordIndex] = useState<number>(0);

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    const words = SAMPLE_CONVERSATION.split(/\s+/);

    if (wordIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) =>
          prev ? `${prev} ${words[wordIndex]}` : words[wordIndex]
        );
        setWordIndex((prev) => prev + 1);
      }, WORD_DELAY_MS);

      return () => clearTimeout(timer);
    } else {
      // Recording complete
      onIsRecordingChange(false);
      onRecordingComplete(SAMPLE_CONVERSATION);
    }
  }, [isRecording, wordIndex, onRecordingComplete, onIsRecordingChange]);

  const handleStartRecording = (): void => {
    setDisplayedText('');
    setWordIndex(0);
    onIsRecordingChange(true);
  };

  const handleStopRecording = (): void => {
    onIsRecordingChange(false);
    onRecordingComplete(SAMPLE_CONVERSATION);
  };

  return (
    <div className="space-y-4">
      {/* Recording Status */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
          {isRecording ? 'Recording in progress' : 'Consultation Recording'}
        </p>
        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm text-neutral-500">Recording...</span>
          </div>
        )}
      </div>

      {/* Transcript Display */}
      <div
        className={cn(
          'rounded p-4 text-sm text-text min-h-40 border',
          isRecording
            ? 'border-accent-2 bg-accent-2-light'
            : 'border-neutral-300 bg-bg'
        )}
        style={{ fontFamily: 'var(--mono)' }}
      >
        <pre className="m-0 whitespace-pre-wrap break-words">
          {displayedText || (isRecording ? '' : SAMPLE_CONVERSATION)}
        </pre>
      </div>

      {/* Control Button */}
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className={cn(
          'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          isRecording
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-accent text-white hover:shadow-md'
        )}
      >
        {isRecording ? (
          <>
            <Square size={16} strokeWidth={2} fill="currentColor" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic size={16} strokeWidth={2} />
            Start Recording
          </>
        )}
      </button>
    </div>
  );
}
