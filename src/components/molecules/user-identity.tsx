import Link from "next/link";
import { Avatar } from "@/components/atoms/avatar";

export interface UserIdentityProps {
  name: string;
  subtitle: string;
  /** Classes pour la zone texte (permet de la masquer sur petits écrans). */
  textClassName?: string;
  /** Si fourni, toute l'identité devient un lien (ex. vers /profile). */
  href?: string;
}

/** Affiche l'utilisateur courant : prénom/rôle + avatar circulaire. */
export function UserIdentity({
  name,
  subtitle,
  textClassName = "",
  href,
}: UserIdentityProps) {
  const content = (
    <>
      <div className={`min-w-0 text-right ${textClassName}`}>
        <p className="truncate text-sm font-bold text-foreground">{name}</p>
        <p className="truncate text-xs text-muted">{subtitle}</p>
      </div>

      <Avatar name={name} />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`Profil de ${name}`}
        className="flex items-center gap-3 rounded-full transition-opacity hover:opacity-80"
      >
        {content}
      </Link>
    );
  }

  return <div className="flex items-center gap-3">{content}</div>;
}
