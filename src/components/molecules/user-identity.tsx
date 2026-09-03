export interface UserIdentityProps {
  name: string;
  subtitle: string;
}

export function UserIdentity({ name, subtitle }: UserIdentityProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 text-right">
        <p className="truncate text-sm font-bold">{name}</p>
        <p className="truncate text-xs text-muted">{subtitle}</p>
      </div>

      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
      >
        {name
          .replace(/^Dr\.?\s*/i, "")
          .charAt(0)
          .toUpperCase() || "K"}
      </span>
    </div>
  );
}
