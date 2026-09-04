import type { ComponentProps, ReactNode } from "react";

/**
 * Styled select — matches the field-input aesthetic.
 * Replaces the browser's native arrow with a custom chevron icon.
 */
export interface SelectProps extends ComponentProps<"select"> {
  label?: ReactNode;
  hint?: ReactNode;
  id?: string;
}

export function Select({ label, hint, className, id, ...rest }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          aria-label={typeof label === "string" ? label : undefined}
          className={[
            "field-input",
            "appearance-none",
            "pr-10",
            "focus:outline-none",
            "focus:ring-2",
            "focus:ring-ring",
            "focus:ring-offset-0",
            className,
          ].join(" ")}
          {...rest}
        />
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
          <ChevronIcon />
        </div>
      </div>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
