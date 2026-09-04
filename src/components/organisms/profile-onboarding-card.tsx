import { Button } from "@/components/atoms/button";

/**
 * Onboarding banner when the user has no profile yet (GET /profile/me → 404,
 * documented by the API). Account is active, but business data is missing.
 *
 * Inline styled container instead of Card atom: the `primary` tint requires
 * overriding Card's border/background — without tailwind-merge, competing
 * classes have an unpredictable winner (same pitfall as InlineAlert).
 */
export function ProfileOnboardingCard() {
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-bold">
            Complétez votre profil professionnel
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Votre compte est actif, mais votre profil n&apos;est pas encore
            créé. Renseignez votre spécialité et votre type de pratique pour
            publier des annonces et candidater.
          </p>
        </div>

        <Button href="/profile" className="shrink-0">
          Compléter mon profil
        </Button>
      </div>
    </div>
  );
}
