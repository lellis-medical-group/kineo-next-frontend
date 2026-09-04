import type { ReactNode } from "react";

export type InlineAlertTone = "info" | "success" | "warning" | "danger";

const TONE_CLASSES: Record<InlineAlertTone, string> = {
  info: "border-primary/30 bg-primary/10",
  success: "border-success/30 bg-success/10",
  warning: "border-warning/30 bg-warning/10",
  danger: "border-danger/25 bg-danger/10 text-danger",
};

/**
 * Layout par type d'élément : `p` (erreur compacte) vs `output`/`div`
 * (confirmation aérée). Évite tout conflit de classes utilitaires —
 * sans tailwind-merge, deux classes concurrentes ont un gagnant non garanti.
 */
const ELEMENT_CLASSES: Record<InlineAlertProps["as"] & string, string> = {
  p: "block px-3.5 py-2.5",
  output: "block px-4 py-3.5",
  div: "block px-4 py-3.5",
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
      className={`rounded-lg border text-sm leading-relaxed ${TONE_CLASSES[tone]} ${ELEMENT_CLASSES[Component]} ${className}`}
    >
      {children}
    </Component>
  );
}
