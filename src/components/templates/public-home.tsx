import { FeaturesSection } from "@/components/organisms/features-section";
import { HowItWorksSection } from "@/components/organisms/how-it-works-section";
import { JoinCta } from "@/components/organisms/join-cta";
import { MarketingHero } from "@/components/organisms/marketing-hero";
import { ProofStatsSection } from "@/components/organisms/proof-stats-section";

/**
 * Public page content (unauthenticated visitor). Shell provided by the (site) layout.
 * Conversion flow: value proposition → social proof → method → benefits → action.
 */
export function PublicHome() {
  return (
    <>
      <MarketingHero />
      <ProofStatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <JoinCta />
    </>
  );
}
