import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/auth-context";

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): React.ReactElement {
  const { isAuthenticated, isLoading, onboarded } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If accessing dashboard but not onboarded, redirect to onboarding
  if (location.pathname === "/dashboard" && !onboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
