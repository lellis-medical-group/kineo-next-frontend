import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary:
    "border border-border-strong bg-surface-2 text-foreground hover:bg-surface-3",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-surface-hover",
  ghost: "bg-transparent text-foreground hover:bg-surface-hover",
};

export type ButtonSize = "md" | "lg";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-5 py-3 text-sm",
  lg: "px-5 py-3.5 text-[0.9375rem]",
};

export interface ButtonProps {
  /** Visual variant. */
  variant?: ButtonVariant;
  /** md: section actions · lg: primary actions (auth forms). */
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  /** Renders as a Next.js Link styled as a button. */
  href?: string;
  type?: ComponentProps<"button">["type"];
  disabled?: boolean;
  onClick?: ComponentProps<"button">["onClick"];
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  type,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-[0.625rem] font-bold transition-colors disabled:pointer-events-none disabled:opacity-60",
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    className,
  );

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
