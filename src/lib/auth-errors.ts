/**
 * Auth error handling — user-friendly French messages and classification
 * helpers for the auth flows (signin, signup, password reset, email
 * verification).
 *
 * better-auth returns errors with `code` and/or `message`; thrown errors may
 * carry the raw message (network, proxy). This module centralizes the string
 * matching so pages stay presentation-only.
 */

/** Server outage / network cut — no status or a 5xx response. */
export function isAuthServiceUnavailable(error: { status?: number }): boolean {
  return !error.status || error.status >= 500;
}

/** Shown when the account exists but the email hasn't been verified. */
export const EMAIL_NOT_VERIFIED_MESSAGE =
  "Adresse e-mail non vérifiée. Consultez votre boîte de réception et cliquez sur le lien de vérification pour activer votre compte.";

/** Server outage / network cut — shared copy across the auth pages. */
export const AUTH_SERVICE_UNAVAILABLE_MESSAGE =
  "Service d'authentification indisponible. Veuillez réessayer dans quelques instants.";

/** Password policy message shared by signup and password reset. */
export const PASSWORD_LENGTH_MESSAGE =
  "Le mot de passe doit contenir entre 8 et 128 caractères.";

/** Maps a better-auth sign-in error to a user-friendly French message. Checks `error.code` first, then `error.message`. */
export function mapSignInError(error: {
  code?: string;
  message?: string;
}): string {
  const code = error.code?.toUpperCase();
  const message = error.message?.toUpperCase() || "";

  if (
    code === "EMAIL_NOT_VERIFIED" ||
    message.includes("EMAIL NOT VERIFIED") ||
    message.includes("EMAIL_NOT_VERIFIED")
  ) {
    return EMAIL_NOT_VERIFIED_MESSAGE;
  }

  if (
    code === "INVALID_EMAIL_OR_PASSWORD" ||
    message.includes("INVALID EMAIL OR PASSWORD")
  ) {
    return "E-mail ou mot de passe incorrect. Vérifiez votre saisie, puis réessayez.";
  }

  return "Connexion impossible pour le moment. Vérifiez votre connexion, puis réessayez.";
}

/** Maps a thrown sign-in error (network/proxy) — the raw message may still carry the verification hint. */
export function mapNetworkSignInError(error: unknown): string {
  const message = error instanceof Error ? error.message?.toUpperCase() : "";
  if (
    message.includes("EMAIL NOT VERIFIED") ||
    message.includes("EMAIL_NOT_VERIFIED")
  ) {
    return EMAIL_NOT_VERIFIED_MESSAGE;
  }
  return AUTH_SERVICE_UNAVAILABLE_MESSAGE;
}

export interface SignUpErrorMapping {
  /** Whether an account already exists for this email (drives the "sign in instead" link). */
  existingAccount: boolean;
  message: string;
}

/** Maps a better-auth sign-up error; flags pre-existing accounts so the page can propose signing in. */
export function mapSignUpError(error: {
  code?: string;
  message?: string;
}): SignUpErrorMapping {
  const message = (error.message ?? "").toLowerCase();

  if (message.includes("already exists") || message.includes("user exists")) {
    return {
      existingAccount: true,
      message:
        "Un compte existe déjà avec cet e-mail. Vous pouvez vous connecter directement.",
    };
  }

  if (message.includes("too short") || message.includes("too long")) {
    return { existingAccount: false, message: PASSWORD_LENGTH_MESSAGE };
  }

  return {
    existingAccount: false,
    message:
      "Inscription impossible pour le moment. Vérifiez votre connexion, puis réessayez.",
  };
}

/** Maps a better-auth reset-password error to a user-friendly French message. */
export function mapResetPasswordError(error: { message?: string }): string {
  const message = (error.message ?? "").toUpperCase();

  if (message.includes("INVALID_TOKEN")) {
    return "Ce lien a expiré ou a déjà été utilisé. Demandez un nouveau lien.";
  }
  if (message.includes("TOO_SHORT") || message.includes("TOO_LONG")) {
    return PASSWORD_LENGTH_MESSAGE;
  }
  return "Modification impossible. Vérifiez votre connexion, puis réessayez.";
}

/** Maps a better-auth verification error to a user-friendly French message. Checks `error.code` first, then `error.message`. */
export function mapVerificationError(error: {
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

  if (isAuthServiceUnavailable(error)) {
    return AUTH_SERVICE_UNAVAILABLE_MESSAGE;
  }

  return "Vérification impossible pour le moment. Réessayez ou demandez un nouvel email.";
}
