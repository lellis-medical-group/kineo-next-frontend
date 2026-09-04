import type { ReactNode } from "react";

export interface GlowCardProps {
  /** Wrapper classes (margin, width…). */
  className?: string;
  /** Content classes (padding, layout…). */
  innerClassName?: string;
  children: ReactNode;
}

/** Card with animated conic-gradient border and highlight halo. Background stays the theme surface. */
export function GlowCard({
  className = "",
  innerClassName = "",
  children,
}: GlowCardProps) {
  return (
    <div className={`glow-card ${className}`}>
      <div className={`glow-card-inner ${innerClassName}`}>{children}</div>
    </div>
  );
}
