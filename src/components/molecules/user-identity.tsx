import Link from "next/link";
import { Avatar } from "@/components/atoms/avatar";

export interface UserIdentityProps {
  name: string;
  subtitle: string;
  /** Masque le bloc nom/rôle (avatar seul dans la navbar). */
  showText?: boolean;
  /** Rend l'identité cliquable (ex. vers /profile). */
  href?: string;
}

/** Affiche l'utilisateur courant : nom/rôle + avatar circulaire. */
export function UserIdentity({
  name,
  subtitle,
  showText = true,
  href,
}: UserIdentityProps) {
  const inner = (
    <>
      {showText && (
        <div className="min-w-0 text-right">
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
