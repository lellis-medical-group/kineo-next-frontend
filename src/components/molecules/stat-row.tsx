export interface StatRowProps {
  label: string;
  value: string;
  /** Highlights the value in green (positive indicator). */
  accent?: boolean;
}

export function StatRow({ label, value, accent = false }: StatRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3.5 last:border-b-0">
      <span className="text-sm text-muted">{label}</span>
      <span
        className={`text-sm font-bold ${accent ? "text-success" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}
