import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind conflict resolution (later wins).
 *
 * Without it, competing utilities (e.g. `bg-surface` + a caller's `bg-primary/5`)
 * have an unpredictable winner — the stylesheet order decides, not the string
 * order. With `cn`, the caller's class always wins predictably.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return twMerge(classes.filter(Boolean).join(" "));
}
