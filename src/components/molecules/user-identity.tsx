import Link from "next/link";
import { Avatar } from "@/components/atoms/avatar";

export interface UserIdentityProps {
  name: string;
  subtitle: string;
  /** Masque le bloc nom/rôle (ex. dans la navbar, avatar seul). */
  showText?: boolean;
  /** Classes pour la zone texte (permet des ajustements fins). */
  textClassName?: string;
  /** Si fourni, toute l'identité devient un lien (ex. vers /profile). */
  href?: string;
}

/**
 * Affiche l'utilisateur courant : prénom/rôle + avatar circulaire.
 * En mode compact (showText=false), seul l'avatar est rendu, avec un
 * tooltip accessible (title) portant le nom.
 */
export function UserIdentity({
  name,
  subtitle,
  showText = true,
  textClassName = "",
  href,
}: UserIdentityProps) {
  const inner = (
    <>
      {showText && (
        <div className={`min-w-0 text-right ${textClassName}`}>
          <p className="truncate text-sm font-bold text-foreground">{name}</p>
          <p className="truncate text-xs text-muted">{subtitle}</p>
        </div>
      )}

      <Avatar name={name} />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`Profil de ${name}`}
        title={name}
        className="flex items-center gap-3 rounded-full transition-opacity hover:opacity-80"
      >
        {inner}
      </Link>
    );
  }

  return <div className="flex items-center gap-3">{inner}</div>;
}
