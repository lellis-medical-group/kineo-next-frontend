import { SignupEmailForm } from "@/components/molecules/signup-email-form";
import { joinCta } from "@/lib/marketing";

export function JoinCta() {
  return (
    <section className="bg-surface">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {joinCta.title}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
            {joinCta.subtitle}
          </p>
        </div>

        <SignupEmailForm
          placeholder={joinCta.emailPlaceholder}
          submitLabel={joinCta.submitLabel}
        />
      </div>
    </section>
  );
}
