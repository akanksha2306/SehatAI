import React from 'react';
import { useNavigate } from 'react-router';
import { ScribeApp } from '../features/scribe/organisms/scribe-app';
import { AppHeader } from '../components/app-header';

export function Scribe(): React.ReactElement {
  const navigate = useNavigate();

  const handleBack = (): void => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <AppHeader showBackButton onBack={handleBack} />

      {/* Main Content */}
      <main className="flex-1 px-6 py-12">
        <ScribeApp />
      </main>
    </div>
  );
}
