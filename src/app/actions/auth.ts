// app/actions/auth.ts
"use server";

import { signIn } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await signIn.email({
     email, password
  });

  if (result.error) {
    return { error: result.error.message };
  }

  redirect("/");
}
