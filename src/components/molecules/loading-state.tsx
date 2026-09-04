import { Spinner } from "@/components/atoms/spinner";

export interface LoadingStateProps {
  /** Accessible label announced to screen readers. */
  label?: string;
  /** Vertical space + extra layout classes (e.g. "min-h-dvh bg-background"). */
  className?: string;
}

/** Centered page/section loader — consolidates the spinner pattern used across auth and profile pages. */
export function LoadingState({
  label = "Chargement",
  className = "min-h-[50vh]",
}: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center px-4 ${className}`}>
      <output aria-label={label}>
        <Spinner className="h-8 w-8 border-primary/20 border-t-primary" />
      </output>
    </div>
  );
}
