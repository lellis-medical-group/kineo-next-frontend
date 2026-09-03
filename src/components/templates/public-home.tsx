import { FeaturesSection } from "@/components/organisms/features-section";
import { JoinCta } from "@/components/organisms/join-cta";
import { MarketingHero } from "@/components/organisms/marketing-hero";
import { TestimonialsSection } from "@/components/organisms/testimonials-section";

/**
 * Contenu de la page publique (visiteur non connecté) — le shell
 * (navbar + footer) est fourni par le layout du route group (site).
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