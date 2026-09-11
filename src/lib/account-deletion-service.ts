/**
 * Account-deletion confirmation service — calls the sessionless backend
 * endpoint. The email link alone is enough: better-auth's delete-user route
 * requires an active session cookie at click time (different browser, expired
 * session or blocked cookies → false "invalid link"), while this endpoint
 * trusts the single-use `delete-account-*` token (24h) as proof of identity.
 */

import { ApiError, apiFetch } from "./api-client";

/** POST /account/confirm-deletion — confirms deletion with the email token, no session needed. */
export async function confirmAccountDeletion(token: string): Promise<void> {
  try {
    await apiFetch<{ success: boolean; message: string }>(
      "/account/confirm-deletion",
      {
        method: "POST",
        body: JSON.stringify({ token }),
      },
    );
  } catch (error) {
    throw new Error(mapConfirmDeletionError(error));
  }
}

/** Maps a confirm-deletion API error to a user-facing French message. */
function mapConfirmDeletionError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 410) {
      return (
        error.apiMessage ??
        "Ce lien de confirmation a expiré (valable 24 heures). Relancez la demande depuis votre profil."
      );
    }
    if (error.status === 404) {
      return (
        error.apiMessage ??
        "Ce lien de confirmation est invalide ou a déjà été utilisé. Votre compte n'a pas été supprimé ; vous pouvez relancer la demande depuis votre profil."
      );
    }
    if (error.status === 429) {
      return "Trop de tentatives. Patientez quelques instants, puis réessayez.";
    }
    if (error.status >= 500) {
      return "Service indisponible. Veuillez réessayer dans quelques instants.";
    }
  }
  return "Suppression impossible pour le moment. Vérifiez votre connexion, puis réessayez.";
}
