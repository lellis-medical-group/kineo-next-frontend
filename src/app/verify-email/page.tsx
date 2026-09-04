"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Spinner } from "@/components/atoms/spinner";
import { InlineAlert } from "@/components/molecules/inline-alert";
import { AuthCard } from "@/components/organisms/auth-card";
import {
  checkAlreadyVerified,
  sendVerificationEmail,
  verifyEmail,
} from "@/lib/auth-client";

type VerificationStatus = "verifying" | "success" | "error" | "invalid";
type ResendStatus = "idle" | "sending" | "sent" | "error";

type AuthError = Parameters<typeof mapVerificationError>[0];

/**
 * N'accepte qu'un chemin interne (un seul « / » initial) afin d'éviter toute
 * redirection ouverte vers un domaine externe.
 */
function safeCallbackURL(raw: string | null): string {
  if (raw?.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }
  return "/";
}

/**
 * Convertit une erreur better-auth en message français compréhensible.
 * Vérifie `error.code` en priorité, puis `error.message`.
 */
function mapVerificationError(error: {
  code?: string | null;
  message?: string | null;
  status?: number;
}): string {
  const code = (error.code ?? "").toUpperCase();
  const message = (error.message ?? "").toUpperCase();

  if (code === "TOKEN_EXPIRED" || message.includes("TOKEN_EXPIRED")) {
    return "Ce lien de vérification a expiré. Demandez un nouvel email ci-dessous.";
  }

  if (code === "INVALID_TOKEN" || message.includes("INVALID_TOKEN")) {
    return "Ce lien de vérification est invalide ou a déjà été utilisé.";
  }

  if (code === "USER_NOT_FOUND" || message.includes("USER_NOT_FOUND")) {
    return "Aucun compte ne correspond à ce lien de vérification.";
  }

  if (!error.status || error.status >= 500) {
    return "Service d'authentification indisponible. Veuillez réessayer dans quelques instants.";
  }

  return "Vérification impossible pour le moment. Réessayez ou demandez un nouvel email.";
}

function FullscreenSpinner() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background">
      <output aria-label="Chargement">
        <Spinner className="h-8 w-8 border-primary/20 border-t-primary" />
      </output>
    </main>
  );
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const callbackURL = safeCallbackURL(searchParams.get("callbackURL"));
  const email = searchParams.get("email");
  const [status, setStatus] = useState<VerificationStatus>(
    token ? "verifying" : "invalid",
  );
  const [verifyError, setVerifyError] = useState("");
  const [resend, setResend] = useState<ResendStatus>("idle");

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    (async () => {
      const { error } = await verifyEmail({ query: { token } }).catch(
        (): { error: AuthError } => ({ error: { status: 0 } }),
      );

      if (cancelled) {
        return;
      }

      if (!error) {
        setStatus("success");
        return;
      }

      // Lien expiré ou déjà consommé : si l'adresse est déjà vérifiée, on
      // affiche l'écran de succès plutôt qu'une erreur.
      if (await checkAlreadyVerified(token)) {
        if (!cancelled) {
          setStatus("success");
        }
        return;
      }

      if (cancelled) {
        return;
      }

      setStatus("error");
      setVerifyError(mapVerificationError(error));
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleResend() {
    if (!email) {
      return;
    }

    setResend("sending");
    try {
      const { error } = await sendVerificationEmail({ email });
      setResend(error ? "error" : "sent");
    } catch {
      setResend("error");
    }
  }

  if (status === "invalid" || status === "error") {
    return (
      <AuthCard
        title={status === "error" ? "Vérification impossible" : "Lien invalide"}
        subtitle={
          status === "error"
            ? "Nous n'avons pas pu valider votre adresse e-mail"
            : "Ce lien de vérification est incomplet"
        }
      >
        <div className="space-y-6 text-center">
          <p className="text-sm leading-relaxed text-muted">
            {status === "error"
              ? verifyError
              : "Connectez-vous pour recevoir un nouveau lien de vérification si votre adresse n'est pas encore validée."}
          </p>

          {resend === "sent" ? (
            <InlineAlert tone="info" className="px-4 py-3.5">
              Si un compte existe avec cette adresse, un nouvel email de
              vérification vient de partir. Pensez à vérifier vos spams.
            </InlineAlert>
          ) : null}

          {email && resend !== "sent" ? (
            <>
              <Button
                onClick={handleResend}
                disabled={resend === "sending"}
                size="lg"
                className="w-full"
              >
                {resend === "sending" && (
                  <Spinner className="h-4 w-4 border-primary-foreground/30 border-t-primary-foreground" />
                )}
                {resend === "sending"
                  ? "Envoi en cours..."
                  : "Renvoyer l'email de vérification"}
              </Button>

              {resend === "error" ? (
                <InlineAlert as="p" tone="danger">
                  L&apos;envoi a échoué. Vérifiez votre connexion, puis
                  réessayez.
                </InlineAlert>
              ) : null}
            </>
          ) : null}

          <Button href="/signin" size="lg" className="w-full">
            Se connecter
          </Button>
        </div>
      </AuthCard>
    );
  }

  if (status === "success") {
    return (
      <AuthCard
        title="Adresse e-mail vérifiée"
        subtitle="Votre compte est désormais actif"
      >
        <div className="space-y-6">
          <InlineAlert tone="info" className="px-4 py-3.5">
            Vous êtes connecté. Vous pouvez accéder à votre espace dès
            maintenant.
          </InlineAlert>

          <Button
            onClick={() => {
              router.push(callbackURL);
              router.refresh();
            }}
            size="lg"
            className="w-full"
          >
            Continuer
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Vérification en cours"
      subtitle="Nous validons votre adresse e-mail"
    >
      <div className="flex justify-center">
        <output aria-label="Vérification en cours">
          <Spinner className="h-8 w-8 border-primary/20 border-t-primary" />
        </output>
      </div>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<FullscreenSpinner />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
