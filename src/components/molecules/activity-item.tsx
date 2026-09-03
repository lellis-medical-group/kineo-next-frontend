import Link from "next/link";
import type { ComponentType, ReactNode, SVGProps } from "react";

export interface ActivityItemProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Rich message: bold segments, names, etc. */
  children: ReactNode;
  timestamp: string;
  /** Optional detail link ("Voir" button). */
  href?: string;
}

export function ActivityItem({
  icon: Icon,
  children,
  timestamp,
  href,
}: ActivityItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-background/40 px-4 py-3.5">
      <span className="shrink-0 text-lg text-primary">
        <Icon />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug">{children}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-muted" />
          {timestamp}
        </p>
      </div>

      {href && (
        <Link
          href={href}
          className="shrink-0 rounded-md px-2 py-1 text-sm text-muted transition-colors hover:text-primary"
        >
          Voir
        </Link>
      )}
    </div>
  );
}
