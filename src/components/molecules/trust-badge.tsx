import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/cn";

export interface TrustBadgeProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  /** Supporting detail backing the claim. */
  detail?: string;
  className?: string;
}

export function TrustBadge({
  icon: Icon,
  label,
  detail,
  className,
}: TrustBadgeProps) {
  return (
    <span
      className={cn(
        "flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-surface p-4 text-center",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary"
      >
        <Icon />
      </span>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {detail && (
        <span className="text-xs leading-snug text-muted">{detail}</span>
      )}
    </span>
  );
}
