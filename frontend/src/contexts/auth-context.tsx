import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient, type AuthUser } from "../lib/api-client";
import { identify, reset as resetAnalytics } from "../lib/analytics";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  onboarded: boolean;
  signOut: () => void;
  /**
   * Tell the shared auth state directly that a user just logged in
   * (bypass or code verification), instead of waiting for a page
   * refresh to pick it up. Without this, ProtectedRoute still sees
   * isAuthenticated=false right after login and bounces back to "/".
   */
  login: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sehatai_token");

    if (token) {
      apiClient
        .getMe()
        .then((data) => {
          setUser(data);
          identify(data.id);
        })
        .catch(() => {
          localStorage.removeItem("sehatai_token");
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const signOut = (): void => {
    localStorage.removeItem("sehatai_token");
    setUser(null);
    resetAnalytics();
  };

  const login = (loggedInUser: AuthUser): void => {
    setUser(loggedInUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        onboarded: (user as unknown as Record<string, unknown>)?.onboarded === true,
        signOut,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
