import { MapPinIcon, PencilIcon, UsersIcon } from "@/components/atoms/icons";
import { Reveal } from "@/components/atoms/reveal";
import { SectionHeading } from "@/components/atoms/section-heading";
import { FeatureCard } from "@/components/molecules/feature-card";
import { featuresSection } from "@/lib/marketing";

const FEATURE_ICONS = {
  pencil: PencilIcon,
  users: UsersIcon,
  mapPin: MapPinIcon,
} as const;

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="scroll-mt-20 border-b border-border bg-background"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          title={featuresSection.title}
          subtitle={featuresSection.subtitle}
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 [&>*:last-child:nth-child(2n+1)]:sm:col-span-2 [&>*:last-child:nth-child(2n+1)]:lg:col-span-1">
          {featuresSection.features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 80} className="h-full">
              <FeatureCard
                icon={FEATURE_ICONS[feature.icon]}
                title={feature.title}
                description={feature.description}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
