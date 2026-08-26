import React from "react";
import { Logo } from "./logo";
import { LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { useTheme } from "../contexts/theme-context";
import { useNavigate } from "react-router";
import { cn } from "../lib/utils";

interface AppHeaderProps {
  /**
   * Optional: if true, shows a back button instead of just the logo
   */
  showBackButton?: boolean;
  onBack?: () => void;
}

export function AppHeader({
  showBackButton = false,
  onBack,
}: AppHeaderProps): React.ReactElement {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = (): void => {
    signOut();
  };

  const handleBackClick = (): void => {
    if (onBack) {
      onBack();
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <header className="border-b border-neutral-300 bg-bg sticky top-0 z-10">
      <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        {/* Left: Logo or Back Button */}
        {showBackButton ? (
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-text transition-colors"
            title="Back to dashboard"
          >
            <Logo />
          </button>
        ) : (
          <Logo />
        )}

        {/* Right: User Info + Theme Toggle + Sign Out */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
              "text-neutral-500 hover:text-text hover:bg-surface border border-neutral-300"
            )}
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <Moon size={18} strokeWidth={2} />
            ) : (
              <Sun size={18} strokeWidth={2} />
            )}
          </button>

          {/* User Email */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                Signed in as
              </p>
              <p className="text-sm text-text font-medium">{user?.email}</p>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-text hover:bg-surface transition-colors border border-neutral-300"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
