import type { CSSProperties } from "react";
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

const heroDelay = (ms: number) =>
  ({
    "--hero-delay": `${ms}ms`,
  }) as CSSProperties;

export function MarketingHero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-4xl px-4 pb-2 pt-16 text-center sm:px-6 sm:pb-2 sm:pt-20 lg:pt-24">
        <div className="hero-enter" style={heroDelay(0)}>
          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-border-strong bg-surface-2 px-3.5 py-1.5 text-sm font-bold text-foreground">
            {hero.eyebrow}
          </span>
        </div>

        <h1
          className="hero-enter mt-5 text-4xl leading-tight font-bold tracking-tight sm:text-5xl"
          style={heroDelay(60)}
        >
          {hero.title} <span className="text-primary">{hero.titleAccent}</span>
        </h1>

        <p
          className="hero-enter mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          style={heroDelay(120)}
        >
          {hero.subtitle}
        </p>

        <div
          className="hero-enter mt-8 flex flex-col justify-center gap-3 sm:flex-row"
          style={heroDelay(200)}
        >
          <Button href={hero.primaryCta.href} size="lg" className="btn-shine">
            {hero.primaryCta.label}
          </Button>
          <Button href={hero.secondaryCta.href} variant="outline" size="lg">
            {hero.secondaryCta.label}
          </Button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-14">
        <p
          className="hero-enter mb-5 text-center text-xs font-bold tracking-widest text-muted uppercase"
          style={heroDelay(280)}
        >
          {trustBar.eyebrow}
        </p>
        <div
          className="hero-enter grid gap-3 sm:grid-cols-3"
          style={heroDelay(340)}
        >
          {trustBar.items.map((item) => (
            <TrustBadge
              key={item.label}
              icon={TRUST_ICONS[item.icon]}
              label={item.label}
              detail={item.detail}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
