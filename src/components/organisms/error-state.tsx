"use client";

import { Button } from "@/components/atoms/button";

/**
 * Full-area error screen with retry. `message` is a raw ApiError string
 * (`API {status} (…): …`), classified into user-friendly French copy.
 */
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 rounded-full bg-danger/10 p-4">
        <svg
          className="h-8 w-8 text-danger"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-lg font-semibold text-foreground">
        Impossible de charger vos données
      </h2>
      <p className="mb-2 text-sm text-muted">
        {/* ApiError format: `API {status} (…): …` */}
        {/^API (401|403)\b/.test(message)
          ? "Votre session a expiré. Veuillez vous reconnecter."
          : /^API 404\b/.test(message)
            ? "Cette information n'est pas disponible. Veuillez réessayer."
            : "Le service est temporairement indisponible. Veuillez réessayer."}
      </p>
      {isDev && message && (
        <p className="mb-4 max-w-sm wrap-break-word rounded bg-surface px-3 py-2 font-mono text-xs text-muted">
          [dev] {message}
        </p>
      )}
      <Button onClick={onRetry}>Réessayer</Button>
    </div>
  );
}
