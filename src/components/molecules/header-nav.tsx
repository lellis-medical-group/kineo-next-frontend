import Link from "next/link";
import type { HeaderLink } from "@/lib/navigation";

export interface HeaderNavProps {
  links: HeaderLink[];
  /** Highlighted link (aria-current="page"). */
  activeHref?: string;
  orientation: "horizontal" | "vertical";
}

/** Navigation link list — shared between the desktop bar and the mobile menu. */
export function HeaderNav({ links, activeHref, orientation }: HeaderNavProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <nav
      aria-label="Navigation principale"
      className={
        isHorizontal
          ? "hidden items-center gap-1.5 lg:flex"
          : "flex flex-col gap-1"
      }
    >
      {links.map((link) => {
        const isActive = activeHref === link.href;
        return (
          <Link
            key={`${link.href}-${link.label}`}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary font-semibold text-primary-foreground"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
