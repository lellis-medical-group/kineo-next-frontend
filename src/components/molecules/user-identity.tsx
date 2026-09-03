import { Avatar } from "@/components/atoms/avatar";

export interface UserIdentityProps {
  name: string;
  subtitle: string;
  /** Classes pour la zone texte (permet de la masquer sur petits écrans). */
  textClassName?: string;
}

/** Affiche l'utilisateur courant : prénom/rôle + avatar circulaire. */
export function UserIdentity({
  name,
  subtitle,
  textClassName = "",
}: UserIdentityProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`min-w-0 text-right ${textClassName}`}>
        <p className="truncate text-sm font-bold text-foreground">{name}</p>
        <p className="truncate text-xs text-muted">{subtitle}</p>
      </div>

      <Avatar name={name} />
    </div>
  );
}
