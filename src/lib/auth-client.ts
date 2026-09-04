import { createAuthClient } from "better-auth/react";

const frontendURL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL: `${frontendURL}/api/auth`,
  fetchOptions: {
    credentials: "include",
  },
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  getSession,
} = authClient;

export async function checkAlreadyVerified(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/auth/check-email-verification?token=${encodeURIComponent(token)}`,
    );

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as { verified?: boolean };

    return data.verified === true;
  } catch {
    return false;
  }
}
