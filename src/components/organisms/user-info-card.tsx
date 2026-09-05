"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { PencilIcon, UserIcon } from "@/components/atoms/icons";
import { InlineAlert } from "@/components/molecules/inline-alert";
import { SubmitButton } from "@/components/molecules/submit-button";
import type { ApiUser } from "@/lib/types/api";
import { mapUserError, updateUserInfo } from "@/lib/user-service";

export function UserInfoCard({ user }: { user: ApiUser }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setSaved(false);
    const name = (formData.get("name") as string).trim();
    const image = (formData.get("image") as string).trim() || null;

    try {
      await updateUserInfo({ name, image });
      setSaved(true);
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(mapUserError(err));
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
        >
          <UserIcon />
        </span>
        <h2 className="text-base font-bold">Informations du compte</h2>
      </div>

      {saved && (
        <InlineAlert tone="success" className="mt-4">
          Vos informations ont été mises à jour.
        </InlineAlert>
      )}

      {editing ? (
        <form action={handleSubmit} className="mt-4 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="field-label">Nom complet</span>
            <input
              name="name"
              type="text"
              required
              defaultValue={user.name ?? ""}
              autoComplete="name"
              placeholder="Dr Jean Dupont"
              className="field-input"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="field-label">Image (URL)</span>
            <input
              name="image"
              type="url"
              defaultValue={user.image ?? ""}
              placeholder="https://exemple.fr/photo.jpg"
              className="field-input"
            />
          </label>

          {error && (
            <InlineAlert as="p" tone="danger">
              {error}
            </InlineAlert>
          )}

          <div className="flex gap-3">
            <SubmitButton
              label="Enregistrer"
              pendingLabel="Enregistrement..."
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditing(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-4">
            <Avatar
              name={user.name ?? user.email}
              className="h-14 w-14 shrink-0 text-lg"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">
                {user.name ?? "Non renseigné"}
              </p>
              <p className="truncate text-sm text-muted">{user.email}</p>
            </div>
          </div>

          <dl className="grid gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Email vérifié</dt>
              <dd className="font-medium">
                {user.emailVerified ? "Oui" : "Non"}
              </dd>
            </div>
            {user.image && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Image</dt>
                <dd className="max-w-[12rem] truncate font-medium text-primary">
                  {user.image}
                </dd>
              </div>
            )}
          </dl>

          <div className="pt-1">
            <Button variant="outline" onClick={() => setEditing(true)}>
              <PencilIcon className="h-4 w-4" />
              Modifier
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
