import React, { useState } from "react";
import { useNavigate } from "react-router";
import { apiClient } from "../lib/api-client";
import { identify, track } from "../lib/analytics";
import { useAuth } from "../contexts/auth-context";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LEFT_COPY = {
  heading: "AI literacy for clinicians who don't have time to be fooled.",
  body: "SehatAI coaches clinicians to use AI safely, confidently, and on the job — built around real tasks, not abstract theory.",
};

/**
 * Simplified anatomical heart, animated with a two-beat "lub-dub" pulse.
 * Custom-drawn SVG (no external asset) so there's no licensing concern
 * and it stays crisp at any size.
 */
function PumpingHeart(): React.ReactElement {
  return (
    <div className="relative w-40 h-40 lg:w-48 lg:h-48 mx-auto mb-6">
      <style>{`
        @keyframes heartbeat {
          0%   { transform: scale(1); }
          14%  { transform: scale(1.12); }
          28%  { transform: scale(1); }
          42%  { transform: scale(1.16); }
          70%  { transform: scale(1); }
          100% { transform: scale(1); }
        }
        .heartbeat-svg {
          animation: heartbeat 1.4s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
      <svg
        viewBox="0 0 100 120"
        className="heartbeat-svg w-full h-full"
        aria-hidden="true"
      >
        {/* Vessel stubs */}
        <rect x="38" y="4" width="10" height="34" fill="var(--accent)" stroke="var(--text)" strokeWidth="3" strokeLinejoin="round" />
        <rect x="52" y="14" width="8" height="24" fill="var(--accent)" stroke="var(--text)" strokeWidth="3" strokeLinejoin="round" />
        <rect x="26" y="24" width="8" height="30" fill="var(--accent)" stroke="var(--text)" strokeWidth="3" strokeLinejoin="round" />
        {/* Heart body */}
        <path
          d="M 43 34
             C 30 20, 8 28, 8 48
             C 8 68, 30 82, 46 112
             C 62 82, 92 66, 92 42
             C 92 22, 68 16, 56 30
             C 52 34, 46 38, 43 34 Z"
          fill="var(--accent)"
          stroke="var(--text)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Highlight line, echoing the reference sketch */}
        <path
          d="M 36 76 L 58 92"
          stroke="var(--text)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl lg:text-4xl font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]">
          SehatAI
        </span>
      </div>
    </div>
  );
}

function HeroPanel(): React.ReactElement {
  return (
    <div className="w-full lg:w-2/5 flex flex-col justify-center px-6 py-8 lg:px-8 lg:py-12 border-b lg:border-b-0 lg:border-r border-neutral-300">
      <PumpingHeart />
      <h2 className="text-3xl lg:text-4xl font-semibold text-text mb-4 text-center lg:text-left">
        {LEFT_COPY.heading}
      </h2>
      <p className="text-base lg:text-lg text-text leading-relaxed text-center lg:text-left">
        {LEFT_COPY.body}
      </p>
    </div>
  );
}

export function SignIn(): React.ReactElement {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const isValidEmail = EMAIL_REGEX.test(email);
  const isValidCode = /^\d{6}$/.test(code);

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
        identify(me.id);
        login(me);
        track('user_signed_in', { method: 'dev_bypass' });
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

  const handleCodeSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!isValidCode) return;

    setIsVerifying(true);
    setCodeError(null);

    try {
      const response = await apiClient.verifyCode(email, code);
      localStorage.setItem("sehatai_token", response.token);
      const me = await apiClient.getMe();
      identify(me.id);
      login(me);
      track('user_signed_in', { method: 'code' });
      navigate(me.onboarded ? "/dashboard" : "/onboarding");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify code";
      setCodeError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        <HeroPanel />

        {/* Right panel - code verification form */}
        <div className="w-full lg:w-3/5 flex flex-col items-center justify-center px-6 py-8 lg:px-12 lg:py-12 bg-bg">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-text mb-2">Check your email</h1>
              <p className="text-text text-base">
                We've sent a 6-digit code to <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-text mb-2"
                >
                  Verification code
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => {
                    const numericOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setCode(numericOnly);
                    setCodeError(null);
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-surface text-text placeholder-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors text-center tracking-widest font-mono"
                />
                {codeError && (
                  <p className="text-sm text-red-600 mt-2 font-medium border border-red-200 bg-red-50 rounded-lg px-3 py-2">
                    ⚠ {codeError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValidCode || isVerifying}
                className="w-full px-6 py-3 rounded-full font-medium text-base bg-accent text-white disabled:opacity-45 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </button>
            </form>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
                setCode("");
                setError(null);
                setCodeError(null);
              }}
              className="w-full mt-3 px-6 py-3 rounded-full font-medium text-base border border-neutral-300 text-text bg-transparent hover:bg-surface transition-colors"
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
      <HeroPanel />

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
                <p className="text-sm text-red-600 mt-2 font-medium border border-red-200 bg-red-50 rounded-lg px-3 py-2">
                  ⚠ {error}
                </p>
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
