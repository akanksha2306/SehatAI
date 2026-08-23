import React from 'react';
import { useNavigate } from 'react-router';
import { Logo } from '../components/logo';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { ScribeApp } from '../features/scribe/organisms/scribe-app';

export function Scribe(): React.ReactElement {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = (): void => {
    signOut();
  };

  const handleBack = (): void => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Header */}
      <header className="border-b border-neutral-300 bg-bg sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-text transition-colors"
            title="Back to dashboard"
          >
            <Logo />
          </button>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                Signed in as
              </p>
              <p className="text-sm text-text font-medium">{user?.email}</p>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-text hover:bg-surface transition-colors border border-neutral-300"
              title="Sign out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-12">
        <ScribeApp />
      </main>
    </div>
  );
}
