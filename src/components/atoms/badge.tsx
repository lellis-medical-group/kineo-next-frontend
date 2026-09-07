import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

/**
 * Tones map to the global badge classes of `globals.css` — the site's
 * canonical badge look: pill, status dot and tinted variant per tone.
 */
const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "badge",
  success: "badge badge-success",
  warning: "badge badge-warning",
  danger: "badge badge-danger",
  info: "badge badge-info",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return <span className={cn(TONE_CLASSES[tone], className)}>{children}</span>;
}
