import type { ComponentType, SVGProps } from "react";

export interface TrustBadgeProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
}

export function TrustBadge({ icon: Icon, label }: TrustBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground/85">
      <span className="text-primary">
        <Icon />
      </span>
      {label}
    </span>
  );
}
