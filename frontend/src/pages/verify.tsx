import React, { useState } from "react";
import { useSearchParams, Navigate } from "react-router";
import { apiClient } from "../lib/api-client";

const LEFT_COPY = {
  heading: "Your shield against confident nonsense.",
  body: "SehatAI coaches clinicians to use AI safely, confidently, and on the job — built around real tasks, not abstract theory.",
};

export function Verify(): React.ReactElement {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const token = searchParams.get("token");

  // If no token in query string, show error immediately
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left panel */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center px-6 py-8 lg:px-8 lg:py-12 border-b lg:border-b-0 lg:border-r border-neutral-300">
          <h2 className="text-3xl lg:text-4xl font-semibold text-text mb-4">
            {LEFT_COPY.heading}
          </h2>
          <p className="text-base lg:text-lg text-text leading-relaxed">
            {LEFT_COPY.body}
          </p>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-3/5 flex flex-col items-center justify-center px-6 py-8 lg:px-12 lg:py-12 bg-bg">
          <div className="w-full max-w-md text-center">
            <h1 className="text-2xl font-semibold text-red-600 mb-2">
              Verification failed
            </h1>
            <p className="text-text mb-6">No verification token provided</p>
            <a
              href="/"
              className="inline-block px-6 py-3 rounded-full font-medium text-base bg-accent text-white hover:opacity-90 transition-opacity"
            >
              Back to sign in
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left panel */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center px-6 py-8 lg:px-8 lg:py-12 border-b lg:border-b-0 lg:border-r border-neutral-300">
          <h2 className="text-3xl lg:text-4xl font-semibold text-text mb-4">
            {LEFT_COPY.heading}
          </h2>
          <p className="text-base lg:text-lg text-text leading-relaxed">
            {LEFT_COPY.body}
          </p>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-3/5 flex items-center justify-center px-6 py-8 lg:px-12 lg:py-12 bg-bg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-text font-medium">Verifying your email...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left panel */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center px-6 py-8 lg:px-8 lg:py-12 border-b lg:border-b-0 lg:border-r border-neutral-300">
          <h2 className="text-3xl lg:text-4xl font-semibold text-text mb-4">
            {LEFT_COPY.heading}
          </h2>
          <p className="text-base lg:text-lg text-text leading-relaxed">
            {LEFT_COPY.body}
          </p>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-3/5 flex flex-col items-center justify-center px-6 py-8 lg:px-12 lg:py-12 bg-bg">
          <div className="w-full max-w-md text-center">
            <h1 className="text-2xl font-semibold text-red-600 mb-2">
              Verification failed
            </h1>
            <p className="text-text mb-6">{error}</p>
            <a
              href="/"
              className="inline-block px-6 py-3 rounded-full font-medium text-base bg-accent text-white hover:opacity-90 transition-opacity"
            >
              Back to sign in
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handleCompleteSignIn = async (): Promise<void> => {
    setIsVerifying(true);
    setError(null);

    try {
      const response = await apiClient.verifyToken(token);
      localStorage.setItem("sehatai_token", response.token);

      // Check if user is onboarded
      const meData = await apiClient.getMe();
      const isOnboarded = (meData as unknown as Record<string, unknown>).onboarded === true;

      if (isOnboarded) {
        setRedirectPath("/dashboard");
      } else {
        setRedirectPath("/onboarding");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Verification failed";
      setError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  // Show the "Complete sign-in" button
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center px-6 py-8 lg:px-8 lg:py-12 border-b lg:border-b-0 lg:border-r border-neutral-300">
        <h2 className="text-3xl lg:text-4xl font-semibold text-text mb-4">
          {LEFT_COPY.heading}
        </h2>
        <p className="text-base lg:text-lg text-text leading-relaxed">
          {LEFT_COPY.body}
        </p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center px-6 py-8 lg:px-12 lg:py-12 bg-bg">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-text mb-2">
              Complete your sign-in
            </h1>
            <p className="text-text text-base">
              Click the button below to verify your email and access SehatAI
            </p>
          </div>

          <button
            onClick={handleCompleteSignIn}
            disabled={isVerifying}
            className="w-full px-6 py-3 rounded-full font-medium text-base bg-accent text-white disabled:opacity-45 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {isVerifying ? "Verifying..." : "Complete sign-in"}
          </button>

          <p className="text-xs text-text text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
