import { FeaturesSection } from "@/components/organisms/features-section";
import { JoinCta } from "@/components/organisms/join-cta";
import { MarketingHero } from "@/components/organisms/marketing-hero";

/**
 * Contenu de la page publique (visiteur non connecté). Le shell (navbar +
 * footer) est fourni par le layout du groupe de routes (site).
 */
export function PublicHome() {
  return (
    <>
      <MarketingHero />
      <FeaturesSection />
      <JoinCta />
    </>
  );
}
