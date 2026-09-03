import { forwardRef } from "react";

export interface AvatarProps {
  /** Full name; the first letter (after a "Dr." prefix) is displayed. */
  name: string;
  /** Extra classes (sizing…) */
  className?: string;
}

/**
 * Circular initials avatar — a reusable visual atom.
 * Pure render, no dependencies (SRP); styled through theme tokens.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, className = "" },
  ref,
) {
  const initial =
    name
      .replace(/^Dr\.?\s*/i, "")
      .charAt(0)
      .toUpperCase() || "K";

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/60 bg-surface text-sm font-bold text-primary ${className}`}
    >
      {initial}
    </span>
  );
});
