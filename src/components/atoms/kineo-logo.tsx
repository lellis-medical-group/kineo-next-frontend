export function KineoLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-[0.7rem] border-2 border-primary text-lg font-bold text-primary"
      >
        K
      </span>
      <span className="text-[1.35rem] font-bold tracking-tight">Kineo</span>
    </span>
  );
}
