import { cn } from "@/lib/cn";

export interface FilterChipOption<T extends string> {
  id: T;
  label: string;
  /** Optional counter rendered lighter after the label: « Label (n) ». */
  count?: number;
}

interface FilterChipsProps<T extends string> {
  options: ReadonlyArray<FilterChipOption<T>>;
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  className?: string;
}

/**
 * Row of toggle chips (styles from the global `.chip` class) — used for the
 * status filters of the applications management pages.
 */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: FilterChipsProps<T>) {
  return (
    <fieldset
      aria-label={ariaLabel}
      className={cn("flex flex-wrap gap-2 border-0 p-0", className)}
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            className={cn("chip", active && "is-active")}
            aria-pressed={active}
            onClick={() => onChange(option.id)}
          >
            {option.label}
            {typeof option.count === "number" && (
              <span className="font-normal"> ({option.count})</span>
            )}
          </button>
        );
      })}
    </fieldset>
  );
}
