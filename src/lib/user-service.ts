/**
 * User account service — fetch and update the current user's account info
 * (Better-Auth managed: name, image, email, emailVerified).
 */

import { authClient } from "./auth-client";
import type { ApiUser } from "./types/api";

/** GET /get-session — returns the current user. */
export async function fetchUserInfo(): Promise<ApiUser> {
  const { data, error } = await authClient.getSession();
  if (error || !data?.user) {
    throw error ?? new Error("Failed to fetch user info");
  }
  return data.user as unknown as ApiUser;
}

/** POST /update-user — updates name and/or image. */
export async function updateUserInfo(payload: {
  name?: string;
  image?: string | null;
}): Promise<ApiUser> {
  const { error } = await authClient.updateUser(payload);
  if (error) {
    throw error;
  }
  return fetchUserInfo();
}

/**
 * POST /change-email — requests an email change. If the instance requires
 * verification, a confirmation link is sent to the new address and the email
 * is only updated once verified.
 */
export async function changeEmail(newEmail: string): Promise<ApiUser> {
  const { data, error } = await authClient.changeEmail({ newEmail });
  if (error) {
    throw error;
  }
  const user = (data as { user?: ApiUser }).user;
  if (user) {
    return user as ApiUser;
  }
  return fetchUserInfo();
}

/** Maps an API error to a user-facing French message. */
export function mapUserError(error: unknown): string {
  const status =
    typeof error === "object" && error && "status" in error
      ? (error as { status?: number }).status
      : undefined;
  const message =
    typeof error === "object" && error && "message" in error
      ? (error as { message?: string }).message
      : undefined;

  if (message) return message;
  if (status === 401)
    return "Votre session a expiré. Veuillez vous reconnecter.";
  if (status === 403) return "Action non autorisée.";
  if (status === 409) return "Cet email est déjà utilisé.";
  return "Impossible de mettre à jour vos informations. Veuillez réessayer.";
}
