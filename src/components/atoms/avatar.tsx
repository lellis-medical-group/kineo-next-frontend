import { forwardRef } from "react";

export interface AvatarProps {
  /** Nom complet ; l'initiale (sans le préfixe « Dr. ») est affichée. */
  name: string;
  /** Classes supplémentaires (taille…) */
  className?: string;
}

/**
 * Avatar circulaire avec initiale — atome visuel réutilisable.
 * Rendu pur, aucune dépendance (SRP) ; stylé via les tokens du thème.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, className = "" },
  ref,
) {
  const initial =
    name
      .replace(/^Dr\.?\s*/i, "")
      .charAt(0)
      .toUpperCase() || "K";

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/60 bg-surface text-sm font-bold text-primary ${className}`}
    >
      {initial}
    </span>
  );
});
