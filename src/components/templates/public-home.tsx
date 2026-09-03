import { FeaturesSection } from "@/components/organisms/features-section";
import { JoinCta } from "@/components/organisms/join-cta";
import { MarketingHero } from "@/components/organisms/marketing-hero";
import { TestimonialsSection } from "@/components/organisms/testimonials-section";

/**
 * Content of the public page (logged-out visitor) — the shell (navbar +
 * footer) is provided by the (site) route group layout.
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
