import Link from "next/link";
import { Avatar } from "@/components/atoms/avatar";

export interface UserIdentityProps {
  name: string;
  subtitle: string;
  /** Hides the name/role block (e.g. avatar-only in the navbar). */
  showText?: boolean;
  /** When set, the whole identity becomes a link (e.g. to /profile). */
  href?: string;
}

/**
 * Shows the current user: name/role + circular avatar.
 * In compact mode (showText=false) only the avatar is rendered, with an
 * accessible tooltip (title) carrying the name.
 */
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
