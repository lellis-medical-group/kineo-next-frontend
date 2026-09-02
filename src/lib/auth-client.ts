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
  resetPassword,
  getSession,
} = authClient;
