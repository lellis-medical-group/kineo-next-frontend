import Image from "next/image";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface AvatarProps {
  name: string;
  /** Image URL — when provided, renders the picture instead of the initial. */
  image?: string | null;
  /** Additional classes (size…). */
  className?: string;
}

/** Circular avatar with initial or profile image. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, image, className },
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
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/60 bg-surface text-sm font-bold text-primary",
        className,
      )}
    >
      {image ? (
        <Image src={image} alt="" fill unoptimized className="object-cover" />
      ) : (
        initial
      )}
    </span>
  );
});
