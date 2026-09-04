import { FeaturesSection } from "@/components/organisms/features-section";
import { JoinCta } from "@/components/organisms/join-cta";
import { MarketingHero } from "@/components/organisms/marketing-hero";

/** Public page content (unauthenticated visitor). Shell provided by the (site) layout. */
export function PublicHome() {
  return (
    <>
      <MarketingHero />
      <FeaturesSection />
      <JoinCta />
    </>
  );
}
