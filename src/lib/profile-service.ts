/**
 * Profile data service — fetch, create and update the current user's profile.
 * Soft/blocking 404 policy: only GET /profile/me treats 404 as expected.
 */

import { ApiError, apiFetch, notFoundAs } from "./api-client";
import type { ProfileFormData } from "./profile";
import type { ApiProfile } from "./types/api";

/**
 * GET /profile/me — soft 404 when the profile does not exist yet (documented
 * by the API); returns null so callers can show the create form instead.
 */
export async function fetchMyProfile(): Promise<ApiProfile | null> {
  return apiFetch<ApiProfile>("/profile/me").catch(notFoundAs(null));
}

/** POST /profile — creates the profile for the current user (201, 403, 409). */
export async function createProfile(
  payload: ProfileFormData,
): Promise<ApiProfile> {
  return apiFetch<ApiProfile>("/profile", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PATCH /profile/{id} — partial update of an existing profile. */
export async function updateProfile(
  id: string,
  payload: ProfileFormData,
): Promise<ApiProfile> {
  return apiFetch<ApiProfile>(`/profile/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/** Maps an API error to a user-facing French message. */
export function mapProfileError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return "Ce numéro RPPS est déjà utilisé par un autre profil.";
    }
    if (error.apiMessage) {
      return error.apiMessage;
    }
    if (error.status === 401) {
      return "Votre session a expiré. Veuillez vous reconnecter.";
    }
    if (error.status === 403) {
      return "Action non autorisée. Vérifiez que votre adresse e-mail est validée.";
    }
  }
  return "Impossible d'enregistrer le profil. Vérifiez votre connexion, puis réessayez.";
}
