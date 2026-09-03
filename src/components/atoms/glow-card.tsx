import type { ReactNode } from "react";

export interface GlowCardProps {
  /** Classes wrappers (marge externe, largeur…). */
  className?: string;
  /** Classes du contenu (padding, disposition…). */
  innerClassName?: string;
  children: ReactNode;
}

/**
 * Carte avec contour animé (dégradé conique tournant) et halo de
 * surbrillance. Le fond reste la surface du thème.
 */
export function GlowCard({
  className = "",
  innerClassName = "",
  children,
}: GlowCardProps) {
  return (
    <div className={`glow-card ${className}`}>
      <div className={`glow-card-inner ${innerClassName}`}>{children}</div>
    </div>
  );
}
