import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ArrowRight } from 'lucide-react';

interface DoctorIntroCardProps {
  onStartQuiz: () => void;
}

export function DoctorIntroCard({ onStartQuiz }: DoctorIntroCardProps): React.ReactElement {
  return (
    <div className="w-full space-y-8">
      {/* Animation */}
      <section className="flex justify-center">
        <div className="w-full max-w-sm h-auto">
          <DotLottieReact
            src="/animations/dna-doctor.lottie"
            loop
            autoplay
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </section>

      {/* Content */}
      <section className="space-y-4 text-center">
        <h2
          className="text-3xl font-bold text-text"
          style={{ fontFamily: 'var(--heading)' }}
        >
          Ready to test what you learned?
        </h2>
        <p className="text-base text-text leading-relaxed">
          Let's see how well you understood the key concepts from this chapter.
        </p>
      </section>

      {/* CTA */}
      <section className="flex justify-center">
        <button
          onClick={onStartQuiz}
          className="flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-lg bg-accent text-white hover:opacity-90 transition-opacity"
        >
          Start quiz
          <ArrowRight size={20} strokeWidth={2} />
        </button>
      </section>
    </div>
  );
}
