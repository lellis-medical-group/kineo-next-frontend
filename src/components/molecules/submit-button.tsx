"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/atoms/button";
import { Spinner } from "@/components/atoms/spinner";

export interface SubmitButtonProps {
  /** Libellé au repos. */
  label: string;
  /** Libellé affiché pendant la soumission. */
  pendingLabel?: string;
}

/**
 * Bouton de soumission de formulaire : lit l'état `pending` du formulaire
 * parent (useFormStatus), se désactive et affiche un spinner.
 * Molécule réutilisée par toutes les pages d'authentification.
 */
export function SubmitButton({
  label,
  pendingLabel = `${label}...`,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} size="lg" className="mt-2 w-full">
      {pending && (
        <Spinner className="h-4 w-4 border-primary-foreground/30 border-t-primary-foreground" />
      )}
      {pending ? pendingLabel : label}
    </Button>
  );
}
