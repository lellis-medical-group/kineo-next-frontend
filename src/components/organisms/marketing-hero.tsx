import { Button } from "@/components/atoms/button";
import {
  CalendarIcon,
  PercentIcon,
  ShieldIcon,
} from "@/components/atoms/icons";
import { TrustBadge } from "@/components/molecules/trust-badge";
import { hero, trustBar } from "@/lib/marketing";

const TRUST_ICONS = {
  shield: ShieldIcon,
  calendar: CalendarIcon,
  percent: PercentIcon,
} as const;

export function MarketingHero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-24">
        <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
          {hero.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted">
          {hero.subtitle}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
          <Button href={hero.secondaryCta.href} variant="outline">
            {hero.secondaryCta.label}
          </Button>
        </div>

        <div className="mt-16 sm:mt-20">
          <p className="mb-4 text-xs font-bold tracking-widest text-muted uppercase">
            {trustBar.eyebrow}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {trustBar.items.map((item) => (
              <TrustBadge
                key={item.label}
                icon={TRUST_ICONS[item.icon]}
                label={item.label}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
