import type { ReactNode } from "react";

export type InlineAlertTone = "info" | "success" | "warning" | "danger";

const TONE_CLASSES: Record<InlineAlertTone, string> = {
  info: "border-primary/30 bg-primary/10",
  success: "border-success/30 bg-success/10",
  warning: "border-warning/30 bg-warning/10",
  danger: "border-danger/25 bg-danger/10 text-danger",
};

/**
 * Layout per element type: `p` (compact error) vs `output`/`div` (spacious confirmation).
 * Avoids utility class conflicts — without tailwind-merge, competing classes
 * have an unpredictable winner.
 */
const ELEMENT_CLASSES: Record<InlineAlertProps["as"] & string, string> = {
  p: "block px-3.5 py-2.5",
  output: "block px-4 py-3.5",
  div: "block px-4 py-3.5",
};

export interface InlineAlertProps {
  tone?: InlineAlertTone;
  /** `p`: blocking error (announced via role="alert") · `output`: action result (confirmation). */
  as?: "p" | "output" | "div";
  className?: string;
  children: ReactNode;
}

/** Form inline message — consolidates styles previously duplicated across auth pages. */
export function InlineAlert({
  tone = "info",
  as: Component = "output",
  className = "",
  children,
}: InlineAlertProps) {
  return (
    <Component
      {...(Component === "p" ? { role: "alert" } : {})}
      className={`rounded-lg border text-sm leading-relaxed ${TONE_CLASSES[tone]} ${ELEMENT_CLASSES[Component]} ${className}`}
    >
      {children}
    </Component>
  );
}
