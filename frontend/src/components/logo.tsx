import React from "react";
import { Shield } from "lucide-react";
import { cn } from "../lib/utils";

export interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps): React.ReactElement {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white">
        <Shield size={20} strokeWidth={2.5} />
      </div>
      <span className="text-lg font-bold text-text" style={{ fontFamily: "var(--heading)" }}>
        SehatAI
      </span>
    </div>
  );
}
