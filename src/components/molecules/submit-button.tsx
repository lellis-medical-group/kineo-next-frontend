"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/atoms/button";
import { Spinner } from "@/components/atoms/spinner";

export interface SubmitButtonProps {
  /** Idle label. */
  label: string;
  /** Label shown during submission. */
  pendingLabel?: string;
}

/** Form submit button: reads parent `pending` state (useFormStatus), disables and shows a spinner. */
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
