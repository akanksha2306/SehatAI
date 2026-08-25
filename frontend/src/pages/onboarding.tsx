import React, { useState } from "react";
import { Navigate } from "react-router";
import { apiClient } from "../lib/api-client";
import { OnboardingWizard } from "../features/onboarding/organisms/onboarding-wizard";
import type { OnboardingAnswers } from "../features/onboarding/types";
import { useAuth } from "../contexts/auth-context";

export function Onboarding(): React.ReactElement {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  if (isSubmitted) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleComplete = async (answers: OnboardingAnswers): Promise<void> => {
    setError(null);
    try {
      await apiClient.submitOnboarding({
        confidence: answers.confidence || "",
        challenges: answers.challenges,
        goal: answers.goal || "",
        timeCadence: answers.timeCadence || "",
      });
      // Re-fetch the user so the shared auth state picks up
      // onboarded: true — otherwise ProtectedRoute still sees the
      // stale pre-onboarding value and bounces back to /onboarding.
      const me = await apiClient.getMe();
      login(me);
      setIsSubmitted(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save onboarding";
      setError(errorMessage);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-bg">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-red-600 mb-2">
              Error
            </h1>
            <p className="text-text mb-6">{error}</p>
            <button
              onClick={() => setError(null)}
              className="inline-block px-6 py-3 rounded-full font-medium text-base bg-accent text-white hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <OnboardingWizard onComplete={handleComplete} />
    </div>
  );
}
