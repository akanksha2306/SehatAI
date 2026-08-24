import React, { useState } from "react";
import { useNavigate } from "react-router";
import { apiClient } from "../lib/api-client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LEFT_COPY = {
  heading: "Your shield against confident nonsense.",
  body: "SehatAI coaches clinicians to use AI safely, confidently, and on the job — built around real tasks, not abstract theory.",
};

export function SignIn(): React.ReactElement {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = EMAIL_REGEX.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!isValidEmail) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.requestMagicLink(email);

      // 🚨 DEV-ONLY BYPASS — see MagicLinkResponse comment in api-client.ts.
      // Only ever present for the one hardcoded test email; skips the
      // "check your email" step entirely and signs straight in.
      if (response.token) {
        localStorage.setItem("sehatai_token", response.token);
        const me = await apiClient.getMe();
        navigate(me.onboarded ? "/dashboard" : "/onboarding");
        return;
      }

      setIsSubmitted(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send magic link";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left panel - static copy */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center px-6 py-8 lg:px-8 lg:py-12 border-b lg:border-b-0 lg:border-r border-neutral-300">
          <h2 className="text-3xl lg:text-4xl font-semibold text-text mb-4">
            {LEFT_COPY.heading}
          </h2>
          <p className="text-base lg:text-lg text-text leading-relaxed">
            {LEFT_COPY.body}
          </p>
        </div>

        {/* Right panel - message */}
        <div className="w-full lg:w-3/5 flex flex-col items-center justify-center px-6 py-8 lg:px-12 lg:py-12 bg-bg">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-text mb-2">Check your email</h1>
              <p className="text-text text-base">
                We've sent you a magic link to <strong>{email}</strong>
              </p>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
                setError(null);
              }}
              className="w-full px-6 py-3 rounded-full font-medium text-base bg-accent text-white hover:opacity-90 transition-opacity"
            >
              Try another email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel - static copy */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center px-6 py-8 lg:px-8 lg:py-12 border-b lg:border-b-0 lg:border-r border-neutral-300">
        <h2 className="text-3xl lg:text-4xl font-semibold text-text mb-4">
          {LEFT_COPY.heading}
        </h2>
        <p className="text-base lg:text-lg text-text leading-relaxed">
          {LEFT_COPY.body}
        </p>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center px-6 py-8 lg:px-12 lg:py-12 bg-bg">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="you@hospital.org"
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-surface text-text placeholder-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValidEmail || isLoading}
              className="w-full px-6 py-3 rounded-full font-medium text-base bg-accent text-white disabled:opacity-45 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {isLoading ? "Sending..." : "Send magic link"}
            </button>
          </form>

          <p className="text-xs text-text text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
