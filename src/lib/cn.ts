import { twMerge } from "tailwind-merge";

/** Merge class names with Tailwind conflict resolution (later wins). */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return twMerge(classes.filter(Boolean).join(" "));
}
