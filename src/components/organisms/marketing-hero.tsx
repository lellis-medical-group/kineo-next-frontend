import { Button } from "@/components/atoms/button";
import {
  CalendarIcon,
  PercentIcon,
  ShieldIcon,
} from "@/components/atoms/icons";
import { ConsoleCard } from "@/components/molecules/console-card";
import { TrustBadge } from "@/components/molecules/trust-badge";
import { consoleContract, hero, trustBar } from "@/lib/marketing";

const TRUST_ICONS = {
  shield: ShieldIcon,
  calendar: CalendarIcon,
  percent: PercentIcon,
} as const;

export function MarketingHero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
              {hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="outline">
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>

          <div className="lg:justify-self-end lg:w-full lg:max-w-md">
            <ConsoleCard contract={consoleContract} />
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <p className="mb-4 text-xs font-bold tracking-widest text-muted uppercase">
            {trustBar.eyebrow}
          </p>
          <div className="flex flex-wrap gap-3">
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
