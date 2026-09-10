import { CountUp } from "@/components/atoms/count-up";
import { Reveal } from "@/components/atoms/reveal";
import { proofStats } from "@/lib/marketing";

export function ProofStatsSection() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
        <Reveal>
          <div className="grid gap-2 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-3 sm:gap-0 sm:px-8 sm:py-12 sm:divide-x sm:divide-border">
            {proofStats.items.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 px-2 py-4 text-center sm:py-0"
              >
                <p className="text-2xl font-bold tracking-tight text-primary tabular-nums sm:text-3xl">
                  <CountUp value={item.value} suffix={item.suffix} />
                </p>
                <p className="text-sm leading-snug text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
