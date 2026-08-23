import React from "react";
import { cn } from "../../../lib/utils";

export interface OptionCardProps {
  label: string;
  description: string;
  selected: boolean;
  multiSelect: boolean;
  onClick: () => void;
}

export function OptionCard({
  label,
  description,
  selected,
  multiSelect,
  onClick,
}: OptionCardProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-start gap-3.5 text-left w-full p-5 rounded-lg transition-all cursor-pointer shadow-sm",
        selected
          ? "bg-accent-light border-2 border-accent"
          : "bg-surface border-2 border-neutral-300 hover:opacity-90"
      )}
      type="button"
    >
      {/* Selection indicator */}
      <div
        className={cn(
          "flex-none w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-sm transition-all",
          selected
            ? "bg-accent text-white border-2 border-accent"
            : "bg-transparent border-2 border-neutral-300"
        )}
      >
        {multiSelect ? (
          selected ? (
            <span className="text-xs">✓</span>
          ) : null
        ) : selected ? (
          <span className="text-xs">✓</span>
        ) : null}
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text text-base mb-1">{label}</p>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
    </button>
  );
}
