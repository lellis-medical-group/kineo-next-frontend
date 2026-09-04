import type { ReactNode } from "react";

export type InlineAlertTone = "info" | "success" | "warning" | "danger";

const TONE_CLASSES: Record<InlineAlertTone, string> = {
  info: "border-primary/30 bg-primary/10",
  success: "border-success/30 bg-success/10",
  warning: "border-warning/30 bg-warning/10",
  danger: "border-danger/25 bg-danger/10 text-danger",
};

export interface InlineAlertProps {
  tone?: InlineAlertTone;
  /**
   * `p` : erreur bloquante (annonce via role="alert") ·
   * `output` : résultat d'action (confirmation, envoi…).
   */
  as?: "p" | "output" | "div";
  className?: string;
  children: ReactNode;
}

/**
 * Message inline de formulaire — regroupe les styles précédemment dupliqués
 * dans les pages d'authentification (erreurs et confirmations).
 */
export function InlineAlert({
  tone = "info",
  as: Component = "output",
  className = "",
  children,
}: InlineAlertProps) {
  return (
    <Component
      {...(Component === "p" ? { role: "alert" } : {})}
      className={`rounded-lg border px-3.5 py-2.5 text-sm leading-relaxed ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </Component>
  );
}
