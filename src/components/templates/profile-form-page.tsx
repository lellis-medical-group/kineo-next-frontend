import type { ReactNode } from "react";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { ArrowLeftIcon } from "@/components/atoms/icons";

export interface ProfileFormPageProps {
  backLabel: string;
  onBack: () => void;
  title: string;
  subtitle: string;
  children: ReactNode;
}

/**
 * Shared page shell for /profile/create and /profile/edit: back button,
 * heading and the form card. Removes the duplicated markup between the two
 * orchestrators.
 */
export function ProfileFormPage({
  backLabel,
  onBack,
  title,
  subtitle,
  children,
}: ProfileFormPageProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeftIcon className="h-4 w-4" />
        {backLabel}
      </Button>

      <Card className="p-6 sm:p-8">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{subtitle}</p>

        <div className="mt-6">{children}</div>
      </Card>
    </div>
  );
}
