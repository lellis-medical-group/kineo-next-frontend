"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { CheckIcon, PencilIcon } from "@/components/atoms/icons";
import { InlineAlert } from "@/components/molecules/inline-alert";
import { SubmitButton } from "@/components/molecules/submit-button";
import {
  formatMemberSince,
  PROFILE_TYPE_DESCRIPTIONS,
  PROFILE_TYPE_LABELS,
  SPECIALTY_LABELS,
} from "@/lib/profile";
import type { ApiProfile, ApiUser } from "@/lib/types/api";
import { mapUserError, updateUserInfo } from "@/lib/user-service";

export function ProfileHeaderCard({
  user,
  profile,
  onEditProfile,
}: {
  user: ApiUser;
  profile: ApiProfile;
  onEditProfile: () => void;
}) {
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
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar
            name={user.name ?? user.email}
            className="h-16 w-16 shrink-0 text-xl"
          />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight">
              {user.name ?? user.email}
            </h1>
            <p className="mt-0.5 truncate text-sm text-muted">
              {user.email}
              {user.emailVerified && (
                <CheckIcon className="ml-1 inline h-3.5 w-3.5 text-success" />
              )}
            </p>
            <p className="mt-1 text-xs text-faint">
              {PROFILE_TYPE_LABELS[profile.profileType]} ·{" "}
              {SPECIALTY_LABELS[profile.specialty]} · Membre depuis{" "}
              {formatMemberSince(profile.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={onEditProfile}>
            <PencilIcon className="h-4 w-4" />
            Profil pro.
          </Button>
        </div>
      </div>

      {saved && (
        <InlineAlert tone="success" className="mt-4">
          Informations mises à jour.
        </InlineAlert>
      )}

      {user.image && !editing && (
        <p className="mt-3 truncate text-xs text-faint">
          Image : <span className="font-medium text-primary">{user.image}</span>
        </p>
      )}

      <div className="mt-4 border-t border-border pt-4">
        {editing ? (
          <form action={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
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

            <label className="flex flex-col gap-1.5">
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

            <div className="flex gap-2">
              <SubmitButton label="Enregistrer" pendingLabel="En cours..." />
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
          <Button
            type="button"
            variant="ghost"
            onClick={() => setEditing(true)}
          >
            Modifier mes infos
          </Button>
        )}
      </div>

      <p className="mt-4 text-xs text-faint">
        {PROFILE_TYPE_DESCRIPTIONS[profile.profileType]}
      </p>
    </Card>
  );
}
