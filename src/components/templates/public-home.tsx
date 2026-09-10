import { FeaturesSection } from "@/components/organisms/features-section";
import { JoinCta } from "@/components/organisms/join-cta";
import { MarketingHero } from "@/components/organisms/marketing-hero";
import { TestimonialsSection } from "@/components/organisms/testimonials-section";

/**
 * Public page content (unauthenticated visitor). Shell provided by the (site) layout.
 * Conversion flow (matches the landing mockup): hero → features → testimonials → action.
 */
export function PublicHome() {
  return (
    <>
      <MarketingHero />
      <FeaturesSection />
      <TestimonialsSection />
      <JoinCta />
    </>
  );
}
