import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export type ButtonVariant = "primary" | "outline" | "ghost";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-surface-hover",
  ghost: "bg-transparent text-foreground hover:bg-surface-hover",
};

export interface ButtonProps {
  /** Style visuel. Toutes les variantes sont substituables (LSP). */
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
  /** Si fourni, rend un lien Next.js stylé identiquement au bouton. */
  href?: string;
  type?: ComponentProps<"button">["type"];
  disabled?: boolean;
  onClick?: ComponentProps<"button">["onClick"];
}

export function Button({
  variant = "primary",
  className = "",
  children,
  href,
  type,
  ...rest
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-[0.625rem] px-5 py-3 text-sm font-bold transition-colors disabled:pointer-events-none disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} className={classes} {...rest}>
      {children}
    </button>
  );
}
