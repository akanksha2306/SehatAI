import React, { useMemo } from "react";
import { useAuth } from "../contexts/auth-context";
import { Logo } from "../components/logo";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import { Zap, BookOpen, Lightbulb, FileText, LogOut } from "lucide-react";
import { cn } from "../lib/utils";

interface ModuleTile {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  status: "coming-soon" | "active";
  track?: string;
  path?: string;
}

const MODULE_TILES: ModuleTile[] = [
  {
    id: "prompt-lab",
    icon: <Lightbulb size={32} className="text-accent" strokeWidth={1.5} />,
    title: "Prompt Lab",
    description:
      "Seven chapters that teach prompt engineering — role, task, format, techniques — each with a quiz drawn from the lesson.",
    status: "active",
    track: "prompt",
  },
  {
    id: "hall-of-hallucinations",
    icon: <BookOpen size={32} className="text-accent-2" strokeWidth={1.5} />,
    title: "Hall of Hallucinations",
    description:
      "Ten gamified chapters on how AI works and why it hallucinates. Earn credits and keep a streak.",
    status: "active",
    track: "hall",
  },
  {
    id: "ai-scribe",
    icon: <FileText size={32} className="text-accent" strokeWidth={1.5} />,
    title: "AI Scribe",
    description:
      "Record a consultation, transcribe it live, and turn it into the patient's own language and regional dialect.",
    status: "active",
    path: "/scribe",
  },
  {
    id: "workflow",
    icon: <Zap size={32} className="text-accent-2" strokeWidth={1.5} />,
    title: "Build Your Workflow",
    description:
      "Pick one weekly task and automate it. Leave with a workflow you'll actually use.",
    status: "active",
    path: "/workflow",
  },
];

function ModuleCard({
  tile,
  progress,
  onClick,
}: {
  tile: ModuleTile;
  progress?: { completed: number; total: number };
  onClick?: () => void | undefined;
}): React.ReactElement {
  const isComingSoon = tile.status === "coming-soon";

  return (
    <button
      onClick={onClick}
      disabled={isComingSoon}
      className={cn(
        "w-full text-left rounded-xl p-6 border border-neutral-300 transition-all",
        isComingSoon
          ? "bg-surface/50 opacity-75 cursor-not-allowed"
          : "bg-surface hover:border-accent hover:shadow-md cursor-pointer"
      )}
    >
      {/* Icon and Coming Soon Badge */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-14 h-14 rounded-lg flex items-center justify-center",
            tile.id.includes("prompt") || tile.id.includes("scribe")
              ? "bg-accent-light"
              : "bg-accent-2-light"
          )}
        >
          {tile.icon}
        </div>
        {isComingSoon ? (
          <span className="inline-block px-3 py-1 text-xs font-semibold text-neutral-500 bg-neutral-300 rounded-full">
            Coming soon
          </span>
        ) : (
          progress && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-accent-2 bg-accent-2-light rounded-full">
              {progress.completed}/{progress.total}
            </span>
          )
        )}
      </div>

      {/* Title */}
      <h3
        className="text-xl font-semibold text-text mb-2"
        style={{ fontFamily: "var(--heading)" }}
      >
        {tile.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-neutral-500 leading-relaxed">
        {tile.description}
      </p>
    </button>
  );
}

function StatsBar({
  streak,
  credits,
}: {
  streak: number;
  credits: number;
}): React.ReactElement {
  return (
    <div className="flex items-center gap-8 py-4 px-6 bg-surface rounded-lg border border-neutral-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-accent font-bold text-sm">
          🔥
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
            Streak
          </p>
          <p className="text-2xl font-bold text-text">{streak}</p>
        </div>
      </div>

      <div className="w-px h-12 bg-neutral-300" />

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent-2-light flex items-center justify-center text-accent-2 font-bold text-sm">
          ⭐
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
            Credits
          </p>
          <p className="text-2xl font-bold text-text">{credits}</p>
        </div>
      </div>
    </div>
  );
}

export function Dashboard(): React.ReactElement {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiClient.getMe(),
  });

  const { data: promptChapters = [] } = useQuery({
    queryKey: ['courses', 'prompt', 'chapters'],
    queryFn: () => apiClient.getCourseChapters('prompt'),
  });

  const { data: hallChapters = [] } = useQuery({
    queryKey: ['courses', 'hall', 'chapters'],
    queryFn: () => apiClient.getCourseChapters('hall'),
  });

  const stats = useMemo(() => {
    return {
      streak: meData?.stats?.currentStreak ?? 0,
      credits: meData?.stats?.creditsTotal ?? 0,
    };
  }, [meData]);

  const courseProgress = useMemo(() => {
    return {
      prompt: {
        completed: promptChapters.filter((c) => c.completed).length,
        total: promptChapters.length,
      },
      hall: {
        completed: hallChapters.filter((c) => c.completed).length,
        total: hallChapters.length,
      },
    };
  }, [promptChapters, hallChapters]);

  const handleSignOut = (): void => {
    signOut();
  };

  const handleTileClick = (track?: string, path?: string): void => {
    if (path) {
      navigate(path);
    } else if (track) {
      navigate(`/courses/${track}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Header */}
      <header className="border-b border-neutral-300 bg-bg sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
          <Logo />

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
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Section */}
          <section>
            <h1
              className="text-4xl lg:text-5xl font-bold text-text mb-4"
              style={{ fontFamily: "var(--heading)" }}
            >
              Your learning path
            </h1>
            <p className="text-lg text-neutral-500 max-w-2xl">
              Build your confidence with AI safety, prompt engineering, and practical workflows.
              Start with any module below.
            </p>
          </section>

          {/* Stats */}
          <section>
            <StatsBar streak={stats.streak} credits={stats.credits} />
          </section>

          {/* Module Grid */}
          <section>
            <h2
              className="text-2xl font-semibold text-text mb-6"
              style={{ fontFamily: "var(--heading)" }}
            >
              Modules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {MODULE_TILES.map((tile) => (
                <ModuleCard
                  key={tile.id}
                  tile={tile}
                  progress={
                    tile.status === 'active'
                      ? tile.track === 'prompt'
                        ? courseProgress.prompt
                        : tile.track === 'hall'
                          ? courseProgress.hall
                          : undefined
                      : undefined
                  }
                  onClick={() => handleTileClick(tile.track, tile.path)}
                />
              ))}
            </div>
          </section>

          {/* Info Box */}
          <section className="bg-accent-2-light border border-accent-2 rounded-lg p-6 mt-12">
            <h3 className="text-lg font-semibold text-text mb-2">
              Ready to start?
            </h3>
            <p className="text-sm text-neutral-600">
              The modules will open as you progress through your learning path. Each one builds on safety,
              verification, and real clinical workflows.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
