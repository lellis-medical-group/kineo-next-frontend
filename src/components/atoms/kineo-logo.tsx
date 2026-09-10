import { cn } from "@/lib/cn";

export function KineoLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-[0.6rem] border-2 border-primary text-base font-bold text-primary sm:h-9 sm:w-9 sm:rounded-[0.7rem] sm:text-lg"
      >
        K
      </span>
      <span className="text-lg font-bold tracking-tight sm:text-[1.35rem]">
        Kineo
      </span>
    </span>
  );
}
